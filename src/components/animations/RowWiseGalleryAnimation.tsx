'use client';

import { useRef, useState, memo, useEffect, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { cn } from '@heroui/react';
import Img from '../ui/Img';

type RowImageProp = {
  items: any[];
  index: number;
  isShowQr: boolean;
};

const RowImages = memo(({ items, index, isShowQr }: RowImageProp) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    const iSpeed = (index % 3) + 1;
    if (rowRef.current) {
      const container = rowRef.current;
      const scrollWidth = container.scrollWidth;
      const offsetWidth = container.offsetWidth;

      // const animationDuration = 5 * (items.length + speed);
      const scrollableDistance = scrollWidth - offsetWidth;

      if (scrollWidth - container.clientWidth >= 60) {
        const speed = 100;
        const duration = (scrollableDistance / speed) * iSpeed;
        timelineRef.current = gsap.timeline();
        timelineRef.current.to(rowRef.current, {
          scrollLeft: 0,
          duration: 1,
          ease: 'circ.inOut',
        });
        timelineRef.current.to(container, {
          scrollLeft: scrollWidth - container.clientWidth,
          duration: duration,
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
      if (timelineRef.current && rowRef.current) {
        timelineRef.current.kill();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [items]);

  return (
    <div
      ref={rowRef}
      className="flex flex-row items-center gap-4 w-full relative overflow-x-auto  will-change-transform scrollbar-hide"
    >
      {items.map((item, index2) => {
        if (!item.resultImage) {
          return null
        };
        return (
          <motion.div
            layout
            initial={{ transform: 'scale3d(0, 0, 1)' }}
            animate={{
              transform: 'scale3d(1, 1, 1)',
              transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] },
            }}
            key={`${item.resultImage}-${index2}`}
            className={cn(
              `flex flex-col items-center min-w-[250px]  relative `,
              isShowQr && 'pb-[3rem]',
            )}
          >
            {/* <Img */}
            <motion.img
              src={item.resultImage}
              key={index2}
              className="h-[250px] object-cover rounded-2xl shadow-xl"
            />
            {isShowQr && (
              <div className="w-[5rem] bg-white border-5 rounded-sm shadow-md border-white absolute bottom-[0.5rem]">
                <QRCode className="w-full h-full" value={item.imageLink} />
              </div>
            )}
          </motion.div>
        )
      }
      )}
    </div>
  );
});

const RowWiseGalleryAnimation = ({ data }: { data: any[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [calRows, setCalRows] = useState('2');
  const rows = parseInt(useSearchParams().get('rows') ?? calRows);
  const showQr = useSearchParams().get('showQr');
  const isShowQr = showQr === 'true';

  const calculateRows = (logoHeight: number) => {
    if (containerRef.current) {
      let totalContainerHeight = containerRef.current.clientHeight - logoHeight;
      containerRef.current.style.height = `${totalContainerHeight}px`;
      // let denominator = 300 + (isShowQr ? 48 : 0);
      let denominator = 250 + (isShowQr ? 48 : 0);
      const rows = Math.floor(totalContainerHeight / denominator);
      setCalRows(rows.toString());
    }
  };
  useEffect(() => {
    const logoHeight = document.querySelector('.logo')?.clientHeight;
    if (logoHeight) {
      calculateRows(logoHeight);
    } else {
      calculateRows(0);
    }
  }, []);

  const updatedData = useMemo(() => {
    const doubleData = Array.from({ length: rows }, () => [] as any[]);
    for (let i = 0; i < data.length; i++) {
      const rowIndex = i % rows;
      doubleData[rowIndex].push(data[i]);
    }
    return doubleData;
  }, [data, calRows]);

  return (
    <>
      <div
        ref={containerRef}
        // className="w-full h-screen flex flex-col gap-4 p-2 overflow-hidden"
        className="grid h-[100vh] w-full "
        style={{
          willChange: 'transform',
          gridTemplateRows: `repeat(${rows} ,1fr)`,
          gridGap: '1rem',
        }}
      >
        {updatedData.map((items, index) => (
          <RowImages
            key={index}
            items={items}
            index={index}
            isShowQr={isShowQr}
          />
        ))}
      </div>
    </>
  );
};

export default RowWiseGalleryAnimation;
