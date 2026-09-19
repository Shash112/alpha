import type { Metadata } from 'next';
import '../../src/app/globals.css';

export const metadata: Metadata = {
  title: 'Alpha Admin — Platform Super-Admin Console',
  description: 'Global operations, abuse control, reseller management, and platform analytics console.',
  icons: {
    icon: '/alpha-fav.png',
    shortcut: '/alpha-fav.png',
    apple: '/alpha-fav.png',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
