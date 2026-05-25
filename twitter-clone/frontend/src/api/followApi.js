import api from "./axios.js"

export const follow=(id)=>{
    return api.post(`/follow/${id}`);
}
