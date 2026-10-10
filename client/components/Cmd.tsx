'use client';
import {useEffect,useState} from 'react';import {AnimatePresence,motion} from 'framer-motion';
export default function Cmd({tabs,go,out}:{tabs:string[];go:(t:string)=>void;out:()=>void}){
 const [o,setO]=useState(false);const [q,setQ]=useState('');
 useEffect(()=>{const h=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setO(v=>!v)}if(e.key==='Escape')setO(false)};addEventListener('keydown',h);return()=>removeEventListener('keydown',h)},[]);
 const items=[...tabs.map(t=>({l:`Go to ${t}`,f:()=>go(t)})),{l:'Sign out',f:out}].filter(i=>i.l.toLowerCase().includes(q.toLowerCase()));
 const run=(f:()=>void)=>{f();setO(false);setQ('')};
 return <AnimatePresence>{o&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-start bg-black/70 p-4 pt-[18vh] backdrop-blur-sm" onClick={()=>setO(false)}>
  <motion.div role="dialog" aria-label="Command menu" initial={{y:12,scale:.97}} animate={{y:0,scale:1}} className="glass mx-auto w-full max-w-md rounded-2xl bg-panel p-2" onClick={e=>e.stopPropagation()}>
   <input autoFocus className="inp mb-1" placeholder="Type a command" aria-label="Command" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&items[0]&&run(items[0].f)}/>
   {items.map(i=><button key={i.l} onClick={()=>run(i.f)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10">{i.l}</button>)}</motion.div></motion.div>}</AnimatePresence>}
