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
        <div className="create-post">
            <h1>Create Post</h1>
            <textarea
                className="post-input"
                placeholder="What's happening?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="4"
                cols="40"
            />
            {/* Toolbar wraps the Post button, matching the CSS flex toolbar layout */}
            <div className="create-post-toolbar">
                <div style={{ display: 'flex', gap: 4 }}>
                    {/* Image icon */}
                    <button style={{ background: 'none', border: 'none', color: '#1d9bf0', cursor: 'pointer', padding: 6, borderRadius: '9999px', display: 'flex', alignItems: 'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </button>
                    {/* Emoji icon */}
                    <button style={{ background: 'none', border: 'none', color: '#1d9bf0', cursor: 'pointer', padding: 6, borderRadius: '9999px', display: 'flex', alignItems: 'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </button>
                </div>
                <button className="post-btn" onClick={handlePost}>
                    Post
                </button>
            </div>
        </div>
    );
}

export default CreatePost;