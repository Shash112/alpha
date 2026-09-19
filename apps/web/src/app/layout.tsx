import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alpha — Digital Professional Identity & Visiting Card SaaS',
  description: 'Create your professional identity once, share it everywhere, and turn introductions into contacts, conversations, and leads.',
  icons: {
    icon: '/alpha-fav.png',
    shortcut: '/alpha-fav.png',
    apple: '/alpha-fav.png',
  },
  openGraph: {
    title: 'Alpha — Digital Professional Identity SaaS',
    description: 'India-first, globally extensible digital visiting card and professional identity platform.',
    url: 'https://alpha.com',
    siteName: 'Alpha',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
