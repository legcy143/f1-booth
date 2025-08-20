'use client'

import { useVideoTemplateBooth } from '@/app/_store/useVideoTemplateBooth';
import ThemeButton from '@/components/ui/ThemeButton';
import ShowQRModal from '@/components/ui/ShowQRModal';
import VideoPlayerModal from '@/components/ui/VideoPlayerModal';
import React, { useEffect, useState } from 'react';
import { MdQrCode, MdPlayArrow } from 'react-icons/md';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from '@heroui/react';

export default function DashboardPage() {
  const { videos, isFetchingVideos, fetchVideos } = useVideoTemplateBooth();
  const [showQR, setShowQR] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleShowQR = (videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    setShowQR(true);
  };

  const handleWatchVideo = (videoUrl: string, videoTitle: string) => {
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoTitle(videoTitle);
    setShowVideoPlayer(true);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isFetchingVideos) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading videos...</h2>
          <p className="text-sm mt-2 text-gray-600">Please wait while we fetch your videos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        {/* Videos Table */}
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
              <MdPlayArrow size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
              <p className="text-gray-600 mb-6">Start by uploading your first video</p>
              <ThemeButton
                onPress={() => window.location.href = '/'}
                className="px-8 py-3"
              >
                Upload Video
              </ThemeButton>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Table 
              aria-label="Videos table"
              classNames={{
                wrapper: "shadow-none",
                th: "bg-gray-50 text-gray-700 font-semibold",
                td: "py-4"
              }}
            >
              <TableHeader>
                <TableColumn>Video</TableColumn>
                <TableColumn>Original Video</TableColumn>
                <TableColumn>Output Video</TableColumn>
                <TableColumn>Upload Date</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {videos.map((video, index) => (
                  <TableRow key={video._id}>
                    <TableCell>
                      <span className="font-semibold">{index + 1}</span>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          size="sm"
                          color="default"
                          variant="flat"
                          startContent={<MdPlayArrow size={16} />}
                          onPress={() => handleWatchVideo(video.input, `Original Video #${index + 1}`)}
                        >
                          Input
                        </Button>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          startContent={<MdPlayArrow size={16} />}
                          onPress={() => handleWatchVideo(video.output, `Processed Video #${index + 1}`)}
                        >
                          Output
                        </Button>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(video.timeStamp)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(video.timeStamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="secondary"
                          variant="flat"
                          startContent={<MdQrCode size={16} />}
                          onPress={() => handleShowQR(video.output)}
                        >
                          QR
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <ShowQRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        videoSrc={selectedVideoUrl}
        title="Share Video"
        description="Scan QR code to watch this video"
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={showVideoPlayer}
        onClose={() => setShowVideoPlayer(false)}
        videoSrc={selectedVideoUrl}
        videoTitle={selectedVideoTitle}
      />
    </div>
  );
}
