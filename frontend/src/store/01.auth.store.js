import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const base_url = import.meta.env.MODE === "development" ? "http://localhost:3000" :""

// user Authentication handling

export const userAuth = create((set, get) => ({
    user: {},
    know:{},
    logger:{},
    loading: false,
    error: null,
    knowMe: async () => {
        set({ loading: true });
        try{
         const response = await axios.get(`${base_url}/knowMe`)
         set({know:response.data,error:null,loading:false});

        }catch(error){
            set({ error: error.message, loading: false });
        }
    },
    logOut: async()=>{
        set({ loading: true });
        try{
            const response = await axios.get(`${base_url}/logOut`)
            set({logger:response.data,know:{},error:null,loading:false});

        }
        catch(error){
            set({ error: error.message, loading: false });
        }
    }

}))