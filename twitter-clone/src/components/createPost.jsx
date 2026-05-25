import './createPost.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Component for creating a new post
function CreatePost(props){
    const [text, setText] = useState('');
    const navigate = useNavigate();

    // Function to handle posting the new content
    const handlePost = () => {

        if (text.trim() === '') return;// Prevent posting empty content

        props.addPost(text);
        navigate('/');// Redirect to home page after posting

        setText('');// Clear the input field after posting
    };

    return (
    <div className = "create-post">

      <h1>Create Post</h1>
      {/* Textarea for entering the post content */}
      <textarea
        className="post-input"
        placeholder="What's happening?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="40"
      />

      <br />

      <button className = "post-btn" onClick={handlePost}>
        Post
      </button>

    </div>
  );
}

export default CreatePost;
