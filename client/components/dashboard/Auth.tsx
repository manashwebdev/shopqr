'use client';
import {useEffect,useMemo,useState} from 'react';import {motion} from 'framer-motion';
import {Area,AreaChart,Bar,BarChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis} from 'recharts';
import {api,setToken,money} from '@/lib/api';import {qrSvg,downloadPng,downloadSvg,QStyle} from '@/lib/qr';
import {P,noP,fade,toData,upload,Count,Field,Chips} from './shared';

export function Auth({done}:{done:()=>void}){
 const [reg,setReg]=useState(false);const [e,setE]=useState('');const [p,setP]=useState('');const [err,setErr]=useState('');
 const go=async()=>{try{const r=await api(`/api/auth/${reg?'register':'login'}`,'POST',{email:e,password:p});setToken(r.token);done()}catch(x:any){setErr(x.message)}};
 return <main className="grid min-h-screen place-items-center px-4"><motion.div {...fade} whileHover={{y:-2}} className="glass ring w-full max-w-sm space-y-3 rounded-2xl p-6">
  <h1 className="text-xl font-semibold">{reg?'Create your account':'Sign in'}</h1>
  <input className="inp" aria-label="Email" placeholder="Email" value={e} onChange={x=>setE(x.target.value)}/>
  <input className="inp" aria-label="Password" type="password" autoComplete={reg?'new-password':'current-password'} placeholder="Password" value={p} onChange={x=>setP(x.target.value)}/>
  {reg&&<p className="text-xs text-mute">Use 8+ characters with a letter and a number.</p>}
  {err&&<p role="alert" className="text-sm text-mute">{err}</p>}
  <button className="btn btn-w w-full" onClick={go}>{reg?'Create account':'Sign in'}</button>
  <button className="w-full text-sm text-mute underline" onClick={()=>setReg(!reg)}>{reg?'I already have an account':'Create a new account'}</button></motion.div></main>}

