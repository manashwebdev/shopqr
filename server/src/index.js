import express from 'express';import cors from 'cors';import helmet from 'helmet';import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';import crypto from 'node:crypto';import jwt from 'jsonwebtoken';import bcrypt from 'bcryptjs';import {v2 as cloud} from 'cloudinary';
const E=process.env,PROD=E.NODE_ENV==='production',FREE_LIMIT=+(E.FREE_PRODUCT_LIMIT||12);
if(PROD&&!E.JWT_SECRET)throw new Error('JWT_SECRET is required in production');
const SECRET=E.JWT_SECRET||'dev-only';
const app=express();app.set('trust proxy',1);
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}),cors({origin:E.CLIENT_ORIGIN?E.CLIENT_ORIGIN.split(',').map(x=>x.trim().replace(/\/$/,'')):true}),express.json({limit:'6mb'}));
app.use('/api/auth',rateLimit({windowMs:15*60e3,limit:30,message:{error:'Too many attempts. Try again in 15 minutes.'}}));
app.use('/api/ai',rateLimit({windowMs:60e3,limit:15,message:{error:'Slow down — try again in a minute.'}}));
const S=mongoose.Schema;
const User=mongoose.model('User',new S({email:{type:String,unique:true},hash:String,admin:Boolean,tv:{type:Number,default:0},fails:{type:Number,default:0},lockUntil:Date},{timestamps:true}));
const Shop=mongoose.model('Shop',new S({owner:{type:S.Types.ObjectId,index:true},slug:{type:String,unique:true},name:{type:String,required:true,maxlength:80},logo:String,
 description:{type:String,maxlength:400},whatsapp:String,address:String,hours:String,maps:String,currency:{type:String,enum:['₹','$','€','£'],default:'₹'},
 theme:{type:String,enum:['default','diwali','christmas','newyear','summer'],default:'default'},plan:{type:String,enum:['free','pro'],default:'free'},
 verified:{type:Boolean,default:false},categories:[String],views:{type:Number,default:0},scans:{type:Number,default:0},
 clicks:{type:S.Types.Mixed,default:{}},daily:{type:S.Types.Mixed,default:{}},
 products:[{name:{type:String,required:true,maxlength:80},price:{type:Number,min:0},description:{type:String,maxlength:400},category:String,image:String}]},{timestamps:true}));
const wrap=f=>(q,r,n)=>f(q,r,n).catch(e=>r.status(e.code===11000?409:500).json({error:e.code===11000?'That value is already taken':e.message}));
const str=v=>typeof v==='string'?v:'';
const PW=/^(?=.*[A-Za-z])(?=.*\d).{8,72}$/,PWMSG='Password must be 8–72 characters with at least one letter and one number';
const token=u=>jwt.sign({id:u._id,tv:u.tv},SECRET,{expiresIn:'7d',algorithm:'HS256'});
const DUMMY=bcrypt.hashSync('dummy-password-1',12);
const auth=async(q,r,n)=>{let ok=false;try{const d=jwt.verify(str(q.headers.authorization).slice(7),SECRET,{algorithms:['HS256']});
 const u=await User.findById(d.id).select('tv admin');if(u&&u.tv===d.tv){q.user={id:String(u._id),admin:!!u.admin};ok=true}}catch{}
 ok?n():r.status(401).json({error:'Please sign in again'})};
const own=(s,admin)=>{const{owner,...x}=s.toJSON();return{...x,admin}};
const day=()=>new Date().toISOString().slice(0,10);

app.get('/api/health',(q,r)=>r.json({ok:true}));
app.post('/api/auth/register',wrap(async(q,r)=>{const email=str(q.body.email).trim().toLowerCase(),password=str(q.body.password);
 if(!/^\S+@\S+\.\S+$/.test(email)||email.length>120)return r.status(400).json({error:'Enter a valid email address'});
 if(!PW.test(password))return r.status(400).json({error:PWMSG});
 const u=await User.create({email,hash:await bcrypt.hash(password,12)});r.json({token:token(u)})}));
