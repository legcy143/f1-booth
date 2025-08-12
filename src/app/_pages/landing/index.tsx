import usePagging from '@/app/_store/usePagging'
import ThemeButton from '@/components/ui/ThemeButton'
import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Landing() {
  const setCurrentPage = usePagging((state) => state.setCurrentPage)
  const router = useRouter();

  const handleRedirect = (city: string) => {
    router.push("?city=" + city)
    setCurrentPage("camera")
  }
  return (
    <div className='flex flex-col items-center  text-center animate-appearance-in'>
      <h1 className='text-primary text-5xl lg:text-7xl font-bold'>F1 Story booth</h1>
      <p className='opacity-60 text-xl p-3'>choose location to continue</p>
      <div className='flex gap-4 mt-5'>
        <ThemeButton onPress={() => handleRedirect("Banglore")}>Banglore</ThemeButton>
        <ThemeButton onPress={() => handleRedirect("Mumbai")}>Mumbai</ThemeButton>
      </div>
    </div>
  )
}
