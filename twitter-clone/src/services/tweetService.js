import api from './api';

export const getAllTweets = async() => {
    const response = await api.get(
        "/api/tweets"
    );

    return response.data;
};

export const createTweet = async(tweetData) => {
    const response = await api.post(
        "/api/tweets",
        tweetData
    );
    return response.data;
};