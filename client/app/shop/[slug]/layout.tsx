import type {Metadata} from 'next';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 try{const r=await fetch(`${process.env.NEXT_PUBLIC_API||'http://localhost:4000'}/api/public/${slug}?src=preview`,{next:{revalidate:60}});const s=await r.json();
  return{title:`${s.name} — Menu`,description:s.description,openGraph:{title:s.name,description:s.description,images:s.logo?.startsWith('http')?[s.logo]:[]}}}catch{return{title:'Shop menu'}}}
export default function Layout({children}:{children:React.ReactNode}){return children}
