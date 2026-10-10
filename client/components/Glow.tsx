'use client';
import {useEffect} from 'react';
export default function Glow(){
 useEffect(()=>{const m=(e:MouseEvent)=>{const c=(e.target as HTMLElement).closest?.('.glass') as HTMLElement|null;if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}};addEventListener('mousemove',m);return()=>removeEventListener('mousemove',m)},[]);
 return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">{Array.from({length:22},(_,i)=><span key={i} className="particle" style={{left:`${(i*37)%100}%`,animationDelay:`${-i*1.7}s`,animationDuration:`${22+(i%6)*5}s`,width:1+(i%3),height:1+(i%3)}}/>)}</div>}
