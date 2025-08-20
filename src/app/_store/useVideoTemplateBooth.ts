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
            let res = await uploadSingleFile(file);
            set({ video: res });
            return res;
        } catch (error) {
            console.error("Error uploading video:", error);
            throw error;
        } finally {
            set({ isUploadingVideo: false });
        }
    }
}));