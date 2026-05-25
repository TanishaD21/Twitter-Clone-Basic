import './createPost.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePost(props){
    const [text, setText] = useState('');
    const navigate = useNavigate();

    const handlePost = () => {

        if (text.trim() === '') return;

        props.addPost(text);
        navigate('/');

        setText('');
    };

    return (
    <div className = "create-post">

      <h1>Create Post</h1>

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
