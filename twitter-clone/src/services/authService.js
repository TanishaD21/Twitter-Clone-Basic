import api from './api';


//Register new user
export const registerUser = async(userData) => {
    const response = await api.post(
        '/api/auth/register',
        userData
    );

    return response.data;
};

//Login existing user
export const loginUser = async(userData) => {
    const response = await api.post(
        '/api/auth/login',
        userData
    );

    return response.data;    
}

