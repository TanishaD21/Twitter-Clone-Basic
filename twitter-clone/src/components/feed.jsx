import "./feed.css";
import PostCard from "./postCard";

// Component to display the feed of posts
function Feed(props){
    console.log(props.posts);
    return(
        <div className="feed">
            
            {(props.posts || []).map(post => (

                <PostCard
                    key={post.id}
                    username={post.username}
                    content={post.content}
                />

            ))}

        </div>
    );
}

export default Feed;