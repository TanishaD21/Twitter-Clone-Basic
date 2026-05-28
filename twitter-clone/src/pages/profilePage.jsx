import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import PostCard from "../components/postCard";

import { getUserProfile } from "../services/userService";
import { getMyTweets, deleteTweet } from "../services/tweetService";

import "./profilePage.css";

function ProfilePage(){

    const [profile, setProfile] = useState(null);
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const fetchProfile = async() => {
        try{
            setLoading(true);
            setError("");
            const profileData = await getUserProfile();
            setProfile(profileData.profile);
            const tweetData = await getMyTweets();
            setTweets(tweetData.tweets || []);
        }
        catch(error){
            console.log(error);
            setError(
                error.response?.data?.message ||
                "Failed to load profile"
            );
        }
        finally{
            setLoading(false);
        }
    };

    const handleDelete = async(tweetId) => {
        try{
            await deleteTweet(tweetId);
            setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId));
        }
        catch(error){
            console.log(error);
        }
    };

    useEffect(()=>{
        fetchProfile();
    },[]);

    return(
        <div className="profile-page">
            <Navbar/>

            <div className="profile-content">

                {loading && <p style={{ color: '#71767b', padding: 16 }}>Loading...</p>}
                {error && <p style={{ color: '#f4212e', padding: 16 }}>{error}</p>}

                {!loading && profile && (
                    <>
                        <div className="profile-header">
                            {/* Banner — placeholder color; swap src when you have a real banner */}
                            <div className="profile-banner" />

                            {/* Avatar overlapping the banner */}
                            <div className="profile-image-wrapper">
                                <img
                                    src={profile.profileImage || "https://via.placeholder.com/120"}
                                    alt="profile"
                                    className="profile-image"
                                />
                            </div>

                            {/* Edit profile button floated top-right of the info area */}
                            <button className="profile-edit-btn">Edit profile</button>

                            <div className="profile-info">
                                {/* Display name */}
                                <h1 className="profile-name">{profile.name}</h1>

                                <p className="profile-username">@{profile.username}</p>

                                <p className="profile-bio">{profile.bio || "No bio yet"}</p>

                                <div className="profile-stats">
                                    <div className="profile-stat">
                                        <span className="profile-stat-count">{profile.followersCount}</span>
                                        <span className="profile-stat-label">Followers</span>
                                    </div>
                                    <div className="profile-stat">
                                        <span className="profile-stat-count">{profile.followingCount}</span>
                                        <span className="profile-stat-label">Following</span>
                                    </div>
                                    <div className="profile-stat">
                                        <span className="profile-stat-count">{tweets.length}</span>
                                        <span className="profile-stat-label">Tweets</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-tweets">
                            <h2>My Tweets</h2>

                            {tweets.length === 0 ? (
                                <p style={{ color: '#71767b', padding: 16 }}>No tweets yet</p>
                            ) : (
                                tweets.map((tweet) => (
                                    <PostCard
                                        key={tweet.id}
                                        id={tweet.id}
                                        username={tweet.username}
                                        content={tweet.content}
                                        likesCount={tweet.likesCount}
                                        likedByCurrentUser={tweet.likedByCurrentUser}
                                        currentUserId={currentUser.id}
                                        userId={tweet.userId}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default ProfilePage;