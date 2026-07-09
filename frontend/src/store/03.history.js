import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const base_url = "http://localhost:3000" //import.meta.env.MODE === "development" ? "http://localhost:3000" :"https://prepai-production-36c8.up.railway.app"
export const useHistory = create((set, get) => ({
    chat: [],
    interview: [],
    completed:[],
    analytics:{},
    loading: false,
    error: null,

    myChatHistory: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${base_url}/hist/chat/${id}`)

            set({ chat: response.data.response, loading: false, error: null })
        }
        catch (error) {
            set({ error: error.message, loading: false })
        }
    },
    myInterviews:async(token)=>{
         set({ loading: true, error: null });
         try{
            const response = await axios.get(`${base_url}/hist/allInterview`, )
            set({interview:response.data.response,completed:response.data.response2,loading:false,error:null});
            return response.data.response;
            
         }catch(error){
            set({ error: error.message, loading: false })
         }
      
    },
    analysis:async (interviewId,userId)=>{
        set({ loading: true, error: null });
        try{
           let response = await axios.get(`${base_url}/hist/${interviewId}/${userId}`);
             set({analytics:response.data.response,loading:false,error:null});
             return response.data.response;

        }catch(error){
            set({ error: error.message, loading: false })
        } 
    }
}))