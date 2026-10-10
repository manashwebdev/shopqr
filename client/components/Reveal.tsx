'use client';
import {motion} from 'framer-motion';
export default function Reveal({children,d=0,className=''}:{children:React.ReactNode;d?:number;className?:string}){
 return <motion.div className={className} initial={{opacity:0,y:24,filter:'blur(6px)'}} whileInView={{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:true,margin:'-60px'}} transition={{duration:.6,delay:d,ease:[.22,1,.36,1]}}>{children}</motion.div>}
