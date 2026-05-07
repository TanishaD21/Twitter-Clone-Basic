import "./feed.css";
import PostCard from "./postCard";

function Feed(props){

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