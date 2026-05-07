import './App.css';
import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './pages/home';
import Post from './pages/post';

// Main App component that sets up routing and manages posts state
function App() {
  const [posts, setPosts] = useState([
    { id: 1, username: "user1", content: "This is the first post!" },
    { id: 2, username: "user2", content: "This is the second post!" },
    { id: 3, username: "user3", content: "This is the third post!" }
  ]);

  // Function to handle adding a new post to the state
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

    </BrowserRouter>
  );
}

export default App;