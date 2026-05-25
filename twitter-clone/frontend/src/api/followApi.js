import api from "./axios.js"

export const follow=(id)=>{
    return api.post(`/follow/${id}`);
}

export const unfollow=(id)=>{
    return api.post(`/follow/${id}`);
}

export const getFollowers=()=>{
    return api.get(`/follow/followers`);
}

export const getFollowing=()=>{
    return api.get(`/follow/following`);
}