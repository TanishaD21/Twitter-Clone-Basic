import api from "./axios";

export const getAllComments = (id) => {
    return api.get(`/comment/${id}`);
};

export const getMyComments = () => {
    return api.get("/comment");
};

export const addComment = (id,content) => {
    return api.post(`/comment/addComment/${id}`, { content });
};

export const deleteComment = (id) => {
    return api.delete(`/comment/deleteComment/${id}`);
};

export const updateComment = (id, content) => {
    return api.put(`/tweet/updatetweet/${id}`, { newContent: content });
};