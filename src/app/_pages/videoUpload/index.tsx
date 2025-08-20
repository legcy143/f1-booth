import usePagging from '@/app/_store/usePagging';
import ThemeButton from '@/components/ui/ThemeButton';
import { useVideoTemplateBooth } from '@/app/_store/useVideoTemplateBooth';
import { uploadSingleFile } from '@/utils/upload';
import React, { useRef, useState } from 'react';
import { MdOutlineKeyboardArrowLeft, MdUpload, MdPlayArrow, MdPause, MdClose } from 'react-icons/md';
import { FiUpload } from 'react-icons/fi';

export default function VideoUpload() {
  const setCurrentPage = usePagging(state => state.setCurrentPage);
  const { uploadVideo, isUploadingVideo } = useVideoTemplateBooth();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsPlaying(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = async () => {
    if (selectedFile && !isUploadingVideo) {
      try {
        // Upload video using store function
        await uploadVideo(selectedFile);
        
        // Navigate to result page
        setCurrentPage("result");
      } catch (error) {
        console.error("Error uploading video:", error);
        alert("Failed to upload video. Please try again.");
      }
    }
  };

  const handleRemoveVideo = () => {
    setSelectedFile(null);
    setVideoUrl('');
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl p-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold">Upload Your Video</h1>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          {!selectedFile ? (
            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full p-6 transition-colors">
                  <FiUpload size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload Your Video</h3>
                  <p>Click here to select a video file from your device</p>
                  <p className="text-sm mt-2">Supports MP4, MOV, AVI formats</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video Preview with Remove Button */}
              <div className="relative bg-black rounded-2xl overflow-hidden">
                {/* Remove Button */}
                <button
                  onClick={handleRemoveVideo}
                  className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                >
                  <MdClose size={20} />
                </button>
                
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-64 object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls={false}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlayPause}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-4 backdrop-blur-sm transition-colors"
                  >
                    {isPlaying ? (
                      <MdPause className="text-white" size={32} />
                    ) : (
                      <MdPlayArrow className="text-white" size={32} />
                    )}
                  </button>
                </div>
              </div>

              {/* File Info */}
              <div className="rounded-xl p-4">
                <div className="flex items-center justify-center">
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Next Button - Always visible */}
        <div className="flex justify-center">
          <ThemeButton
            onPress={handleNext}
            disabled={!selectedFile || isUploadingVideo}
            className={`px-12 ${!selectedFile || isUploadingVideo ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isUploadingVideo ? "Uploading..." : "Next"}
          </ThemeButton>
        </div>
      </div>
    </div>
  );
}
