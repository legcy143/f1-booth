import usePagging from '@/app/_store/usePagging';
import { useF1Booth } from '@/app/_store/useF1Booth';
import ThemeButton from '@/components/ui/ThemeButton';
import { Input } from '@heroui/react';
import React from 'react'
import { BsStars } from 'react-icons/bs';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

export default function InformationForm() {
  const setCurrentPage = usePagging(state => state.setCurrentPage);
  const isSaveLoading = useF1Booth(state => state.isSaveLoading);
  const setUserDto = useF1Booth(state => state.setUserDto);
  const save = useF1Booth(state => state.save);

  const GoPrevious = () => {
    setCurrentPage("camera")
  }

  const handleNext = async () => {
    let res = await save();
    if (res)
      setCurrentPage("submitted")
  }
  return (
    <section className='animate-appearance-in border border-gray-400/50 rounded-2xl p-5 bg-gray-500/50 backdrop-blur-sm  flex flex-col gap-7 m-auto'>
      <h1 className='text-center text-2xl md:text-3xl font-bold'>Information</h1>
      <div className='flex flex-col gap-5 '>
        <div className='flex flex-col gap-1'>
          <label htmlFor="name" className='font-semibold'>Name</label>
          <input type="text" placeholder='john doe' className='border rounded-full p-3 px-4' />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="designation" className='font-semibold'>Designation</label>
          <input type="text" placeholder='designation' className='border rounded-full p-3 px-4' />
        </div>
      </div>
      <div className='flex flex-row justify-between items-center'>
        <ThemeButton isIconOnly={true} onPress={GoPrevious} isDisabled={isSaveLoading}>
          <MdOutlineKeyboardArrowLeft className='size-7' />
        </ThemeButton>
        <ThemeButton
          isLoading={isSaveLoading}
          onPress={handleNext}> <BsStars /> submit</ThemeButton>
      </div>
    </section>
  )
}
