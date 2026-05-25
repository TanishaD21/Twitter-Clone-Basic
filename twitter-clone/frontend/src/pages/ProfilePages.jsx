import { useState,useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProfileCard from "../components/profile/ProfileCard"
import { getAllProfiles } from "../api/userApi";

function ProfilePages(){
    const [profiles,setProfiles]=useState(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");

    const fetchProfile= async ()=>{
        try{
            setLoading(true);
            setError("");

            const response=await getAllProfiles();
            setProfiles(response.data.user || null);
        }
        catch(error)
        {
            console.log(error);
            setError(error.response?.data?.message|| "Failed to fetch profiles");
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchProfile();
    },[]);
    return(
        <MainLayout>
            <div className="profilepage"></div>
                <h1>Profile Page</h1>

                {loading && <p>Loading profiles..</p>}
                {error && <p>{error}</p>}

                <div className="profile-list">
                    {!loading && profiles ? (
                    <ProfileCard user={profiles} />
                ) : (
                    !loading && <p>Profile not found</p>
                )}
                </div>

        </MainLayout>
    )
}

export default ProfilePages;