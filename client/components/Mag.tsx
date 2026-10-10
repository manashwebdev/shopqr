'use client';
import {useRef} from 'react';import {motion,useSpring} from 'framer-motion';
export default function Mag({children}:{children:React.ReactNode}){
 const r=useRef<HTMLDivElement>(null);const cfg={stiffness:220,damping:16};const x=useSpring(0,cfg),y=useSpring(0,cfg);
 return <motion.div ref={r} style={{x,y,display:'inline-block'}} onMouseMove={e=>{const b=r.current!.getBoundingClientRect();x.set((e.clientX-b.left-b.width/2)*.28);y.set((e.clientY-b.top-b.height/2)*.28)}} onMouseLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.div>}
