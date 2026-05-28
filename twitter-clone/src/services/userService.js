import api from './api';

export const getUserProfile = async() => {
    const response  = api.get(
        "/api/users/"
    );

    return (await response).data;
};