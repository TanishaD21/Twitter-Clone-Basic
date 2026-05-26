import "./feed.css";
import PostCard from "./postCard";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

// Component to display the feed of posts
function Feed(props){
    console.log(props.posts);
    const { user } = useContext(AuthContext);
    return(
        <div className="feed">
            
            {(props.posts || []).map(post => (

                <PostCard
                    key={post.id}
                    id={post.id}
                    userId={post.userId}
                    username={post.username}
                    content={post.content}
                    likesCount={post.likesCount}
                    likedByCurrentUser={post.likedByCurrentUser}
                    onDelete={props.onDelete}
                    currentUserId = {user.id}
                />

            ))}

        </div>
    );
}

export default Feed;