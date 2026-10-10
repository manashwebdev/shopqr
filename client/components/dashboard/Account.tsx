'use client';
import {useState} from 'react';import {api,setToken} from '@/lib/api';import {Field} from './shared';
export function Account({s,out,toast}:{s:any;out:()=>void;toast:(m:string)=>void}){
 const [cur,setCur]=useState('');const [nx,setNx]=useState('');const [pw,setPw]=useState('');const [code,setCode]=useState('');
 const run=async(f:()=>Promise<any>,ok:string)=>{try{await f();toast(ok)}catch(e:any){toast(e.message)}};
 return <div className="space-y-4">
  <section className="glass space-y-3 rounded-2xl p-5"><h2 className="font-semibold">Change password</h2>
   <Field l="Current password"><input className="inp" type="password" autoComplete="current-password" value={cur} onChange={e=>setCur(e.target.value)}/></Field>
   <Field l="New password" h="8+ characters with a letter and a number. Changing it signs out every other device."><input className="inp" type="password" autoComplete="new-password" value={nx} onChange={e=>setNx(e.target.value)}/></Field>
   <button className="btn btn-w" onClick={()=>run(async()=>{const r=await api('/api/auth/password','POST',{current:cur,next:nx});setToken(r.token);setCur('');setNx('')},'Password changed')}>Update password</button></section>
  <section className="glass space-y-3 rounded-2xl p-5"><h2 className="font-semibold">Sessions</h2><p className="text-sm text-mute">Lost a phone or used a shared computer? Sign out everywhere.</p>
   <button className="btn btn-g" onClick={async()=>{try{await api('/api/auth/logout-all','POST');out()}catch(e:any){toast(e.message)}}}>Sign out of all devices</button></section>
  {!s.admin&&<section className="glass space-y-3 rounded-2xl p-5"><h2 className="font-semibold">Admin access</h2><Field l="Admin code" h="Only the site owner has this code."><input className="inp" type="password" value={code} onChange={e=>setCode(e.target.value)}/></Field>
   <button className="btn btn-g" onClick={()=>run(async()=>{await api('/api/auth/claim-admin','POST',{code});location.reload()},'Admin unlocked')}>Unlock admin</button></section>}
  <section className="glass space-y-3 rounded-2xl p-5"><h2 className="font-semibold">Delete account</h2><p className="text-sm text-mute">Permanently deletes your account, shop and products.</p>
   <input className="inp" type="password" aria-label="Password" placeholder="Confirm with your password" value={pw} onChange={e=>setPw(e.target.value)}/>
   <button className="btn btn-g" onClick={async()=>{if(!confirm('Delete your account and shop forever?'))return;try{await api('/api/auth/account','DELETE',{password:pw});out()}catch(e:any){toast(e.message)}}}>Delete my account</button></section></div>}
