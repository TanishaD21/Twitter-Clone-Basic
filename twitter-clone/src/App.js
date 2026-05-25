import './App.css';
import { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './pages/homePage';
import Post from './pages/postPage';
import Login from './pages/loginPage';
import SignUp from './pages/signUpPage';

import { getAllTweets, createTweet } from './services/tweetService';

import ProtectedRoutes from './components/protectedRoutes';


function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchTweets = async() => {
          try{
            const data = await getAllTweets();
            console.log(data);
            setPosts(data.AllTweets);
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

      setPosts(updatedTweets.AllTweets);

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
                  <Home posts={posts} />
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