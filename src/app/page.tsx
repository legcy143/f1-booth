"use client"
import React, { Suspense } from 'react'
import usePagging from './_store/usePagging';
import { VideoTemplatePages } from './_pages/VideoTemplatePages';

export default function Home() {
  const currentPage = usePagging((state) => state.currentPage);

  if (!currentPage) {
    return <div>Loading...</div>
  }

  const Page = VideoTemplatePages[currentPage as keyof typeof VideoTemplatePages];

  return <Suspense fallback={<div />}>
    <section className='w-full max-w-[40rem] mx-auto '>
      <Page />
    </section>
  </Suspense>

}
