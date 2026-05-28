import api from './api';

export const getUserProfile = async() => {
    const response  = await api.get(
        "/api/users/"
    );

    return response.data;
};

export const updateUserProfile = async(data) => {
    const response = api.patch(
        "/api/users/edit",
        data
    );

    return response.data;
};


export const getOtherProfile=(username)=>{
    return api.post(`/api/user/view`,{username});
}

export const followUserProfile=(id)=>{
    return api.post(`/api/user/follow/${id}`);
}

export const unfollowUserProfile=(id)=>{
    return api.delete(`/api/user/unfollow/${id}`);
}

export const getFollowersForUser=(id)=>{
    return api.get(`api/user/followers`,{
        params: id ? {id} : {}
    })
}

export const getFollowingForUser=(id)=>{
    return api.get(`api/user/following`,{
        params: id ? {id} : {}
    })
}