import type {Config} from 'tailwindcss';
export default {content:['./app/**/*.tsx'],theme:{extend:{colors:{ink:'#050505',panel:'#0E0E0E',card:'#141414',mute:'#A1A1AA'},fontFamily:{sans:['var(--font)','system-ui','sans-serif']}}}} satisfies Config;
