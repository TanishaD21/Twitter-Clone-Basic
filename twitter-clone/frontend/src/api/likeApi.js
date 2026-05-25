import api from "./axios.js"

export const like=(id)=>{
    return api.post(`/like/${id}`);
}

export const unlike=(id)=>{
    return api.delete(`/like/${id}`)
}