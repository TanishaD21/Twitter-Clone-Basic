import CreatePost from "../components/createPost";

function Post(props) {

    return (
        <div>
            <CreatePost addPost={props.addPost} />
        </div>
    );
}

export default Post;
