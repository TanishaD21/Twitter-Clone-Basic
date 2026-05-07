import "./feed.css";
import PostCard from "./postCard";

// Component to display the feed of posts
function Feed(props){

    return(
        <div className="feed">
            {/* Map through the posts passed as props and display each post using the PostCard component */}
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