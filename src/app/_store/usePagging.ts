import { create } from 'zustand';
import { F1Pages } from '../_pages/F1Pages';


interface PaggingStore {
    currentPage: F1Pages | null;
    setCurrentPage: (page: F1Pages) => void;
}

const usePagging = create<PaggingStore>((set) => ({
    currentPage: "landing",
    setCurrentPage: (page) => set({ currentPage: page }),
}));

export default usePagging;
