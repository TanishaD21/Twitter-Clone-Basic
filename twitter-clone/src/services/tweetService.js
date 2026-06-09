import api from './api';

export const getAllTweets = async() => {
    const response = await api.get(
        "/api/tweets"
    );

    return response.data;
};

export const getFollowingTweets = async() =>{
    const response = await api.get(
        "/api/tweets/following"
    );

    return response.data;
}

export const getMyTweets = async() => {
    const response = await api.get(
        "/api/tweets/view"
    );
    return response.data;
}

export const createTweet = async(tweetData) => {
    const response = await api.post(
        "/api/tweets",
        tweetData
    );
    return response.data;
};

export const deleteTweet = async(tweetId) => {
    const response = await api.delete(
        `/api/tweets/${tweetId}`
    );
    return response.data;
}

export const likeTweet = async(tweetId) => {
    const response = await api.post(
        `/api/likes/${tweetId}`
    );

    return response.data;
}

export const unlikeTweet = async(tweetId) => {
    const response = await api.delete(
        `/api/likes/${tweetId}`
    );

    return response.data;
}


export const addComment = async(tweetId, content) => {
    const response = await api.post(
        `/api/comments/${tweetId}`,
        {content}
    );
    return response.data;
}

export const getComments  = async(tweetId) => {
    const response = await api.get(
        `/api/comments/${tweetId}`
    );

    return response.data;
}


export const deleteComments = async(tweetId, commentId) => {
    const response =  await api.delete(
        `/api/comments/${tweetId}`,
        {
            data:{ id: commentId}
        }
    );

    return response.data;
}


export const updateComments = async(tweetId, commentId, content) => {
    const response = await api.patch(
        `/api/comments/${tweetId}`,
        {
            id: commentId,
            content: content
        }
    );

    return response.data;
}