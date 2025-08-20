import { uploadSingleFile } from "@/utils/upload";
import axios from "axios";
import { create } from "zustand"

interface StoryFormState {
    isUploadingVideo: boolean;
    isFetchingVideos: boolean;
    video: File | string | null;
    videos: Array<{
        input: string;
        output: string;
        timeStamp: string;
        _id: string;
    }>;
    uploadVideo: (file: File) => Promise<boolean>;
    fetchVideos: () => Promise<boolean>;
}

export const BASE_API_URL = "https://api.quenth.com"
const eventId = "68a5721879aa3a1e660f1634"


export const useVideoTemplateBooth = create<StoryFormState>((set, get) => ({
    isUploadingVideo: false,
    isFetchingVideos: false,
    video: null,
    videos: [],
    uploadVideo: async (file: File) => {
        set({ isUploadingVideo: true });
        try {
            let videoUrl = await uploadSingleFile(file);
            const res = await axios.post(`${BASE_API_URL}/video-template-booth/generate`,
                {
                    "eventId": eventId,
                    "templateId": "68a5721879aa3a1e660f1635",
                    "input": videoUrl
                }
            );
            set({ video: res.data.data });
            return true; // Success case
        } catch (error) {
            console.error("Error uploading video:", error);
            set({ video: null }); // Clear video on error
            return false; // Failure case
        } finally {
            set({ isUploadingVideo: false });
        }
    },
    fetchVideos: async () => {
        set({ isFetchingVideos: true });
        try {
            const res = await axios.get(`${BASE_API_URL}/video-template-booth/${eventId}`);
            set({ videos: res.data.data.data || [] });
            return true;
        } catch (error) {
            console.error("Error fetching videos:", error);
            return false;
        } finally {
            set({ isFetchingVideos: false });
        }
    }
}));