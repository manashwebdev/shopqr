'use client';
import {use,useEffect,useMemo,useState} from 'react';import {motion} from 'framer-motion';import {api,money} from '@/lib/api';
export default function Shop({params}:{params:Promise<{slug:string}>}){
 const {slug}=use(params);const [s,setS]=useState<any>(null);const [err,setErr]=useState('');const [q,setQ]=useState('');const [cat,setCat]=useState('All');
 useEffect(()=>{const src=new URLSearchParams(location.search).get('src');api(`/api/public/${slug}${src?`?src=${src}`:''}`).then(setS).catch(e=>setErr(e.message))},[slug]);
 const list=useMemo(()=>(s?.products||[]).filter((p:any)=>(cat==='All'||p.category===cat)&&(p.name+p.description).toLowerCase().includes(q.toLowerCase())),[s,q,cat]);
 if(err)return <p className="p-10 text-center text-mute">{err}</p>;
 if(!s)return <div className="mx-auto max-w-3xl space-y-3 p-5">{[1,2,3].map(i=><div key={i} className="shimmer h-28 rounded-2xl"/>)}</div>;
 const order=(p:any)=>{api(`/api/public/${slug}/click/${p._id}`,'POST').catch(()=>{});
  const t=`Hello, I want to order:\n\n${p.name}\n${money(p.price,s.currency)}\n${s.name}`;open(`https://wa.me/${(s.whatsapp||'').replace(/\D/g,'')}?text=${encodeURIComponent(t)}`)};
 return <main className={`min-h-screen t-${s.theme}`}>
  <motion.header initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{duration:.5}} className="relative border-b border-white/10 px-5 pb-8 pt-12" style={{background:'radial-gradient(ellipse at top,rgba(var(--tint),.12),transparent 70%)'}}>
   <div className="mx-auto flex max-w-3xl items-center gap-4">{s.logo?<img src={s.logo} alt="" className="h-16 w-16 rounded-2xl object-cover"/>:<div className="grid h-16 w-16 place-items-center rounded-2xl bg-card text-2xl font-bold">{s.name[0]}</div>}
    <div><h1 className="text-2xl font-semibold">{s.name}{s.verified&&<span className="ml-2 rounded-full border border-white/20 px-2 py-0.5 align-middle text-xs">Verified Local Business</span>}</h1><p className="text-sm text-mute">{s.description}</p></div></div>
   <div className="mx-auto mt-5 flex max-w-3xl flex-wrap gap-x-5 gap-y-1 text-sm text-mute">{s.hours&&<span>{s.hours}</span>}{s.address&&<span>{s.address}</span>}{s.maps&&<a className="underline" href={s.maps}>Open in Maps</a>}{s.whatsapp&&<a className="underline" href={`tel:${s.whatsapp}`}>Call</a>}</div></motion.header>
  <div className="sticky top-0 z-10 border-b border-white/10 bg-ink/80 px-5 py-3 backdrop-blur"><div className="mx-auto max-w-3xl space-y-3"><input aria-label="Search products" className="inp" placeholder="Search products" value={q} onChange={e=>setQ(e.target.value)}/>
   <div className="flex gap-2 overflow-x-auto">{['All',...s.categories].map((c:string)=><button key={c} onClick={()=>setCat(c)} aria-pressed={cat===c} className={`btn shrink-0 py-1.5 ${cat===c?'btn-w':'btn-g'}`}>{c}</button>)}</div></div></div>
  <section className="mx-auto grid max-w-3xl gap-3 p-5 sm:grid-cols-2">{list.length===0&&<p className="col-span-full py-16 text-center text-mute">Nothing matches. Try another search or category.</p>}
   {list.map((p:any,i:number)=><motion.article key={p._id} layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} whileHover={{y:-4,scale:1.01}} transition={{duration:.35,delay:Math.min(i*.05,.4)}} className="glass overflow-hidden rounded-2xl">
    {p.image&&<div className="shimmer h-40"><img src={p.image} alt={p.name} loading="lazy" onLoad={e=>e.currentTarget.style.opacity='1'} style={{opacity:0,transition:'opacity .5s'}} className="h-40 w-full object-cover"/></div>}
    <div className="p-4"><div className="flex justify-between gap-3"><h3 className="font-semibold">{p.name}</h3><b>{money(p.price,s.currency)}</b></div><p className="mt-1 text-sm text-mute">{p.description}</p>
     <button onClick={()=>order(p)} className="btn btn-w mt-4 w-full">Order now</button></div></motion.article>)}</section></main>}
