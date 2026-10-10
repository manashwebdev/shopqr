import QRCode from 'qrcode';
export type QStyle='plain'|'rounded'|'gradient'|'branded';
export function qrSvg(text:string,style:QStyle,label=''){
 const q=(QRCode as any).create(text,{errorCorrectionLevel:'H'}),n=q.modules.size,d=q.modules.data,s=10,m=40,W=n*s+2*m;let r='';
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(d[y*n+x])r+=`<rect x="${m+x*s}" y="${m+y*s}" width="${s}" height="${s}" rx="${style==='plain'?0:4}"/>`;
 const mid=style==='branded'?`<rect x="${W/2-38}" y="${W/2-38}" width="76" height="76" rx="18" fill="#fff"/><text x="${W/2}" y="${W/2+14}" font-size="40" font-weight="700" text-anchor="middle" font-family="sans-serif">${(label[0]||'S').toUpperCase()}</text>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#777"/></linearGradient></defs><rect width="${W}" height="${W}" fill="#fff"/><g fill="${style==='gradient'?'url(#g)':'#000'}">${r}</g>${mid}</svg>`}
const save=(href:string,name:string)=>{const a=document.createElement('a');a.href=href;a.download=name;a.click()};
export const downloadSvg=(svg:string,name:string)=>save(URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),name+'.svg');
export function downloadPng(svg:string,name:string){const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=c.height=1200;c.getContext('2d')!.drawImage(i,0,0,1200,1200);save(c.toDataURL('image/png'),name+'.png')};i.src='data:image/svg+xml;base64,'+btoa(svg)}
