import { cn } from '@heroui/react';
import React, { useEffect, useState, useRef } from 'react'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string
    placeHolder?: string
}

export default function Img({ className, placeHolder, src, ...props }: ImageProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setImageLoaded(true);
        }
    }, []);

    if (!src) {
        return (
            <div className={cn('h-full w-full bg-sidebar text-2xl grid place-items-center capitalize', className)} >{placeHolder}</div>
        )
    }


    return (
        <img
            ref={imgRef}
            src={src}
            className={cn('h-full w-full object-cover transition-all duration-500', imageLoaded ? 'image-loaded' : 'image-loading', className)}
            onLoad={() => setImageLoaded(true)}
            style={{
                imageRendering: 'auto',
                ...props.style
            }}
            {...props}
        />
    )
}
