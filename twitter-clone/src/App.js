import './App.css';
import { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './pages/homePage';
import Post from './pages/postPage';
import Login from './pages/loginPage';
import SignUp from './pages/signUpPage';
import ProfilePage from './pages/profilePage';
import RightSidebar from './components/rightSidebar';

import { getAllTweets,getFollowingTweets, createTweet, deleteTweet } from './services/tweetService';

import ProtectedRoutes from './components/protectedRoutes';


// Main App component that sets up routing and manages posts state
function App() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("forYou");

  useEffect(() => {

      const fetchTweets = async() => {

        try {

          let data;

          if(activeTab === "forYou") {

            data = await getAllTweets();
            setPosts(data.tweets);

          }

          else {

            data = await getFollowingTweets();
            setPosts(data.tweets);

          }

        } catch(error) {
          console.log(error);
        }
      };

      fetchTweets();

  }, [activeTab]);

  const handleNewPost = async(text) => {
    try{
      const response = await createTweet({
        content: text
      });

      console.log(response);

      
      let updatedTweets;

      if(activeTab === "forYou") {
          updatedTweets = await getAllTweets();
          setPosts(updatedTweets.tweets);
      }
      else {
          updatedTweets = await getFollowingTweets();
          setPosts(updatedTweets.tweets);
      }

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
        <div className="layout-container">
        <Navbar />

        <div className="main-content">

          <Routes>

            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Home posts={posts} onDelete={handleDeletePost} activeTab={activeTab} setActiveTab={setActiveTab} />
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
              path="/profile"
              element={
                <ProtectedRoutes>
                  <ProfilePage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/profile/:username"
              element={
                <ProtectedRoutes>
                  <ProfilePage  />
                </ProtectedRoutes>
              }
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

        <RightSidebar/>
        </div>
      </div>

    </BrowserRouter>
  );
}

export default App;