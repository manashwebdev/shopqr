'use client';
import {useEffect,useMemo,useState} from 'react';import {motion} from 'framer-motion';
import {Area,AreaChart,Bar,BarChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis} from 'recharts';
import {api,setToken,money} from '@/lib/api';import {qrSvg,downloadPng,downloadSvg,QStyle} from '@/lib/qr';
import {P,noP,fade,toData,upload,Count,Field,Chips} from './shared';

export function Settings({s,save}:{s:any;save:(x:any)=>void}){
 const [f,setF]=useState(s);const [copied,setCopied]=useState(false);const set=(k:string)=>(x:any)=>setF({...f,[k]:x.target.value});
 const logo=async(file?:File)=>{if(file){const u=await upload(file);if(u)setF({...f,logo:u})}};
 const url=s.slug&&typeof location!=='undefined'?`${location.origin}/shop/${s.slug}`:'';
 return <div className="space-y-4">
  {url&&<div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4"><span className="text-sm text-mute">Your page</span><a className="min-w-0 flex-1 truncate text-sm underline" href={url} target="_blank">{url}</a><button className="btn btn-g py-1.5" onClick={()=>{navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1500)}}>{copied?'Copied':'Copy link'}</button></div>}
  <section className="glass space-y-4 rounded-2xl p-5"><h2 className="font-semibold">Identity</h2>
   <div className="flex items-center gap-4">{f.logo?<img src={f.logo} alt="Shop logo" className="h-16 w-16 rounded-2xl object-cover"/>:<div className="grid h-16 w-16 place-items-center rounded-2xl border border-dashed border-white/20 text-xs text-mute">Logo</div>}
    <label className="btn btn-g cursor-pointer">Upload logo<input type="file" accept="image/*" className="sr-only" onChange={x=>logo(x.target.files?.[0])}/></label></div>
   <Field l="Shop name"><input className="inp" value={f.name||''} onChange={set('name')} placeholder="Chai Corner"/></Field>
   <Field l="Description" h="One or two lines. Shown under your shop name."><textarea className="inp" rows={3} value={f.description||''} onChange={set('description')} placeholder="Hot chai and fresh snacks since 1998."/></Field></section>
  <section className="glass grid gap-4 rounded-2xl p-5 sm:grid-cols-2"><h2 className="font-semibold sm:col-span-2">Contact and location</h2>
   <Field l="WhatsApp number" h="Include the country code, e.g. 919876543210. Orders arrive here."><input className="inp" inputMode="numeric" value={f.whatsapp||''} onChange={set('whatsapp')}/></Field>
   <Field l="Open hours"><input className="inp" value={f.hours||''} onChange={set('hours')} placeholder="7 AM – 10 PM"/></Field>
   <Field l="Address"><input className="inp" value={f.address||''} onChange={set('address')}/></Field>
   <Field l="Google Maps link" h="Paste the Share link from Google Maps."><input className="inp" value={f.maps||''} onChange={set('maps')}/></Field></section>
  <section className="glass space-y-4 rounded-2xl p-5"><h2 className="font-semibold">Appearance</h2>
   <Field l="Currency"><Chips v={f.currency} set={x=>setF({...f,currency:x})} opts={[['₹','₹ Rupee'],['$','$ Dollar'],['€','€ Euro'],['£','£ Pound']]}/></Field>
   <Field l="Seasonal theme" h="Changes the glow on your page. Your logo and colours stay the same."><Chips v={f.theme} set={x=>setF({...f,theme:x})} opts={[['default','Classic'],['diwali','Diwali'],['christmas','Christmas'],['newyear','New Year'],['summer','Summer']]}/></Field></section>
  <div className="sticky bottom-4 flex gap-2"><button className="btn btn-w" onClick={()=>save(f)}>{s.slug?'Save changes':'Create my catalog'}</button>{s.slug&&<a className="btn btn-g" href={url} target="_blank">View public page</a>}</div></div>}
