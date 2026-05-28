import api from "./axios";

export const getUserProfile = () => {
    return api.get("/user");
};

export const updateUserProfile=(data)=>{
    return api.put("/user/edit",data);
}

export const getOtherProfile=(username)=>{
    return api.post(`/user/view`,{username});
}

export const followUserProfile=(id)=>{
    return api.post(`/user/follow/${id}`);
}

export const unfollowUserProfile=(id)=>{
    return api.delete(`/user/unfollow/${id}`);
}

export const getFollowersForUser=(id)=>{
    return api.get(`/user/followers`,{
        params: id ? {id} : {}
    })
}

export const getFollowingForUser=(id)=>{
    return api.get(`/user/following`,{
        params: id ? {id} : {}
    })
}