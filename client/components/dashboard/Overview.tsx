'use client';
import {useEffect,useMemo,useState} from 'react';import {motion} from 'framer-motion';
import {Area,AreaChart,Bar,BarChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis} from 'recharts';
import {api,setToken,money} from '@/lib/api';import {qrSvg,downloadPng,downloadSvg,QStyle} from '@/lib/qr';
import {P,noP,fade,toData,upload,Count,Field,Chips} from './shared';

export function Overview({s}:{s:any}){
 const data=useMemo(()=>s.products.map((p:P)=>({name:p.name.slice(0,10),clicks:s.clicks?.[p._id!]||0})).sort((a:any,b:any)=>b.clicks-a.clicks).slice(0,6),[s]);
 const week=Array.from({length:7},(_,i)=>{const d=new Date(Date.now()-(6-i)*864e5).toISOString().slice(0,10);const x=s.daily?.[d]||{};return{d:d.slice(5),views:x.v||0,scans:x.s||0}});
 const total=data.reduce((a:number,d:any)=>a+d.clicks,0);
 if(!s.slug)return <p className="glass rounded-2xl p-8 text-center text-mute">No shop yet. Open Settings and enter your shop details to create your catalog.</p>;
 return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-3">{[['Views',s.views],['QR scans',s.scans],['Order clicks',total]].map(([l,n],i)=><div key={l as string} style={{animationDelay:`${i*80}ms`}} className="glass pop rounded-2xl p-5"><p className="text-sm text-mute">{l}</p><p className="mt-1 text-4xl font-semibold"><Count n={n as number}/></p></div>)}</div>
  <div className="glass rounded-2xl p-5"><h2 className="mb-3 font-semibold">Last 7 days</h2><div className="h-52"><ResponsiveContainer><AreaChart data={week}><defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={.35}/><stop offset="1" stopColor="#fff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false}/><XAxis dataKey="d" stroke="#A1A1AA" fontSize={12}/><Tooltip contentStyle={{background:'#141414',border:'1px solid #333'}}/><Area dataKey="views" stroke="#fff" fill="url(#w)"/><Area dataKey="scans" stroke="#A1A1AA" fill="none"/></AreaChart></ResponsiveContainer></div></div>
  <div className="glass rounded-2xl p-5"><h2 className="mb-3 font-semibold">Popular products</h2>{total===0?<p className="text-sm text-mute">Clicks on Order now will show up here.</p>:<div className="h-56"><ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" stroke="#A1A1AA" fontSize={12}/><Tooltip contentStyle={{background:'#141414',border:'1px solid #333'}}/><Bar dataKey="clicks" fill="#F5F5F5" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>}</div></div>}

