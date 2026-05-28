// import { useEffect, useState } from "react";
// import PostCard from "../components/postCard";


// import { getUserProfile} from "../services/userService";
// import { getMyTweets, deleteTweet } from "../services/tweetService";

// import "./profilePage.css";

// function ProfilePage(){

//     const [profile, setProfile] = useState(null);
//     const [tweets, setTweets] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
    

//     const currentUser = JSON.parse(
//         localStorage.getItem("user") || "{}"
//     );

//     const fetchProfile = async() => {
//         try{
//             setLoading(true);
//             setError("");
//             const profileData = await getUserProfile();
//             setProfile(profileData.user);
//             const tweetData = await getMyTweets();
//             setTweets(tweetData.tweets || []);
//         }
//         catch(error){
//             console.log(error);
//             setError(
//                 error.response?.data?.message ||
//                 "Failed to load profile"
//             );
//         }
//         finally{
//             setLoading(false);
//         }
//     };

    
//     const handleDelete = async(tweetId) => {
//         try{
//             await deleteTweet(tweetId);
//             setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId));
//         }
//         catch(error){
//             console.log(error);
//         }
//     };

//     useEffect(()=>{
//         fetchProfile();
//     },[]);

//     return(
//         <div className="profile-page">

//             <div className="profile-content">

//                 {loading && <p style={{ color: '#71767b', padding: 16 }}>Loading...</p>}
//                 {error && <p style={{ color: '#f4212e', padding: 16 }}>{error}</p>}

//                 {!loading && profile && (
//                     <>
//                         <div className="profile-header">
//                             {/* Banner — placeholder color; swap src when you have a real banner */}
//                             <div className="profile-banner" />

//                             {/* Avatar overlapping the banner */}
//                             <div className="profile-image-wrapper">
//                                 <img
//                                     src={profile.profileImage || "https://via.placeholder.com/120"}
//                                     alt="profile"
//                                     className="profile-image"
//                                 />
//                             </div>

//                             {/* Edit profile button floated top-right of the info area */}
//                             <button className="profile-edit-btn">Edit profile</button>

//                             <div className="profile-info">
//                                 {/* Display name */}
//                                 <h1 className="profile-name">{profile.name}</h1>

//                                 <p className="profile-username">@{profile.username}</p>

//                                 <p className="profile-bio">{profile.bio || "No bio yet"}</p>

//                                 <div className="profile-stats">
//                                     <div className="profile-stat">
//                                         <span className="profile-stat-count">{profile.followersCount}</span>
//                                         <span className="profile-stat-label">Followers</span>
//                                     </div>
//                                     <div className="profile-stat">
//                                         <span className="profile-stat-count">{profile.followingCount}</span>
//                                         <span className="profile-stat-label">Following</span>
//                                     </div>
//                                     <div className="profile-stat">
//                                         <span className="profile-stat-count">{tweets.length}</span>
//                                         <span className="profile-stat-label">Tweets</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="profile-tweets">
//                             <h2>My Tweets</h2>

//                             {tweets.length === 0 ? (
//                                 <p style={{ color: '#71767b', padding: 16 }}>No tweets yet</p>
//                             ) : (
//                                 tweets.map((tweet) => (
//                                     <PostCard
//                                         key={tweet.id}
//                                         id={tweet.id}
//                                         username={tweet.username}
//                                         content={tweet.content}
//                                         likesCount={tweet.likesCount}
//                                         likedByCurrentUser={tweet.likedByCurrentUser}
//                                         commentsCount={tweet.commentsCount}
//                                         createdAt={tweet.createdAt}
//                                         currentUserId={currentUser.id}
//                                         userId={tweet.userId}
//                                         onDelete={handleDelete}
//                                     />
//                                 ))
//                             )}
//                         </div>
//                     </>
//                 )}

//             </div>
//         </div>
//     );
// }

// export default ProfilePage;




import { useEffect, useState } from "react";
import PostCard from "../components/postCard";

import {
    getUserProfile,
    getFollowersForUser,
    getFollowingForUser,
    followUserProfile,
    unfollowUserProfile
} from "../services/userService";

import {
    getMyTweets,
    deleteTweet
} from "../services/tweetService";

import EditProfile from "./editProfile";

import "./profilePage.css";

