import "./feed.css";
import PostCard from "./postCard";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function Feed(props){
    console.log(props.posts);
    const { user } = useContext(AuthContext);
    return(
        <div className="feed">
            {/* Sticky header */}
            <div className="feed-header">
                <h2>Home</h2>
            </div>

            {/* For you / Following tab bar */}
            <div className="feed-tab-bar">
                <button
                    className={`feed-tab ${props.activeTab === "forYou" ? "active" : ""}`}
                    onClick={() => props.setActiveTab("forYou")}
                >
                    For you
                </button>

                <button
                    className={`feed-tab ${props.activeTab === "following" ? "active" : ""}`}
                    onClick={() => props.setActiveTab("following")}
                >
                    Following
                </button>
            </div>

            {(props.posts || []).map(post => (
                <PostCard
                    key={post.id}
                    id={post.id}
                    userId={post.userId}
                    username={post.username}
                    content={post.content}
                    createdAt={post.createdAt}
                    likesCount={post.likesCount}
                    likedByCurrentUser={post.likedByCurrentUser}
                    commentsCount={post.commentsCount}
                    onDelete={props.onDelete}
                    currentUserId={user.id}
                />
            ))}
        </div>
    );
}

export default Feed;