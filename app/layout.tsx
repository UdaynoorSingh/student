import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Sluglime Community',
  description: 'College community platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans font-normal antialiased">
        <header className="sticky top-0 z-20 border-b border-[#F26DDC]/30 bg-[#0A0A0F]/90 backdrop-blur shadow-[0_4px_20px_rgba(,,,)]">
          <nav className="shell flex items-center justify-between py-3">
            <Link href="/dashboard" className="group flex items-center gap-2.5 text-xl font-black tracking-tight text-white hover:text-[#F26DDC] transition-all drop-shadow-[0_0_5px_rgba(,,,)] hover:drop-shadow-[0_0_10px_rgba(,,,)]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#295BF2] to-[#F26DDC] text-white shadow-sm shadow-[#295BF2]/50 group-hover:-rotate-6 transition-transform duration-300">
                <span className="text-lg leading-none">S</span>
              </div>
              Sluglime
            </Link>
            <div className="flex items-center gap-3 text-sm font-bold">
              <Link href="/public" className="px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-colors">Public Feed</Link>
              <Link href="/create-post" className="px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-colors">Create Post</Link>
              <div className="h-5 w-px bg-[#2D2D3B] mx-1 flex-shrink-0"></div>
              <form action="/api/auth/logout" method="post" className="m-0 p-0 flex">
                <button type="submit" className="text-gray-400 hover:text-[#F26DDC] transition-colors px-2 py-1 drop-shadow-none hover:drop-shadow-[0_0_5px_rgba(,,,)]">Logout</button>
              </form>
            </div>
          </nav>
        </header>
        <main className="shell min-h-screen py-6 md:py-8">{children}</main>
      </body>
    </html>
  );
}
