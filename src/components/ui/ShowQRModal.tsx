import React from 'react';
import { MdClose } from 'react-icons/md';
import QRCode from 'react-qr-code';
import ThemeButton from './ThemeButton';

interface ShowQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title?: string;
  description?: string;
}

export default function ShowQRModal({ 
  isOpen, 
  onClose, 
  videoSrc, 
  title = "Scan QR Code",
  description = "Scan to watch your video"
}: ShowQRModalProps) {
  if (!isOpen || !videoSrc) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <MdClose size={24} />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2 text-gray-700">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <QRCode
              value={videoSrc}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
        </div>
        
        <ThemeButton
          onPress={onClose}
          className="w-full"
        >
          Close
        </ThemeButton>
      </div>
    </div>
  );
}
