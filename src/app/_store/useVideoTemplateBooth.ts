import { uploadSingleFile } from "@/utils/upload";
import axios from "axios";
import { create } from "zustand"

interface StoryFormState {
    isUploadingVideo: boolean;
    video: File | string | null;
    uploadVideo: (file: File) => Promise<void>;
}

export const BASE_API_URL = "https://api.quenth.com"


export const useVideoTemplateBooth = create<StoryFormState>((set, get) => ({
    isUploadingVideo: false,
    video: null,
    uploadVideo: async (file: File) => {
        set({ isUploadingVideo: true });
        try {
            let videoUrl = await uploadSingleFile(file);
            const res = await axios.post(`${BASE_API_URL}/video-template-booth/generate`,
                {
                    "eventId": "68a5721879aa3a1e660f1634",
                    "templateId": "68a5721879aa3a1e660f1635",
                    "input": videoUrl
                }
            );
            set({ video: res.data.data });
            return res.data.data;
        } catch (error) {
            console.error("Error uploading video:", error);
            throw error;
        } finally {
            set({ isUploadingVideo: false });
        }
    }
}));