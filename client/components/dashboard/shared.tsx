'use client';
import {useEffect,useMemo,useState} from 'react';import {motion} from 'framer-motion';
import {Area,AreaChart,Bar,BarChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis} from 'recharts';
import {api,setToken,money} from '@/lib/api';import {qrSvg,downloadPng,downloadSvg,QStyle} from '@/lib/qr';
export type P={_id?:string;name:string;price:number;description:string;category:string;image:string};
export const blank={name:'',logo:'',description:'',whatsapp:'',address:'',hours:'',maps:'',currency:'₹',theme:'default',categories:[] as string[],products:[] as P[]};
export const noP:P={name:'',price:0,description:'',category:'',image:''};
export const hd:Record<string,string[]>={Overview:['Overview','How your catalog is performing.'],Products:['Products','Add, reorder and edit what you sell. Drag to change the order.'],'QR code':['QR code','Download it and place it where customers will see it.'],Account:['Account','Password, sessions and security.'],Admin:['Admin','Verify shops and change plans.'],Settings:['Shop details','This is what customers see at the top of your public page.']};
export const tabs=['Overview','Products','QR code','Settings','Account'];
export const fade={initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5}};
export const toData=(f:File,max=900)=>new Promise<string>((res,rej)=>{const r=new FileReader();r.onerror=()=>rej(new Error('Could not read the image'));r.onload=()=>{const i=new Image();i.onerror=()=>rej(new Error('That file is not a valid image'));i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d')!.drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82))};i.src=r.result as string};r.readAsDataURL(f)});
export const upload=async(f:File):Promise<string>=>{try{return (await api('/api/upload','POST',{data:await toData(f)})).url as string}catch(x:any){alert(x.message);return ''}};


export function Count({n}:{n:number}){const [v,setV]=useState(0);useEffect(()=>{let f=0;const t=setInterval(()=>{f++;setV(Math.round(n*Math.min(1,f/30)));if(f>=30)clearInterval(t)},25);return()=>clearInterval(t)},[n]);return <>{v}</>}
export function Field({l,h,children}:{l:string;h?:string;children:React.ReactNode}){return <label className="block"><span className="mb-1.5 block text-sm font-medium">{l}</span>{children}{h&&<span className="mt-1 block text-xs text-mute">{h}</span>}</label>}
export function Chips({v,set,opts}:{v:string;set:(x:string)=>void;opts:string[][]}){return <div className="flex flex-wrap gap-2">{opts.map(([k,l])=><button type="button" key={k} onClick={()=>set(k)} aria-pressed={v===k} className={`btn py-1.5 ${v===k?'btn-w':'btn-g'}`}>{l}</button>)}</div>}
