const API=process.env.NEXT_PUBLIC_API||'http://localhost:4000';
export const getToken=()=>typeof window==='undefined'?'':localStorage.getItem('sq')||'';
export const setToken=(t:string)=>t?localStorage.setItem('sq',t):localStorage.removeItem('sq');
export async function api<T=any>(path:string,method='GET',body?:unknown):Promise<T>{
 let r:Response;try{r=await fetch(API+path,{method,headers:{'Content-Type':'application/json',Authorization:'Bearer '+getToken()},body:body?JSON.stringify(body):undefined})}catch{throw new Error('Cannot reach the server. Check NEXT_PUBLIC_API and that the API is running.')}
 const j=await r.json().catch(()=>({}));if(!r.ok){if(r.status===401&&j.error==='Please sign in again'&&getToken()){setToken('');window.dispatchEvent(new Event('sq-out'))}throw new Error(j.error||'Something went wrong')}return j}
export const money=(n:number,c:string)=>`${c}${new Intl.NumberFormat(c==='₹'?'en-IN':'en-US',{maximumFractionDigits:2}).format(n)}`;
