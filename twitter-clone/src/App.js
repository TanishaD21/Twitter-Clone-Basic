import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Post from './components/Post';

function App() {
  const [posts, setPosts] = useState([]);

  const addPost = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newPost = {
      id: Date.now(),
      text: trimmed,
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<Post posts={posts} onAddPost={addPost} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;