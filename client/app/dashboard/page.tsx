'use client';
import {useEffect,useState} from 'react';import {AnimatePresence,motion} from 'framer-motion';
import {api,getToken,setToken} from '@/lib/api';import Cmd from '@/components/Cmd';
import {blank,fade,hd,tabs} from '@/components/dashboard/shared';
import {Auth} from '@/components/dashboard/Auth';import {Overview} from '@/components/dashboard/Overview';
import {Products} from '@/components/dashboard/Products';import {QR} from '@/components/dashboard/QR';import {Account} from '@/components/dashboard/Account';import {Admin} from '@/components/dashboard/Admin';import {Settings} from '@/components/dashboard/Settings';

export default function Dashboard(){
 const [authed,setAuthed]=useState(false);const [shop,setShop]=useState<any>(null);const [tab,setTab]=useState('Overview');const [msg,setMsg]=useState('');const [loadErr,setLoadErr]=useState('');
 const out=()=>{setToken('');setAuthed(false);setShop(null)};
 const load=()=>api('/api/shop').then(s=>{setLoadErr('');setShop(s.noShop?{...blank,admin:s.admin}:s);if(s.noShop)setTab('Settings')}).catch(e=>/sign in/i.test(e.message)?out():setLoadErr(e.message));
 useEffect(()=>{if(getToken()){setAuthed(true);load()}const h=()=>out();addEventListener('sq-out',h);return()=>removeEventListener('sq-out',h)},[]);
 const toast=(m:string)=>{setMsg(m);setTimeout(()=>setMsg(''),2200)};
 const save=async(next:any)=>{const prev=shop;setShop(next);try{setShop(await api('/api/shop','PUT',next));toast('Saved')}catch(e:any){setShop(prev);toast(e.message)}};
 if(!authed)return <Auth done={()=>{setAuthed(true);load()}}/>;
 if(loadErr)return <main className="grid min-h-screen place-items-center p-6 text-center"><div className="glass max-w-sm rounded-2xl p-6"><p>{loadErr}</p><button className="btn btn-w mt-4" onClick={load}>Try again</button></div></main>;
 if(!shop)return <div className="p-10"><div className="h-40 animate-pulse rounded-2xl bg-card"/></div>;
 const all=shop.admin?[...tabs,'Admin']:tabs;
 const steps:[string,boolean][]=[['Add shop details',!!shop.slug],['Add a product',shop.products.length>0],['Share your QR code',shop.views>0]];
 const Nav=({row}:{row?:boolean})=><>{all.map(t=><button key={t} onClick={()=>setTab(t)} aria-current={tab===t?'page':undefined}
  className={`rounded-xl px-3 py-2 text-sm transition ${row?'flex-1 text-center':'text-left'} ${tab===t?'bg-white text-black':'text-mute hover:bg-white/5 hover:text-white'}`}>{t}</button>)}</>;
 return <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
  <aside className="sticky top-0 hidden h-screen flex-col gap-6 border-r border-white/10 bg-panel/60 p-4 backdrop-blur lg:flex">
   <div><b className="text-lg tracking-tight">ShopQR</b><p className="mt-1 truncate text-xs text-mute">{shop.name||'New shop'} · {shop.plan==='pro'?'Pro':'Free'}</p></div>
   <nav className="flex flex-col gap-1" aria-label="Dashboard"><Nav/></nav>
   {steps.some(s=>!s[1])&&<div className="glass rounded-2xl p-4 text-sm"><p className="mb-2 font-medium">Get set up</p>{steps.map(([l,d])=><p key={l} className={d?'text-mute line-through':''}>{d?'✓':'○'} {l}</p>)}</div>}
   <div className="mt-auto space-y-2"><p className="text-xs text-mute">Press Ctrl+K for commands</p><button className="btn btn-g w-full" onClick={out}>Sign out</button></div></aside>
  <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 lg:px-10 lg:pb-12 lg:pt-10">
   <header className="mb-6 flex items-center justify-between lg:hidden"><b>ShopQR</b><button className="btn btn-g py-1.5" onClick={out}>Sign out</button></header>
   <Cmd tabs={all} go={setTab} out={out}/>
   <AnimatePresence mode="wait"><motion.div key={tab} {...fade} exit={{opacity:0}}>
    <div className="mb-6"><h1 className="text-2xl font-semibold tracking-tight">{hd[tab][0]}</h1><p className="text-sm text-mute">{hd[tab][1]}</p></div>
    {tab==='Overview'&&<Overview s={shop}/>}{tab==='Products'&&<Products s={shop} save={save}/>}{tab==='QR code'&&<QR s={shop}/>}{tab==='Settings'&&<Settings s={shop} save={save}/>}{tab==='Account'&&<Account s={shop} out={out} toast={toast}/>}{tab==='Admin'&&<Admin toast={toast}/>}
   </motion.div></AnimatePresence></main>
  <nav className="glass fixed inset-x-0 bottom-0 z-40 flex gap-1 rounded-none border-x-0 border-b-0 bg-ink/90 p-2 pb-[max(.5rem,env(safe-area-inset-bottom))] lg:hidden" aria-label="Dashboard"><Nav row/></nav>
  <AnimatePresence>{msg&&<motion.p role="status" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="glass fixed bottom-20 right-4 z-50 rounded-xl bg-panel px-4 py-2 text-sm lg:bottom-6">{msg}</motion.p>}</AnimatePresence></div>}
