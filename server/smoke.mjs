// Post-deploy check: node server/smoke.mjs https://your-api.onrender.com
const B=process.argv[2]||'http://localhost:4000';
const j=async(p,m='GET',b,t)=>{const r=await fetch(B+p,{method:m,headers:{'Content-Type':'application/json',...(t&&{Authorization:'Bearer '+t})},body:b&&JSON.stringify(b)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(`${m} ${p} -> ${r.status} ${d.error||''}`);return d};
const ok=n=>console.log('✓',n);
await j('/api/health');ok('health');
const {token}=await j('/api/auth/register','POST',{email:`smoke${Date.now()}@test.dev`,password:'smoke-test-1'});ok('register');
const s=await j('/api/shop','PUT',{name:'Smoke Shop',whatsapp:'911234567890',categories:['A'],products:[{name:'Item',price:10,category:'A',description:'x'}]},token);ok('create shop '+s.slug);
const p=await j(`/api/public/${s.slug}?src=qr`);ok('public page');
await j(`/api/public/${s.slug}/click/${p.products[0]._id}`,'POST');ok('click tracked');
const m=await j('/api/shop','GET',undefined,token);if(m.scans!==1||!Object.keys(m.clicks||{}).length)throw new Error('analytics were not recorded');ok('analytics');
const a=await j('/api/ai/describe','POST',{name:'Samosa'},token);ok(`description (${a.source})`);
const b=await j('/api/auth/register','POST',{email:`smoke${Date.now()}b@test.dev`,password:'smoke-test-1'});
if(!(await j('/api/shop','GET',undefined,b.token)).noShop)throw new Error('data leaked between accounts');ok('accounts are isolated');
try{await j('/api/shop');throw new Error('open without a token')}catch(e){if(!/401/.test(e.message))throw e}ok('requests without a token are rejected');
console.log('All checks passed');
