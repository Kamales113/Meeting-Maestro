
'use client';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';
import { useSeedData } from '@/hooks/use-seed-data';

// Metadata can't be in a client component, but we need the provider at the root.
// This is a common pattern to overcome this.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Meeting Maestro</title>
        <meta name="description" content="Real-time meeting room booking platform" />
        <link rel="icon" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
        <FirebaseClientProvider>
          <AppContent>{children}</AppContent>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  // Seed the database with initial data if it's empty
  useSeedData();

  return (
    <>
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
      <Toaster />
    </>
  );
}
