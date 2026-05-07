import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
<<<<<<< HEAD
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
=======
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './pages/home';
import Post from './pages/post';

function App() {
  const [posts, setPosts] = useState([
    { id: 1, username: "user1", content: "This is the first post!" },
    { id: 2, username: "user2", content: "This is the second post!" },
    { id: 3, username: "user3", content: "This is the third post!" }
  ]);
>>>>>>> main

  const handleNewPost = (text) => {

    const newPost = {
      id: Date.now(),
      username: "You",
      content: text
    };

    setPosts([newPost, ...posts]);
  };
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <div className="app-container">
        <Sidebar />

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<Post posts={posts} onAddPost={addPost} />} />
          </Routes>
        </main>
      </div>
=======

      <div className="App">

        <Navbar />

        <div className="main-content">

          <Routes>

            <Route
              path="/"
              element={<Home posts={posts} />}
            />

            <Route
              path="/post"
              element={<Post addPost={handleNewPost} />}
            />

          </Routes>

        </div>

      </div>

>>>>>>> main
    </BrowserRouter>
  );
}

export default App;