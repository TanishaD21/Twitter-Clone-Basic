import api from './api';

export const getUserProfile = async() => {
    const response  = await api.get(
        "/api/users/"
    );

    return response.data;
};

export const updateUserProfile = async(data) => {
    const response = await api.put(
        "/api/users/edit",
        data
    );

    return response.data;
};


export const getOtherProfile=async(username)=>{
    const response = await api.post(`/api/users/view`,{username});
    return response.data;
}

export const followUserProfile=async (id)=>{
    const response = await api.post(`/api/users/follow/${id}`);
    return response.data;
}

export const unfollowUserProfile=async(id)=>{
    const response = await api.delete(`/api/users/unfollow/${id}`);
    return response.data;
}

export const getFollowersForUser=async(id)=>{
    const response=  await api.get(`api/users/followers`,{
        params: id ? {id} : {}
    })
    return response.data;
}

export const getFollowingForUser=async(id)=>{
    const response = await api.get(`api/users/following`,{
        params: id ? {id} : {}
    })
    return response.data;
}