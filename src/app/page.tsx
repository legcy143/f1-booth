"use client"
import React, { Suspense } from 'react'
import usePagging from './_store/usePagging';
import { F1Page } from './_pages/F1Pages';

export default function Home() {
  const currentPage = usePagging((state) => state.currentPage);

  if (!currentPage) {
    return <div>Loading...</div>
  }

  const Page = F1Page[currentPage as keyof typeof F1Page];

  return <Suspense fallback={<div />}>
    <section className='w-full max-w-[40rem] mx-auto '>
      <Page />
    </section>
  </Suspense>

}
