import './App.css';
import { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './pages/homePage';
import Post from './pages/postPage';
import Login from './pages/loginPage';
import SignUp from './pages/signUpPage';

import { getAllTweets, createTweet, deleteTweet } from './services/tweetService';

import ProtectedRoutes from './components/protectedRoutes';


// Main App component that sets up routing and manages posts state
function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchTweets = async() => {
          try{
            const data = await getAllTweets();
            console.log(data);
            setPosts(data.tweets);
          }catch(error){
            console.log(error)
          }
    };

    fetchTweets();

  },[]);

  const handleNewPost = async(text) => {
    try{
      const response = await createTweet({
        content: text
      });

      console.log(response);

      
      const updatedTweets = await getAllTweets();

      setPosts(updatedTweets.tweets);

    }catch(error){
      console.log(error);
    }
  };

  const handleDeletePost = async(tweetId) => {
    try{
      await deleteTweet(tweetId);
      setPosts((prevPosts) => 
        prevPosts.filter(
          (post) => post.id !== tweetId
        )
      );

    }catch(error){
      console.log(error);
    }
  };

  return (
    <BrowserRouter>

      <div className="App">

        <Navbar />

        <div className="main-content">

          <Routes>

            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Home posts={posts} onDelete={handleDeletePost} />
                </ProtectedRoutes>}
            />

            <Route
              path="/post"
              element={
                <ProtectedRoutes>
                  <Post addPost={handleNewPost} />
                </ProtectedRoutes>}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path ='/signup'
              element={<SignUp />}
            />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;