app.post('/api/auth/login',wrap(async(q,r)=>{const email=str(q.body.email).trim().toLowerCase(),password=str(q.body.password).slice(0,72);const u=await User.findOne({email});
 if(u?.lockUntil&&u.lockUntil>new Date())return r.status(429).json({error:`Too many failed attempts. Try again in ${Math.ceil((u.lockUntil-Date.now())/60000)} minutes`});
 const ok=await bcrypt.compare(password,u?u.hash:DUMMY);
 if(!u||!ok){if(u){u.fails++;if(u.fails>=5){u.lockUntil=new Date(Date.now()+15*60e3);u.fails=0}await u.save()}return r.status(401).json({error:'Wrong email or password'})}
 if(u.fails||u.lockUntil){u.fails=0;u.lockUntil=undefined;await u.save()}r.json({token:token(u)})}));
app.post('/api/auth/password',auth,wrap(async(q,r)=>{const u=await User.findById(q.user.id);const nx=str(q.body.next);
 if(!await bcrypt.compare(str(q.body.current).slice(0,72),u.hash))return r.status(403).json({error:'Current password is wrong'});
 if(!PW.test(nx))return r.status(400).json({error:PWMSG});u.hash=await bcrypt.hash(nx,12);u.tv++;await u.save();r.json({token:token(u)})}));
app.post('/api/auth/logout-all',auth,wrap(async(q,r)=>{await User.updateOne({_id:q.user.id},{$inc:{tv:1}});r.json({ok:true})}));
app.delete('/api/auth/account',auth,wrap(async(q,r)=>{const u=await User.findById(q.user.id);
 if(!await bcrypt.compare(str(q.body.password).slice(0,72),u.hash))return r.status(403).json({error:'Password is wrong'});
 await Shop.deleteMany({owner:u._id});await u.deleteOne();r.json({ok:true})}));
app.post('/api/auth/claim-admin',auth,wrap(async(q,r)=>{const x=Buffer.from(str(q.body.code)),y=Buffer.from(E.ADMIN_CODE||'');
 if(!y.length||x.length!==y.length||!crypto.timingSafeEqual(x,y))return r.status(403).json({error:'Invalid code'});await User.updateOne({_id:q.user.id},{admin:true});r.json({admin:true})}));

app.get('/api/shop',auth,wrap(async(q,r)=>{const s=await Shop.findOne({owner:q.user.id});r.json(s?own(s,q.user.admin):{admin:q.user.admin,noShop:true})}));
app.put('/api/shop',auth,wrap(async(q,r)=>{
 const{slug,owner,verified,views,scans,clicks,daily,plan,_id,__v,createdAt,updatedAt,admin,noShop,...data}=q.body;
 if(!data.name?.trim())return r.status(400).json({error:'Shop name is required'});
 let s=await Shop.findOne({owner:q.user.id});
 if(!s){const base=data.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'shop';let sl=base;
  if(await Shop.exists({slug:sl}))sl=`${base}-${Math.random().toString(36).slice(2,6)}`;s=new Shop({owner:q.user.id,slug:sl})}
 if(s.plan==='free'&&(data.products||[]).length>FREE_LIMIT)return r.status(402).json({error:`Free plan allows ${FREE_LIMIT} products. Upgrade to Pro for unlimited.`});
 s.set(data);await s.save();r.json(own(s,q.user.admin))}));
