'use client'

import { useVideoTemplateBooth } from '@/app/_store/useVideoTemplateBooth';
import ThemeButton from '@/components/ui/ThemeButton';
import ShowQRModal from '@/components/ui/ShowQRModal';
import VideoPlayerModal from '@/components/ui/VideoPlayerModal';
import TableUI from '@/components/ui/TableUI';
import React, { useEffect, useState, useMemo } from 'react';
import { MdQrCode, MdPlayArrow } from 'react-icons/md';
import { Button } from '@heroui/react';

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

  // Table columns configuration
  const columns = useMemo(() => [
    {
      uid: 'videoNumber',
      name: 'Video #',
      sortable: true
    },
    {
      uid: 'originalVideo',
      name: 'Original Video',
      sortable: false
    },
    {
      uid: 'outputVideo', 
      name: 'Output Video',
      sortable: false
    },
    {
      uid: 'uploadDate',
      name: 'Upload Date',
      sortable: true
    },
    {
      uid: 'actions',
      name: 'Actions',
      sortable: false
    }
  ], []);

  // Transform videos data for table
  const tableData = useMemo(() => {
    return videos.map((video, index) => ({
      _id: video._id,
      id: video._id,
      videoNumber: `#${index + 1}`,
      originalVideo: video.input,
      outputVideo: video.output,
      uploadDate: video.timeStamp,
      uploadDateFormatted: formatDate(video.timeStamp),
      actions: 'actions'
    }));
  }, [videos]);

  // Render cell content
  const renderCell = (item: any, columnKey: string | number) => {
    const key = String(columnKey);
    switch (key) {
      case 'videoNumber':
        return <span className="font-semibold">{item.videoNumber}</span>;
        
      case 'originalVideo':
        return (
          <div className="flex items-center justify-center">
            <Button
              size="sm"
              color="default"
              variant="flat"
              startContent={<MdPlayArrow size={16} />}
              onPress={() => handleWatchVideo(item.originalVideo, `Original Video ${item.videoNumber}`)}
            >
              Input
            </Button>
          </div>
        );
        
      case 'outputVideo':
        return (
          <div className="flex items-center justify-center">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<MdPlayArrow size={16} />}
              onPress={() => handleWatchVideo(item.outputVideo, `Processed Video ${item.videoNumber}`)}
            >
              Output
            </Button>
          </div>
        );
        
      case 'uploadDate':
        return (
          <div>
            <p className="font-medium">{item.uploadDateFormatted}</p>
          </div>
        );
        
      case 'actions':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              color="secondary"
              variant="flat"
              startContent={<MdQrCode size={16} />}
              onPress={() => handleShowQR(item.outputVideo)}
            >
              QR
            </Button>
          </div>
        );
        
      default:
        return item[columnKey];
    }
  };

  if (isFetchingVideos) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <h2 className="text-xl font-semibold text-black">Loading videos...</h2>
          <p className="text-sm mt-2 text-black">Please wait while we fetch your videos</p>
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
            <div className="p-12">
              <MdPlayArrow size={48} className="mx-auto text-black mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">No videos yet</h3>
              <p className="text-black mb-6">Start by uploading your first video</p>
              <ThemeButton
                onPress={() => window.location.href = '/'}
                className="px-8 py-3"
              >
                Upload Video
              </ThemeButton>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <TableUI
              title="Videos"
              columns={columns}
              tableData={tableData}
              statusOptions={[]}
              renderCell={renderCell}
              className="min-h-[400px]"
              numberOfDataPerPage={10}
            />
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
