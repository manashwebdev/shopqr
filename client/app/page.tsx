'use client';
import Link from 'next/link';import {useEffect,useRef,useState} from 'react';
import {animate,AnimatePresence,motion,useInView,useScroll,useTransform} from 'framer-motion';
import Reveal from '@/components/Reveal';import Mag from '@/components/Mag';

const feats=[['Catalog in minutes','Add products, categories and photos. Drag to reorder.'],['QR that looks yours','Rounded, gradient or branded. PNG and SVG, print-ready.'],['Orders on WhatsApp','Every product has an Order now button with the message filled in.'],['See what works','Views, QR scans, clicks and your most popular products.'],['Seasonal themes','Diwali, Christmas, New Year or Summer — your branding stays.'],['AI descriptions','Type "Samosa", get a menu-ready description in a second.']];
const kinds=['Cafés','Tea stalls','Street food','Restaurants','Temple shops','Flower shops','Juice bars','Tourist shops','Local stores','Service providers'];
const steps=[['Enter your shop details','Name, logo, WhatsApp number and address.'],['Add your products','Photos, prices and categories. Let AI write the descriptions.'],['Download your QR','Stick it on the counter, post it on Instagram, send it on WhatsApp.']];
const faq=[['Do I need a website?','No. ShopQR gives you a public page at /shop/your-shop-name.'],['How do customers order?','They tap Order now and WhatsApp opens with the order already written.'],['Which currencies work?','₹, $, € and £.'],['Is it free?','Yes, up to 12 products. Pro removes the limit.']];

function Num({to,suffix=''}:{to:number;suffix?:string}){const ref=useRef<HTMLSpanElement>(null);const on=useInView(ref,{once:true});const [v,setV]=useState(0);
 useEffect(()=>{if(!on)return;const c=animate(0,to,{duration:1.4,ease:'easeOut',onUpdate:l=>setV(Math.round(l))});return()=>c.stop()},[on,to]);return <span ref={ref}>{v}{suffix}</span>}
