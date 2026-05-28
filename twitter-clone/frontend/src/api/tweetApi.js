import api from "./axios";

export const createTweet = (content) => {
    return api.post("/tweet", { content });
};

export const deleteTweet = (id) => {
    return api.delete(`/tweet/${id}`);
};

export const updateTweet = (id, newContent) => {
    return api.patch(`/tweet/${id}`, { newContent });
};

export const getMyTweets = () => {
    return api.get("/tweet/view");
};

export const getTweetsByUsername =(username)=>{
    return api.get(`/tweet/${username}`);
}
export const getAllTweets = () => {
    return api.get("/tweet");
};



