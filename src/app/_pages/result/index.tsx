import usePagging from '@/app/_store/usePagging';
import { useVideoTemplateBooth } from '@/app/_store/useVideoTemplateBooth';
import ThemeButton from '@/components/ui/ThemeButton';
import React, { useState } from 'react';
import { MdDownload, MdRefresh } from 'react-icons/md';

export default function Result() {
  const setCurrentPage = usePagging(state => state.setCurrentPage);
  const { video } = useVideoTemplateBooth();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    if (video && typeof video === 'string') {
      const link = document.createElement('a');
      link.href = video;
      link.download = 'uploaded-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleUploadAnother = () => {
    setCurrentPage("videoUpload");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4 mx-auto"></div>
          <h2 className="text-xl font-semibold">Processing your video...</h2>
          <p className="text-sm mt-2">Please wait while we process your upload</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-2xl rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Upload Complete!</h1>
        </div>

        {video && (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden bg-black/10">
              {typeof video === 'string' && video ? (
                <video
                  src={video}
                  className="w-full h-64 object-contain"
                  controls
                  preload="metadata"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded">
                  <p className="text-gray-600">Invalid video format</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <ThemeButton
                onPress={handleDownload}
                className="flex items-center gap-2 px-6"
              >
                <MdDownload size={20} />
                Download
              </ThemeButton>
              <ThemeButton
                onPress={handleUploadAnother}
                className="flex items-center gap-2 px-6"
              >
                <MdRefresh size={20} />
                Upload Another
              </ThemeButton>
            </div>
          </div>
        )}

        {!video && (
          <div className="text-center">
            <p className="text-sm">No result data available</p>
            <ThemeButton
              onPress={handleUploadAnother}
              className="mt-4"
            >
              Go Back to Upload
            </ThemeButton>
          </div>
        )}
      </div>
    </div>
  );
}
