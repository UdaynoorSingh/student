import './globals.css';
import Link from 'next/link';
import { Manrope, Playfair_Display } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display'
});

export const metadata = {
  title: 'Sluglime Community',
  description: 'College community platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="font-[var(--font-body)]">
        <header className="sticky top-0 z-20 border-b border-[#d8ccb9]/80 bg-[#fff9f0]/85 backdrop-blur-lg">
          <nav className="shell flex items-center justify-between py-4">
            <Link href="/dashboard" className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-[#8a3b1a]">
              Sluglime
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <Link href="/public" className="btn-ghost">Public Feed</Link>
              <Link href="/create-post" className="btn-ghost">Create Post</Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="btn-primary px-3 py-2">Logout</button>
              </form>
            </div>
          </nav>
        </header>
        <main className="shell min-h-screen py-8 md:py-10">{children}</main>
      </body>
    </html>
  );
}