app.post('/api/upload',auth,wrap(async(q,r)=>{if(!/^data:image\//.test(q.body.data||''))return r.status(400).json({error:'Upload an image file'});
 if(!E.CLOUDINARY_URL)return r.json({url:q.body.data});r.json({url:(await cloud.uploader.upload(q.body.data,{folder:'shopqr',transformation:[{width:900,crop:'limit',quality:'auto'}]})).secure_url})}));

const fallback=(n,c)=>`${n} is a freshly prepared${c?` ${c.toLowerCase()}`:''} favourite, made with quality ingredients and served with care.`;
app.post('/api/ai/describe',auth,wrap(async(q,r)=>{const n=(q.body.name||'').trim().slice(0,80),c=(q.body.category||'').slice(0,40);
 if(!n)return r.status(400).json({error:'Enter the product name first'});
 if(!E.GEMINI_API_KEY)return r.json({text:fallback(n,c),source:'template'});
 try{const g=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${E.GEMINI_MODEL||'gemini-2.5-flash'}:generateContent`,
  {method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':E.GEMINI_API_KEY},
  body:JSON.stringify({contents:[{parts:[{text:`Write a appetising, professional product description for a local shop menu. Product: "${n}"${c?`, category: ${c}`:''}. Max 30 words, plain text, no emojis, no quotes, no markdown.`}]}],generationConfig:{maxOutputTokens:120,temperature:.8}})});
  const j=await g.json();const t=j.candidates?.[0]?.content?.parts?.[0]?.text?.trim();if(!t)throw new Error(j.error?.message||'empty');
  r.json({text:t,source:'gemini'})}catch(e){console.error('Gemini:',e.message);r.json({text:fallback(n,c),source:'template'})}}));

app.patch('/api/admin/shop/:slug',auth,wrap(async(q,r)=>{if(!q.user.admin)return r.status(403).json({error:'Admins only'});
 const u={};if('verified' in q.body)u.verified=!!q.body.verified;if(['free','pro'].includes(q.body.plan))u.plan=q.body.plan;
 r.json(await Shop.findOneAndUpdate({slug:q.params.slug},u,{new:true}))}));

app.get('/api/public/:slug',wrap(async(q,r)=>{const f=q.query.src;const inc=f==='preview'?null:f==='qr'?{scans:1,views:1,[`daily.${day()}.s`]:1,[`daily.${day()}.v`]:1}:{views:1,[`daily.${day()}.v`]:1};
 const s=await Shop.findOneAndUpdate({slug:q.params.slug},inc?{$inc:inc}:{},{new:true}).select('-owner -daily');
 s?r.json(s):r.status(404).json({error:'This shop does not exist'})}));
app.post('/api/public/:slug/click/:pid',rateLimit({windowMs:60e3,limit:60,message:{error:'Too many requests'}}),wrap(async(q,r)=>{if(!/^[a-f0-9]{24}$/.test(q.params.pid))return r.status(400).json({error:'Bad request'});await Shop.updateOne({slug:q.params.slug,'products._id':q.params.pid},{$inc:{[`clicks.${q.params.pid}`]:1,[`daily.${day()}.c`]:1}});r.json({ok:true})}));

await mongoose.connect(E.MONGO_URI||'mongodb://localhost:27017/shopqr').catch(e=>{console.error('MongoDB connection failed:',e.message);process.exit(1)});
if(!await Shop.exists({slug:'demo'}))await Shop.create({slug:'demo',name:'Chai Corner',description:'Hot chai and fresh snacks since 1998.',whatsapp:'919999999999',address:'Har Ki Pauri Road, Haridwar',hours:'7 AM – 10 PM',theme:'diwali',verified:true,categories:['Drinks','Snacks'],
 products:[{name:'Masala Chai',price:20,category:'Drinks',description:'Strong, ginger-spiced tea simmered with fresh milk.'},{name:'Samosa',price:15,category:'Snacks',description:'Crisp pastry stuffed with spiced potato and peas.'},{name:'Cold Coffee',price:60,category:'Drinks',description:'Chilled, creamy coffee blended with ice.'}]});
app.use((e,q,r,n)=>r.status(e.status||500).json({error:e.status===413?'That file is too large':e.type==='entity.parse.failed'?'Invalid request':'Server error'}));
if(PROD&&!E.CLIENT_ORIGIN)console.warn('CLIENT_ORIGIN is not set: any website can call this API');
app.listen(E.PORT||4000,()=>console.log('ShopQR API ready'));
