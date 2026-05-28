import { useState, useEffect, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProfileCard from "../components/profile/ProfileCard";
import {getOtherProfile,getUserProfile,followUserProfile,unfollowUserProfile,getFollowersForUser,getFollowingForUser} from "../api/userApi";
import { getMyTweets, deleteTweet, getTweetsByUsername } from "../api/tweetApi";
import TweetCard from "../components/tweets/TweetCard";
import { useParams } from "react-router-dom";
import EditProfilePage from "./EditProfilePage";
import "./ProfilePages.css";

function ProfilePages() {
    const [profiles, setProfiles] = useState(null);
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [activeList, setActiveList] = useState(null);
    const [sideUsers, setSideUsers] = useState([]);
    const [sideLoading, setSideLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user") || "{}")
    );

    const { username } = useParams();

    const uniqueById = (arr) => {
        return [...new Map(arr.map((u) => [u.id, u])).values()];
    };

    const handleShowFollowers = async () => {
        try {
        if (!profiles?.id) return;

        setActiveList("followers");
        setSideLoading(true);
        setError("");

        const response = await getFollowersForUser(profiles.id);

        const normalizedFollowers = (response.data.followers || []).map((u) => ({
            id: u.id || u.userId,
            username: u.username,
            name: u.name,
        }));

        setSideUsers(uniqueById(normalizedFollowers));
        } catch (error) {
        console.log(error);
        setError(
            error.response?.data?.message || "Cannot fetch the followers profiles"
        );
        } finally {
        setSideLoading(false);
        }
    };

    const handleShowFollowing = async () => {
        try {
        if (!profiles?.id) return;

        setActiveList("following");
        setSideLoading(true);
        setError("");

        const response = await getFollowingForUser(profiles.id);

        const normalizedFollowing = (response.data.following || []).map((u) => ({
            id: u.id || u.userId,
            username: u.username,
            name: u.name,
        }));

        setSideUsers(uniqueById(normalizedFollowing));
        } catch (error) {
        console.log(error);
        setError(
            error.response?.data?.message || "Cannot fetch the followings profiles"
        );
        } finally {
        setSideLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        try {
        if (!profiles?.id) return;

        setFollowLoading(true);
        setError("");

        if (isFollowing) {
            await unfollowUserProfile(profiles.id);
            setIsFollowing(false);
            setProfiles((prev) => ({
            ...prev,
            followersCount: Number(prev.followersCount) - 1,
            }));
        } else {
            await followUserProfile(profiles.id);
            setIsFollowing(true);
            setProfiles((prev) => ({
            ...prev,
            followersCount: Number(prev.followersCount) + 1,
            }));
        }

        if (activeList === "followers") {
            await handleShowFollowers();
        }
        } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Failed to update follow status");
        } finally {
        setFollowLoading(false);
        }
    };

    const handleDelete = async (tweetId) => {
        setError("");
        try {
        setLoading(true);
        await deleteTweet(tweetId);
        setTweets((prevTweets) => prevTweets.filter((tweet) => tweet.id !== tweetId));
        } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Cannot delete the tweet");
        } finally {
        setLoading(false);
        }
    };

    const fetchProfile = useCallback(async () => {
        try {
        setLoading(true);
        setError("");
        setActiveList(null);
        setSideUsers([]);

        let response, profileUser;

        if (username) {
            response = await getOtherProfile(username);
            profileUser = response.data.profile || null;
        } else {
            response = await getUserProfile();
            profileUser = response.data.user || null;
        }

        setProfiles(profileUser);
        setIsFollowing(profileUser?.isFollowing || false);

        if (!profileUser?.id) {
            setTweets([]);
            setIsFollowing(false);
            return;
        }

        let tweetsResponse;
        if (username) {
            tweetsResponse = await getTweetsByUsername(username);
        } else {
            tweetsResponse = await getMyTweets();
        }

        setTweets(tweetsResponse.data.tweets || []);
        } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Failed to fetch profiles");
        setProfiles(null);
        setTweets([]);
        } finally {
        setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <MainLayout>
        <div className="profilepage">
            <h1>Profile Page</h1>

            {loading && <p>Loading profiles..</p>}
            {error && <p>{error}</p>}

            <div className="profile-list">
            {!loading && profiles ? (
                <div className="profile-layout">
                <div className="profile-left">
                    {user?.id === profiles?.id && (
                    <button onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                    )}

                    <ProfileCard
                    user={profiles}
                    handleShowFollowers={handleShowFollowers}
                    handleShowFollowing={handleShowFollowing}
                    />

                    {isEditing && (
                    <EditProfilePage
                        user={profiles}
                        setUser={setUser}
                        setProfiles={setProfiles}
                        refreshProfile={fetchProfile}
                        onClose={() => setIsEditing(false)}
                    />
                    )}

                    {profiles.id && user.id !== profiles.id && (
                    <button onClick={handleFollowToggle} disabled={followLoading}>
                        {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                    )}

                    <h2>{username ? `${username} Tweets` : "My Tweets"}</h2>

                    {tweets.length === 0 ? (
                    <p>No tweets found</p>
                    ) : (
                    tweets.map((tweet) => (
                        <TweetCard
                        key={tweet.id}
                        tweet={tweet}
                        userid={user.id}
                        onDelete={handleDelete}
                        onTweetUpdated={fetchProfile}
                        />
                    ))
                    )}
                </div>

                <div className="profile-right">
                    <h3>
                    {activeList === "followers"
                        ? "Followers"
                        : activeList === "following"
                        ? "Following"
                        : "User Info"}
                    </h3>

                    {sideLoading ? (
                    <p>Loading...</p>
                    ) : activeList ? (
                    sideUsers.length === 0 ? (
                        <p>No users found</p>
                    ) : (
                        sideUsers.map((u) => (
                        <div key={u.id} className="side-user-card">
                            <p>{u.name}</p>
                            <p>@{u.username}</p>
                        </div>
                        ))
                    )
                    ) : (
                    <p>Click followers or following to view users</p>
                    )}
                </div>
                </div>
            ) : (
                !loading && <p>Profile not found</p>
            )}
            </div>
        </div>
        </MainLayout>
    );
}

export default ProfilePages;