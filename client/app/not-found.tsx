import Link from 'next/link';
export default function NotFound(){return <main className="grid min-h-screen place-items-center px-4 text-center"><div><h1 className="text-3xl font-semibold">Page not found</h1><p className="mt-2 text-mute">The link may be wrong or the shop was removed.</p><Link href="/" className="btn btn-w mt-6">Back to ShopQR</Link></div></main>}
