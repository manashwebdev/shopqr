const headers=[['X-Content-Type-Options','nosniff'],['X-Frame-Options','SAMEORIGIN'],['Referrer-Policy','strict-origin-when-cross-origin'],['Permissions-Policy','camera=(), microphone=(), geolocation=()'],['Strict-Transport-Security','max-age=63072000; includeSubDomains']].map(([key,value])=>({key,value}));
export default {poweredByHeader:false,async headers(){return[{source:'/(.*)',headers}]}};
