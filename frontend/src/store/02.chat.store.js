import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";


axios.defaults.withCredentials = true;

const base_url = import.meta.env.MODE === "development" ? "http://localhost:3000" :"https://prepai-production-36c8.up.railway.app"

export const userChat = create((set, get) => ({
    preReq: {},
    aiResponse: {},
    loading: false,
    error: null,

    preInt: async ( type, level, company) => {
        set({ loading: true,aiResponse:{},error:null });
        try {
            const response = await axios.post(`${base_url}/api/preInterview/`, {
                type, level, company
            });
            set({ preReq: response.data,loading: false });
            return response.data
        }
        catch (error) {
            set({ error: error.message, loading: false });
        }

    },


    running: async (id, qId, userResponse) => {
        set({ loading: true });
        try {
            const response = await axios.post(`${base_url}/api/preInterview/conv`, {
                id, qId, userResponse
            });
            console.log("RUNNING RESPONSE:", response.data);

            set({ aiResponse: response.data,loading:false });
        }
        catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    reset: () => set({ aiResponse: {}, preReq: {}, error: null })
}))