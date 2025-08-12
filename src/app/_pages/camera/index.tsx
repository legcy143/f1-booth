import usePagging from '@/app/_store/usePagging';
import ThemeButton from '@/components/ui/ThemeButton';
import React, { useEffect, useRef, useState } from 'react'
import { LuCamera, LuCheck } from 'react-icons/lu';
import { MdOutlineKeyboardArrowLeft, MdOutlineRefresh } from 'react-icons/md';
import CameraErrorMessage from './_components/NotSupportErrorMessage';
import { uploadSingleFile } from '@/utils/upload';
import { useF1Booth } from '@/app/_store/useF1Booth';

export default function Camera() {
  const setCurrentPage = usePagging(state => state.setCurrentPage);

  const GoPrevious = () => {
    setCurrentPage("landing")
  }
  const setUserDto = useF1Booth(state => state.setUserDto);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerValue, setTimerValue] = useState(3);
  const [countdown, setCountdown] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [capturedDimensions, setCapturedDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const timerOptions = [
    { value: 0, label: 'Instant', icon: '0' },
    { value: 3, label: '3 seconds', icon: '3' },
    { value: 5, label: '5 seconds', icon: '5' },
    { value: 10, label: '10 seconds', icon: '10' },
  ];

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;

      const handleLoadedMetadata = () => {
        if (videoRef.current) {
          setVideoDimensions({
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          });
        }
      };

      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      // Force video to load and play
      videoRef.current.load();
      videoRef.current.play().catch(console.error);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener(
            'loadedmetadata',
            handleLoadedMetadata,
          );
        }
      };
    }
  }, [stream, facingMode]);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 320 },
          facingMode: facingMode,
          aspectRatio: { ideal: 1 / 1 },
        },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    const displayWidth = video.clientWidth;
    const displayHeight = video.clientHeight;

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    setCapturedDimensions({
      width: displayWidth,
      height: displayHeight,
    });

    if (context) {
      if (isMirrored) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(
          video,
          0,
          0,
          displayWidth,
          displayHeight,
          -displayWidth,
          0,
          displayWidth,
          displayHeight
        );
        context.restore();
      } else {
        context.drawImage(
          video,
          0,
          0,
          displayWidth,
          displayHeight,
          0,
          0,
          displayWidth,
          displayHeight
        );
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCapturedBlob(blob);
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage(imageUrl);
          }
        },
        'image/jpeg',
        0.8
      );
    }
  };

  const startTimerCapture = () => {
    setIsTimerActive(true);
    setCountdown(timerValue);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          capturePhoto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const retakePhoto = async () => {
    setIsRetaking(true);
    setCapturedImage(null);
    setCapturedBlob(null);

    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }

    try {
      await startCamera();
    } catch (error) {
      console.error('Error restarting camera:', error);
    } finally {
      setIsRetaking(false);
    }
  };

  const handleNextPage = async () => {
    if (!capturedBlob) {
      console.log('No captured image to upload.');
      return;
    }
    try {
      setIsUploadLoading(true);
      const file = new File([capturedBlob], 'captured-photo.jpg', {
        type: 'image/jpeg',
      });
      let image = await uploadSingleFile(file);
      // bhai idher , idher ho rha image set
      setUserDto({ image });

      if (stream) {
        console.log('Stopping camera stream...');
        stream.getTracks().forEach((track) => track.stop());
      }

      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
      // sab ho jaye to next page me bhej do
      setCurrentPage("informationForm");
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploadLoading(false);
    }
  }


  if (cameraError) {
    return (
      <section className='animate-appearance-in border border-gray-400/50 rounded-2xl p-5 bg-gray-500/50 backdrop-blur-sm  flex flex-col gap-7 m-auto'>
        <CameraErrorMessage cameraError={cameraError} startCamera={startCamera} />
      </section>
    );
  }


  return (
    <section className='animate-appearance-in border border-gray-400/50 rounded-2xl p-5 bg-gray-500/50 backdrop-blur-sm w-fit flex flex-col gap-7 m-auto'>
      <div className="mb-8">
        <div
          className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-sm border-4 border-gray-200"
          style={{ aspectRatio: '3/4', width: '320px', height: '320px' }}
        >
          {(isLoading || isRetaking) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-lg font-medium">
                  {isRetaking
                    ? 'Restarting camera...'
                    : 'Preparing your camera...'}
                </p>
              </div>
            </div>
          )}

          {isTimerActive && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="text-center text-white">
                <div className="text-8xl font-bold mb-6">{countdown}</div>
                <p className="text-2xl font-medium">Get ready...</p>
              </div>
            </div>
          )}

          {capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Your Amazing Photo"
                className="w-full h-full object-cover"
              />
              {capturedDimensions && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                  {capturedDimensions.width} × {capturedDimensions.height}
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{
                  transform: isMirrored ? 'scaleX(-1)' : 'none',
                }}
              />
              {videoDimensions && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                  {videoDimensions.width} × {videoDimensions.height}
                </div>
              )}
            </div>
          )}
        </div>
      </div>




      {
        capturedImage ? (
          <div className='flex flex-row gap-5 items-center justify-center' >
            <ThemeButton
              isIconOnly
              onPress={retakePhoto}
              isLoading={isRetaking}>
              <MdOutlineRefresh />
            </ThemeButton>
            <ThemeButton isIconOnly
              onPress={handleNextPage}
              isLoading={isUploadLoading}
            >
              <LuCheck />
            </ThemeButton>
          </div>
        ) : (

          <div className='flex flex-row gap-5 items-center justify-center'>
            <ThemeButton
              isIconOnly
              onPress={timerValue > 0 ? startTimerCapture : capturePhoto}
              isDisabled={isTimerActive || isLoading}
            >
              <LuCamera />
            </ThemeButton>

          </div>
        )
      }
      <canvas ref={canvasRef} className="hidden" />
      <div className='flex flex-row justify-between items-center'>
        <ThemeButton isIconOnly={true} onPress={GoPrevious}>
          <MdOutlineKeyboardArrowLeft className='size-7' />
        </ThemeButton>
        {/* <ThemeButton onPress={handleNext}>Next</ThemeButton> */}
      </div>
    </section >
  )
}
