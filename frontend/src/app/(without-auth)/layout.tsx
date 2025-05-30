'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function WithoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <main className='flex min-h-screen w-full justify-center'>
        {children}
      </main>
    </QueryClientProvider>
  );
}
