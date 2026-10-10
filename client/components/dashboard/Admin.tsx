'use client';
import {useState} from 'react';import {api} from '@/lib/api';
export function Admin({toast}:{toast:(m:string)=>void}){
 const [slug,setSlug]=useState('');
 const go=async(b:object)=>{try{const s=await api(`/api/admin/shop/${slug.trim()}`,'PATCH',b);toast(s?`Updated ${s.slug}`:'Shop not found')}catch(e:any){toast(e.message)}};
 return <div className="glass max-w-md space-y-3 rounded-2xl p-5"><input className="inp" aria-label="Shop slug" placeholder="shop-slug" value={slug} onChange={e=>setSlug(e.target.value)}/>
  <div className="flex flex-wrap gap-2"><button className="btn btn-w" onClick={()=>go({verified:true})}>Verify</button><button className="btn btn-g" onClick={()=>go({verified:false})}>Unverify</button><button className="btn btn-g" onClick={()=>go({plan:'pro'})}>Set Pro</button><button className="btn btn-g" onClick={()=>go({plan:'free'})}>Set Free</button></div></div>}
