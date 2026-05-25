import api from "./axios";

export const getAllProfiles = () => {
    return api.get("/user");
};

export const updateUserProfile=()=>{
    return api.put("/user/edit");
}