function ProfilePage(){

    const [profile, setProfile] = useState(null);
    const [tweets, setTweets] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);

    const [activeList, setActiveList] = useState(null);
    const [sideUsers, setSideUsers] = useState([]);
    const [sideLoading, setSideLoading] = useState(false);

    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const fetchProfile = async() => {

        try{

            setLoading(true);
            setError("");

            const profileData = await getUserProfile();

            setProfile(profileData.user);

            setIsFollowing(profileData.user?.isFollowing || false);

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

            setTweets((prev) =>
                prev.filter((tweet) => tweet.id !== tweetId)
            );

        }

        catch(error){
            console.log(error);
        }
    };

    const handleShowFollowers = async() => {

        try{

            if(!profile?.id) return;

            setActiveList("followers");

            setSideLoading(true);

            const response = await getFollowersForUser(profile.id);

            setSideUsers(response.followers || []);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setSideLoading(false);

        }
    };

    const handleShowFollowing = async() => {

        try{

            if(!profile?.id) return;

            setActiveList("following");

            setSideLoading(true);

            const response = await getFollowingForUser(profile.id);

            setSideUsers(response.following || []);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setSideLoading(false);

        }
    };

    const handleFollowToggle = async() => {

        try{

            if(!profile?.id) return;

            setFollowLoading(true);

            if(isFollowing){

                await unfollowUserProfile(profile.id);

                setIsFollowing(false);

                setProfile((prev) => ({
                    ...prev,
                    followersCount: prev.followersCount - 1
                }));

            }

            else{

                await followUserProfile(profile.id);

                setIsFollowing(true);

                setProfile((prev) => ({
                    ...prev,
                    followersCount: prev.followersCount + 1
                }));

            }

        }

        catch(error){

            console.log(error);

        }

        finally{

            setFollowLoading(false);

        }
    };

    useEffect(()=>{

        fetchProfile();

    },[]);

    return(

        <div className="profile-page">

            <div className="profile-content">

                {loading && (
                    <p style={{ color: '#71767b', padding: 16 }}>
                        Loading...
                    </p>
                )}

                {error && (
                    <p style={{ color: '#f4212e', padding: 16 }}>
                        {error}
                    </p>
                )}

                {!loading && profile && (

                    <>

                        <div className="profile-header">

                            <div className="profile-banner" />

                            <div className="profile-image-wrapper">

                                <img
                                    src={
                                        profile.profileImage ||
                                        "https://via.placeholder.com/120"
                                    }
                                    alt="profile"
                                    className="profile-image"
                                />

                            </div>

                            <div className="profile-actions">

                                {currentUser.id === profile.id ? (

                                    <button
                                        className="profile-edit-btn"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit profile
                                    </button>

                                ) : (

                                    <button
                                        className="profile-edit-btn"
                                        onClick={handleFollowToggle}
                                        disabled={followLoading}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>

                                )}

                            </div>

                            <div className="profile-info">

                                <h1 className="profile-name">
                                    {profile.name}
                                </h1>

                                <p className="profile-username">
                                    @{profile.username}
                                </p>

                                <p className="profile-bio">
                                    {profile.bio || "No bio yet"}
                                </p>

                                <div className="profile-stats">

                                    <div
                                        className="profile-stat clickable"
                                        onClick={handleShowFollowers}
                                    >
                                        <span className="profile-stat-count">
                                            {profile.followersCount}
                                        </span>

                                        <span className="profile-stat-label">
                                            Followers
                                        </span>
                                    </div>

                                    <div
                                        className="profile-stat clickable"
                                        onClick={handleShowFollowing}
                                    >
                                        <span className="profile-stat-count">
                                            {profile.followingCount}
                                        </span>

                                        <span className="profile-stat-label">
                                            Following
                                        </span>
                                    </div>

                                    <div className="profile-stat">

                                        <span className="profile-stat-count">
                                            {tweets.length}
                                        </span>

                                        <span className="profile-stat-label">
                                            Tweets
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {isEditing && (

                            <EditProfile
                                user={profile}
                                setProfile={setProfile}
                                onClose={() => setIsEditing(false)}
                            />

                        )}

                        {activeList && (

                            <div className="followers-modal-overlay">

                                <div className="followers-modal">

                                    <div className="followers-modal-header">

                                        <h2>
                                            {activeList === "followers"
                                                ? "Followers"
                                                : "Following"}
                                        </h2>

                                        <button
                                            onClick={() => setActiveList(null)}
                                        >
                                            ✕
                                        </button>

                                    </div>

                                    {sideLoading ? (

                                        <p>Loading...</p>

                                    ) : sideUsers.length === 0 ? (

                                        <p>No users found</p>

                                    ) : (

                                        sideUsers.map((user) => (

                                            <div
                                                key={user.id}
                                                className="side-user-card"
                                            >

                                                <p>{user.name}</p>

                                                <p>@{user.username}</p>

                                            </div>

                                        ))

                                    )}

                                </div>

                            </div>

                        )}

                        <div className="profile-tweets">

                            <h2>My Tweets</h2>

                            {tweets.length === 0 ? (

                                <p style={{ color: '#71767b', padding: 16 }}>
                                    No tweets yet
                                </p>

                            ) : (

                                tweets.map((tweet) => (

                                    <PostCard
                                        key={tweet.id}
                                        id={tweet.id}
                                        username={tweet.username}
                                        content={tweet.content}
                                        likesCount={tweet.likesCount}
                                        likedByCurrentUser={tweet.likedByCurrentUser}
                                        commentsCount={tweet.commentsCount}
                                        createdAt={tweet.createdAt}
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

