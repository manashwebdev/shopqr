'use client';
import {useEffect,useMemo,useState} from 'react';import {motion} from 'framer-motion';
import {Area,AreaChart,Bar,BarChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis} from 'recharts';
import {api,setToken,money} from '@/lib/api';import {qrSvg,downloadPng,downloadSvg,QStyle} from '@/lib/qr';
import {P,noP,fade,toData,upload,Count,Field,Chips} from './shared';

export function Products({s,save}:{s:any;save:(x:any)=>void}){
 const [e,setE]=useState<P|null>(null);const [cat,setCat]=useState('');const [drag,setDrag]=useState<number|null>(null);
 const move=(i:number,d:number)=>{const a=[...s.products];[a[i],a[i+d]]=[a[i+d],a[i]];save({...s,products:a})};
 const ai=async()=>{if(!e?.name)return;const r=await api('/api/ai/describe','POST',{name:e.name,category:e.category});setE({...e,description:r.text})};
 const up=async(f?:File)=>{if(!f||!e)return;const u=await upload(f);if(u)setE({...e,image:u})};
 const commit=()=>{if(!e||!e.name)return;const a=e._id?s.products.map((p:P)=>p._id===e._id?e:p):[...s.products,e];
  const cats=e.category&&!s.categories.includes(e.category)?[...s.categories,e.category]:s.categories;save({...s,products:a,categories:cats});setE(null)};
 return <div className="space-y-4"><div className="flex flex-wrap items-center gap-2"><button className="btn btn-w" onClick={()=>setE({...noP})}>Add product</button>
  <input className="inp max-w-[200px]" aria-label="New category" placeholder="New category" value={cat} onChange={x=>setCat(x.target.value)}/>
  <button className="btn btn-g" onClick={()=>{if(cat&&!s.categories.includes(cat)){save({...s,categories:[...s.categories,cat]});setCat('')}}}>Add category</button></div>
  <div className="flex flex-wrap gap-2 text-sm text-mute">{s.categories.map((c:string)=><span key={c} className="rounded-full border border-white/10 px-3 py-1">{c} <button aria-label={`Remove ${c}`} onClick={()=>save({...s,categories:s.categories.filter((x:string)=>x!==c)})}>×</button></span>)}</div>
  {e&&<motion.div {...fade} className="glass grid gap-3 rounded-2xl p-5 sm:grid-cols-2">
   <input className="inp" aria-label="Name" placeholder="Name" value={e.name} onChange={x=>setE({...e,name:x.target.value})}/>
   <input className="inp" aria-label="Price" type="number" placeholder="Price" value={e.price||''} onChange={x=>setE({...e,price:+x.target.value})}/>
   <select className="inp" aria-label="Category" value={e.category} onChange={x=>setE({...e,category:x.target.value})}><option value="">No category</option>{s.categories.map((c:string)=><option key={c}>{c}</option>)}</select>
   <input className="inp" aria-label="Image" type="file" accept="image/*" onChange={x=>up(x.target.files?.[0])}/>
   <textarea className="inp sm:col-span-2" aria-label="Description" rows={3} placeholder="Description" value={e.description} onChange={x=>setE({...e,description:x.target.value})}/>
   <div className="flex gap-2 sm:col-span-2"><button className="btn btn-g" onClick={ai}>Write description</button><button className="btn btn-w" onClick={commit}>Save product</button><button className="btn btn-g" onClick={()=>setE(null)}>Cancel</button></div></motion.div>}
  {s.products.length===0&&!e&&<p className="glass rounded-2xl p-8 text-center text-mute">No products yet. Add your first one — it takes about 20 seconds.</p>}
  <ul className="space-y-2">{s.products.map((p:P,i:number)=><li key={p._id||i} draggable onDragStart={()=>setDrag(i)} onDragOver={x=>x.preventDefault()} onDrop={()=>{if(drag!==null&&drag!==i){const a=[...s.products];const [m]=a.splice(drag,1);a.splice(i,0,m);save({...s,products:a})}setDrag(null)}} style={{animationDelay:`${Math.min(i,8)*40}ms`}} className="pop glass flex cursor-grab items-center gap-3 rounded-2xl p-3 active:cursor-grabbing"><span aria-hidden className="text-mute">⋮⋮</span>
   {p.image?<img src={p.image} alt="" className="h-12 w-12 rounded-xl object-cover"/>:<div className="h-12 w-12 rounded-xl bg-card"/>}
   <div className="min-w-0 flex-1"><p className="truncate font-medium">{p.name}</p><p className="text-sm text-mute">{money(p.price,s.currency)} {p.category&&`· ${p.category}`}</p></div>
   <button aria-label="Move up" disabled={i===0} className="btn btn-g px-3 py-1.5" onClick={()=>move(i,-1)}>↑</button><button aria-label="Move down" disabled={i===s.products.length-1} className="btn btn-g px-3 py-1.5" onClick={()=>move(i,1)}>↓</button>
   <button className="btn btn-g py-1.5" onClick={()=>setE(p)}>Edit</button><button className="btn btn-g py-1.5" onClick={()=>save({...s,products:s.products.filter((_:P,j:number)=>j!==i)})}>Delete</button></li>)}</ul>
  {s.slug&&<div><h2 className="mb-2 font-semibold">Live preview</h2><iframe title="Live preview of your public page" key={JSON.stringify(s.products).length+s.name+s.theme} src={`/shop/${s.slug}?src=preview`} className="h-[560px] w-full max-w-[340px] rounded-[2rem] border border-white/10 bg-ink"/></div>}</div>}

