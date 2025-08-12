'use client';

import { useRef, useState, memo, useEffect, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { motion } from 'framer-motion';

type ColImageProps = {
  items: any[];
  index: number;
  isShowQr: boolean;
};

const ColsImages = memo(({ items, index, isShowQr }: ColImageProps) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    const iSpeed = (index % 3) + 1;
    if (columnRef.current) {
      const logoHeight = document.querySelector('.logo')?.clientHeight || 0;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - logoHeight;

      columnRef.current.style.height = `${newHeight}px`;
      const container = columnRef.current;
      const scrollHeight = container.scrollHeight;
      const offsetHeight = container.offsetHeight;

      // const animationDuration = 5 * maxLength
      const scrollableDistance = scrollHeight - offsetHeight;

      if (scrollHeight - container.clientHeight >= 60) {
        const speed = 100;
        const duration = (scrollableDistance / speed) * iSpeed;
        timelineRef.current = gsap.timeline();
        timelineRef.current.to(columnRef.current, {
          scrollTop: 0,
          duration: 1,
          ease: 'circ.inOut',
        });
        timelineRef.current.to(container, {
          scrollTop: scrollableDistance,
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
      if (timelineRef.current && columnRef.current) {
        timelineRef.current.kill();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [items]);

  return (
    <div
      ref={columnRef}
      className="flex flex-col items-center max-w-[250px] relative pb-[3rem] overflow-y-auto max-h-screen will-change-transform scrollbar-hide "
    >
      {items.map((item, index2) => (
        <motion.div
          layout
          initial={{ transform: 'scale3d(0, 0, 1)' }}
          animate={{
            transform: 'scale3d(1, 1, 1)',
            transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] },
          }}
          key={`${item.imageLink}-${index2}`}
          className="flex flex-col gap-4 items-center max-w-[250px] relative pb-[3rem]"
        >
          <motion.img
            src={item.imageLink}
            alt="Image"
            className="h-96 object-cover rounded-2xl shadow-xl"
          />
          {isShowQr && (
            <div className="w-[5rem] bg-white border-5 rounded-sm shadow-md border-white absolute bottom-[0.5rem]">
              <QRCode className="w-full h-full" value={item.imageLink} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
});

const ColumnWiseGalleryAnimation = ({ data }: { data: any[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [calCols, setCalCols] = useState('5');
  const cols = parseInt(useSearchParams().get('cols') ?? calCols);
  const showQr = useSearchParams().get('showQr');
  const isShowQr = showQr === 'true';

  const calculateCols = () => {
    if (containerRef.current) {
      let totalContainerWidth = containerRef.current.clientWidth;
      const cols = Math.round(totalContainerWidth / 250);
      setCalCols(cols.toString());
    }
  };
  useEffect(() => {
    calculateCols();
  }, []);

  const updatedData = useMemo(() => {
    const doubleData = Array.from({ length: cols }, () => [] as any[]);
    for (let i = 0; i < data.length; i++) {
      const colIndex = i % cols;
      doubleData[colIndex].push(data[i]);
    }
    return doubleData;
  }, [data, calCols]);

  return (
    <>
      <div
        ref={containerRef}
        className="w-full  h-full flex gap-4 p-2 overflow-hidden"
        style={{
          whiteSpace: 'nowrap',
          gap: '1rem',
          // willChange: 'transform',
        }}
      >
        {updatedData.map((items, index) => (
          <ColsImages
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

export default ColumnWiseGalleryAnimation;
