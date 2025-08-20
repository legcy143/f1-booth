import { create } from 'zustand';
import { VideoTemplatePageType } from '../_pages/VideoTemplatePages';


interface PaggingStore {
    currentPage: VideoTemplatePageType | null;
    setCurrentPage: (page: VideoTemplatePageType) => void;
}

const usePagging = create<PaggingStore>((set) => ({
    currentPage: "videoUpload",
    setCurrentPage: (page) => set({ currentPage: page }),
}));

export default usePagging;
