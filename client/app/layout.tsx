import './globals.css';import Glow from '@/components/Glow';import {Manrope} from 'next/font/google';import type {Metadata} from 'next';
const f=Manrope({subsets:['latin'],variable:'--font'});
export const metadata:Metadata={title:'ShopQR — QR menu & catalog for local shops',description:'Create a digital menu and QR code in 2 minutes. No coding.'};
export default function L({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${f.variable} font-sans antialiased`}><Glow/>{children}</body></html>}
