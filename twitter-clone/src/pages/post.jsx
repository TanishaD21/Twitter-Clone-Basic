import CreatePost from "../components/createPost";

// Component for the post creation page that includes the CreatePost component
function Post(props) {

    return (
        <div>
            <CreatePost addPost={props.addPost} />
        </div>
    );
}

export default Post;
