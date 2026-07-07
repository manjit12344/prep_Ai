import { create } from "zustand";
import axios from "axios";

const base_url = import.meta.env.MODE === "development" ? "http://localhost:3000" :"https://prepai-production-36c8.up.railway.app"

const useResumeStore = create((set) => ({
    resumeUrl: "",
    review: null, // Initialized as null since it will hold a structured object now

    uploadResume: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "resume_uploads");

        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dwjsj9imy/auto/upload",
            formData,
            {
                withCredentials: false,
            }
        );

        set({
            resumeUrl: response.data.secure_url,
        });

        return response.data.secure_url;
    },

    clearResume: () => set({ resumeUrl: "", review: null }),

    toServer: async (url) => {
        const response = await axios.post(`${base_url}/resume`, {
            url: url
        });

        // 1. Target the markdown string wrapped inside response.data.response
        const rawResponseString = response.data.response || "";

        try {
            // 2. Safely strip Markdown boundaries
            const cleanJsonString = rawResponseString
                .replace(/^```json\s*/i, "")
                .replace(/\s*```$/, "")
                .trim();

            // 3. Parse it into a functional object
            const parsedReview = JSON.parse(cleanJsonString);

            set({ review: parsedReview });
            return parsedReview;

        } catch (error) {
            console.error("Error parsing AI response inside store:", error);
            
            // Fallback object structure just in case the AI or parser fails
            const fallbackReview = {
                atsScore: 0,
                strengths: [],
                weaknesses: ["Failed to properly analyze payload structural design."],
                suggestions: []
            };
            
            set({ review: fallbackReview });
            return fallbackReview;
        }
    }
}));

export default useResumeStore;