import { useState } from 'react';

function Post({ posts, onAddPost }) {
  const [text, setText] = useState('');

  const handlePost = () => {
    onAddPost(text);
    setText('');
  };

  return (
    <div className="page">
      <h1 className="page-title">Post</h1>

      <div className="post-box">
        <textarea
          className="post-input"
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
        />

        <button className="post-button" onClick={handlePost}>
          Post
        </button>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p className="page-text">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              {post.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Post;