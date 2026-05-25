import api from "./axios";

export const getAllTweets = () => {
    return api.get("/tweet");
};

export const getMyTweets = () => {
    return api.get("/tweet/view");
};

export const createTweet = (content) => {
    return api.post("/tweet", { content });
};

export const deleteTweet = (id) => {
    return api.delete(`/tweet/${id}`);
};

export const updateTweet = (id, content) => {
    return api.put(`/tweet/${id}`, { newContent: content });
};