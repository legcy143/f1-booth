"use client"
import React, { useEffect, useState } from 'react'
import ThemeButton from '@/components/ui/ThemeButton'

export default function Finish() {
  const handleClose = () => {
    window.location.href = "/";
  }

  const [timer, setTimer] = useState(15);

  useEffect(() => {
    if (timer === 0) {
      handleClose();
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <section className='animate-appearance-in border border-gray-400/50 rounded-2xl p-5 bg-gray-500/50 backdrop-blur-sm  flex flex-col items-center justify-center gap-1 m-auto text-center' >
      <img src="https://gkh-images.s3.amazonaws.com/40e38748-dd5d-4795-8ab2-829f0b18a585_Loading.gif" className='size-[10rem]' alt="" />
      <h1 className='text-2xl md:text-3xl font-bold'>Ai Magic At work</h1>
      <p>Your portraits will be delivered soon on your email</p>
      <div className="mt-4 text-lg font-semibold text-brand">Closing in {timer} second{timer !== 1 ? 's' : ''}...</div>
      <ThemeButton className='mt-5' onPress={handleClose}> Close</ThemeButton>
    </section>
  )
}