function Faq({q,a}:{q:string;a:string}){const [o,setO]=useState(false);
 return <div className="glass rounded-2xl"><button className="flex w-full items-center justify-between p-5 text-left font-medium" aria-expanded={o} onClick={()=>setO(!o)}>{q}<motion.span animate={{rotate:o?45:0}} className="text-xl text-mute">+</motion.span></button>
  <AnimatePresence initial={false}>{o&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden px-5 text-sm text-mute"><span className="block pb-5">{a}</span></motion.p>}</AnimatePresence></div>}
const Qr=()=><div className="grid grid-cols-9 gap-[2px] rounded-lg bg-white p-2" aria-hidden>{Array.from({length:81},(_,i)=><i key={i} className={`aspect-square rounded-[1px] ${(i*7+(i%5)*3+(i>>3))%3===0?'bg-black':'bg-white'}`}/>)}</div>;

function Phone(){return <motion.div animate={{y:[0,-12,0]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}} className="relative mx-auto w-[250px]">
 <div className="glass rounded-[2.4rem] p-3"><div className="rounded-[1.8rem] bg-ink p-4">
  <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-card font-bold">C</div><div><p className="text-sm font-semibold">Chai Corner</p><p className="text-[10px] text-mute">Verified Local Business</p></div></div>
  <div className="mt-3 flex gap-1.5 text-[10px]"><span className="rounded-full bg-white px-2.5 py-1 text-black">All</span><span className="rounded-full border border-white/15 px-2.5 py-1">Drinks</span><span className="rounded-full border border-white/15 px-2.5 py-1">Snacks</span></div>
  {[['Masala Chai','₹20'],['Samosa','₹15'],['Cold Coffee','₹60']].map(([n,p],i)=><motion.div key={n} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:.8+i*.15}} className="mt-2.5 rounded-xl border border-white/10 bg-card p-2.5"><div className="flex justify-between text-xs"><b>{n}</b><b>{p}</b></div><div className="mt-2 rounded-lg bg-white py-1 text-center text-[10px] font-semibold text-black">Order now</div></motion.div>)}</div></div>
 <motion.div animate={{y:[0,10,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}} className="glass !absolute -right-16 bottom-10 hidden w-28 rounded-2xl bg-panel p-2 sm:block"><Qr/><p className="mt-1 text-center text-[10px] text-mute">Scan to order</p></motion.div></motion.div>}

export default function Home(){
 const {scrollY}=useScroll();const bg=useTransform(scrollY,[0,80],['rgba(5,5,5,0)','rgba(5,5,5,.8)']);
 const words='Turn any shop into a digital storefront in 2 minutes'.split(' ');
 return <main className="relative overflow-hidden">
  <div className="grid-glow absolute inset-x-0 top-0 h-[760px]" aria-hidden/><div className="blob -left-24 top-24 h-96 w-96" aria-hidden/><div className="blob right-0 top-80 h-80 w-80" style={{animationDelay:'-14s'}} aria-hidden/>
  <motion.nav style={{backgroundColor:bg}} className="fixed inset-x-0 top-0 z-40 border-b border-white/5 backdrop-blur-md"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5"><b className="tracking-tight">ShopQR</b>
   <div className="flex items-center gap-5 text-sm text-mute"><a href="#features" className="hidden hover:text-white sm:block">Features</a><a href="#pricing" className="hidden hover:text-white sm:block">Pricing</a><Link href="/dashboard" className="btn btn-g py-1.5">Sign in</Link></div></div></motion.nav>

  <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-36 lg:grid-cols-[1.15fr_1fr]">
   <div className="text-center lg:text-left">
    <motion.p initial={{opacity:0}} animate={{opacity:1}} className="mx-auto mb-5 w-fit rounded-full border border-white/10 px-3 py-1 text-xs text-mute lg:mx-0">QR menus for the shop around the corner</motion.p>
    <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{words.map((w,i)=><motion.span key={i} className="sheen mr-[.25em] inline-block pb-[.12em]" initial={{opacity:0,y:24,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{duration:.6,delay:.1+i*.07}}>{w}</motion.span>)}</h1>
    <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.7}} className="mx-auto mt-6 max-w-lg text-mute lg:mx-0">Create a beautiful menu, catalog, and QR code without coding.</motion.p>
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.85}} className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start"><Mag><Link href="/dashboard" className="btn btn-w">Create catalog</Link></Mag><Mag><Link href="/shop/demo" className="btn btn-g">See live demo</Link></Mag></motion.div></div>
   <Phone/></section>

  <div className="relative border-y border-white/5 py-5" aria-hidden><div className="marquee text-sm text-mute">{[...kinds,...kinds].map((k,i)=><span key={i}>{k} <span className="mx-4 opacity-30">•</span></span>)}</div></div>

  <section id="features" className="relative mx-auto max-w-6xl px-5 py-24"><Reveal><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything a small shop needs.<br/><span className="text-mute">Nothing it doesn't.</span></h2></Reveal>
   <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{feats.map(([t,d],i)=><Reveal key={t} d={i*.06} className={[0,3,5].includes(i)?'lg:col-span-2':''}><div className="glass h-full rounded-2xl p-6"><span className="text-xs text-mute">0{i+1}</span><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-2 text-sm text-mute">{d}</p></div></Reveal>)}</div></section>

  <section className="relative mx-auto grid max-w-4xl grid-cols-2 gap-4 px-5 pb-24 text-center sm:grid-cols-4">{[[2,' min','to go live'],[4,'','QR styles'],[4,'','currencies'],[0,'','ads, ever']].map(([n,s,l])=><Reveal key={l as string}><p className="text-4xl font-semibold"><Num to={n as number} suffix={s as string}/></p><p className="text-sm text-mute">{l}</p></Reveal>)}</section>

  <section id="how" className="relative mx-auto max-w-3xl px-5 pb-24"><Reveal><h2 className="text-3xl font-semibold tracking-tight">How it works</h2></Reveal>
   <div className="relative mt-10 space-y-4 pl-6"><motion.span initial={{scaleY:0}} whileInView={{scaleY:1}} viewport={{once:true}} transition={{duration:1.2}} style={{originY:0}} className="absolute bottom-6 left-[15px] top-6 w-px bg-gradient-to-b from-white/50 to-transparent"/>
    {steps.map(([t,d],i)=><Reveal key={t} d={i*.1}><div className="glass relative rounded-2xl p-5"><span className="absolute -left-6 top-5 grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-black shadow-[0_0_20px_rgba(255,255,255,.4)]">{i+1}</span><h3 className="font-semibold">{t}</h3><p className="text-sm text-mute">{d}</p></div></Reveal>)}</div></section>

  <section id="pricing" className="relative mx-auto max-w-4xl px-5 pb-24"><Reveal><h2 className="text-3xl font-semibold tracking-tight">Pricing</h2></Reveal>
   <div className="mt-8 grid gap-4 sm:grid-cols-2">{[['Free','₹0','Up to 12 products, QR codes, WhatsApp orders, analytics',''],['Pro','₹199/month','Unlimited products, all themes, priority support','ring']].map(([n,p,d,c],i)=><Reveal key={n} d={i*.1}><div className={`glass ${c} h-full rounded-2xl p-6`}><h3 className="font-semibold">{n}</h3><p className="mt-1 text-3xl font-semibold">{p}</p><p className="mt-2 text-sm text-mute">{d}</p><Link href="/dashboard" className={`btn mt-5 ${c?'btn-w':'btn-g'}`}>Start with {n}</Link></div></Reveal>)}</div></section>

  <section className="relative mx-auto max-w-2xl space-y-3 px-5 pb-24"><Reveal><h2 className="mb-5 text-3xl font-semibold tracking-tight">Questions</h2></Reveal>{faq.map(([q,a])=><Faq key={q} q={q} a={a}/>)}</section>

  <Reveal className="relative mx-auto max-w-3xl px-5 pb-24"><div className="glass ring rounded-3xl p-10 text-center"><h2 className="text-3xl font-semibold tracking-tight">Your shop, online by tonight.</h2><div className="mt-6"><Mag><Link href="/dashboard" className="btn btn-w">Create catalog</Link></Mag></div></div></Reveal>
  <footer className="relative border-t border-white/10 py-10 text-center text-sm text-mute">ShopQR — built for the shop around the corner.</footer></main>}
