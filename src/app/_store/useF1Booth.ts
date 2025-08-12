import axios from "axios";
import { create } from "zustand"

interface User {
    image: string;
    name: string;
    designation: string;
}

interface StoryFormState {
    userDto: User;
    setUserDto: (user: Partial<User>) => void;
    isSaveLoading: boolean;
    save: () => Promise<boolean>;
}

export const BASE_API_URL = "https://f1booth.quenth.com"



export const useF1Booth = create<StoryFormState>((set, get) => ({
    userDto: {
        image: "",
        name: "",
        designation: ""
    },
    setUserDto: (user: Partial<User>) => set({ userDto: { ...get().userDto, ...user } }),
    isSaveLoading: false,
    save: async () => {
        set({ isSaveLoading: true });
        try {
            const response = await axios.post(`${BASE_API_URL}/save`, get().userDto);
            return response.status === 200;
        } catch (error) {
            console.error("Error saving user data:", error);
            return false;
        } finally {
            set({ isSaveLoading: false });
        }
    }
}));