"use client"
import React from 'react'

export default function Provider({ children }: { children: React.ReactNode }) {

    return (
        <main className='flex flex-col items-center justify-between p-5 gap-10 h-[100dvh] w-screen bg-black text-gray-200 relative overflow-hidden overflow-y-auto'>
            <div className='bg-primary fixed -top-[5rem] -left-[5rem] size-[20rem] blur-[15rem]' />
            <div className='bg-primary fixed -bottom-[5rem] -right-[5rem] size-[20rem] blur-[15rem]' />
            {/* <h1 className='text-2xl font-bold'>Story Form</h1> */}
            <img className='h-[3rem]' src="https://gkh-images.s3.amazonaws.com/fc217aa1-6cf7-434b-bb6f-9e4b2d9ca5e2_png.png" alt="logo" />
            {children}
            <footer className='mt-8 text-sm text-gray-500'>
                © {new Date().getFullYear()} Quenth All rights reserved.
            </footer>
        </main>
    )
}
