import React, { useState } from 'react';
import { MdClose, MdQrCode } from 'react-icons/md';
import ThemeButton from './ThemeButton';
import ShowQRModal from './ShowQRModal';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  videoTitle?: string;
}

export default function VideoPlayerModal({ 
  isOpen, 
  onClose, 
  videoSrc,
  videoTitle = "Video Player"
}: VideoPlayerModalProps) {
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const handleShowQR = () => {
    setShowQR(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{videoTitle}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Video Player */}
          <div className="aspect-video bg-black">
            <video
              src={videoSrc}
              className="w-full h-full"
              controls
              autoPlay
              preload="metadata"
            />
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-3 justify-center">
              <ThemeButton
                onPress={handleShowQR}
                className="flex items-center gap-2"
                variant="bordered"
              >
                <MdQrCode size={18} />
                Show QR Code
              </ThemeButton>
              
              <ThemeButton
                onPress={onClose}
                className="flex items-center gap-2"
              >
                Close
              </ThemeButton>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <ShowQRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        videoSrc={videoSrc}
        title="Share Video"
        description="Scan QR code to watch this video"
      />
    </>
  );
}
