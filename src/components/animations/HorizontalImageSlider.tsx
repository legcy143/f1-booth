'use client';

import QRCode from 'react-qr-code';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import Img from '../ui/Img';

const HorizontalGallerySliderAnimation = ({ data }: { data: any[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [deg, setDeg] = useState('90');
    const [isRotateBtn, setisRotateBtn] = useState(true);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const showQr = useSearchParams().get('showQr');
    const isShowQr = showQr === 'true';
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const rotatePage = () => {
        if (containerRef.current) {
            gsap.to(containerRef.current, {
                rotation: deg,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    if (deg === '90') setDeg('180');
                    else if (deg === '180') setDeg('270');
                    else if (deg === '270') setDeg('0');
                    else setDeg('90');
                },
            });
        }
    };

    const startAutoScroll = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const scrollWidth = container.scrollWidth;
            const containerClientWidth = container.clientWidth;
            const animationDuration = 5 * data.length;

            if (scrollWidth - containerClientWidth >= 20) {
                timelineRef.current = gsap.timeline();
                timelineRef.current.to(container, { scrollLeft: 0 });
                timelineRef.current.to(container, {
                    scrollLeft: scrollWidth - container.offsetWidth,
                    duration: animationDuration,
                    ease: 'none',
                    repeat: -1,
                    yoyo: true,
                });
            }
        }
    };

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            startAutoScroll();
        }, 2000);

        return () => {
            if (timelineRef.current && containerRef.current) {
                timelineRef.current.kill();
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data]);

    const handleMouseEnter = () => {
        if (timelineRef.current) {
            timelineRef.current.pause();
        }
    };

    const handleMouseLeave = () => {
        if (timelineRef.current) {
            timelineRef.current.resume();
        }
    };
    return (
        <>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="w-full mt-[2rem] flex gap-6 p-4 overflow-hidden h-fit min-h-[25rem]"
                ref={containerRef}
                style={{
                    whiteSpace: 'nowrap',
                    willChange: 'transform',
                    transition: 'width 0.5s, height 0.5s',
                    backfaceVisibility: 'hidden', // Better rendering performance
                    perspective: '1000px', // Better 3D rendering
                }}
            >
                {data.map((item, index) => {
                    if (!item.resultImage) {
                        return null;
                    }
                    return (
                        <motion.div
                            layout
                            initial={{ transform: 'scale3d(0, 0, 1)' }}
                            animate={{
                                transform: 'scale3d(1, 1, 1)',
                                transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] },
                            }}
                            key={`${item.imageLink}-${index}`}
                            className="flex flex-col items-center min-w-[300px] max-w-[300px] relative pb-[3rem] mx-2"
                        >
                            <div className="w-full h-[400px] overflow-hidden shadow-xl ">
                                <Img
                                    src={item.resultImage}
                                    alt="Portrait Image"
                                    className="w-full h-full object-contain transition-all duration-300 antialiased rounded-3xl"
                                />
                            </div>
                            {isShowQr && (
                                <div className="size-[5rem] border-5 rounded-sm shadow-md  absolute bottom-[0.5rem]">
                                    <QRCode className="w-full h-full" value={item.resultImage} />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            <div
                className="flex gap-2"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: '999',
                }}
            >
                {/* <Button
                    style={{
                        display: isRotateBtn ? 'block' : 'none',
                    }}
                    className=" text-lg font-semibold rounded-lg px-4 py-2  "
                    onPress={rotatePage}
                >
                    Rotate
                </Button> */}
            </div>
        </>
    );
};

export default HorizontalGallerySliderAnimation;
