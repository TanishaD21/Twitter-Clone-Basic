import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import TweetCard from "../components/tweets/TweetCard";
import { getAllTweets,deleteTweet } from "../api/tweetApi";
import TweetCreation from "../components/tweets/TweetCreation";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchUsername,setSearchUsername]=useState("");
    const [error, setError] = useState("");
    const navigate=useNavigate();
    const currentUser=JSON.parse(localStorage.getItem("user") || "{}");
    const fetchTweets = async () => {
        try {
        setLoading(true);
        setError("");

        const response = await getAllTweets();
        setTweets(response.data.AllTweets || []);
        } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load tweets.");
        } finally {
        setLoading(false);
        }
    };
    const handleSearch =(e)=>{
        e.preventDefault();
        const username=searchUsername.trim();
        if(!username)
        {
            return;
        }
        navigate(`/profile/${username}`);
    }
    const handleDelete=async (tweetId)=>{
        setError("");

        try{
            setLoading(true);
            await deleteTweet(tweetId);
            setTweets((prevTweets)=>
                prevTweets.filter((tweet)=> tweet.id !==tweetId)
            )

        }
        catch(error)
        {
            console.log(error);
            setError(error.response?.data?.message || "Cannot delete the tweet");
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchTweets();
    }, []);

    const handleTweetCreated = async () => {
        await fetchTweets();
    };

    return (
        <MainLayout>
        <div className="home-page">
            <div className="home-header">
                <h1>Home</h1>
                <form onSubmit={handleSearch} className="search-form">

                    <input
                        type="text"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        placeholder="Search username"
                    />
                    <button type="submit">
                        Search
                    </button>
                </form>
            </div>

            <TweetCreation onTweetCreated={handleTweetCreated} />

            {loading && <p>Loading tweets...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="tweet-list">
            {tweets.length === 0 && !loading ? (
                <p>No tweets found.</p>
            ) : (
                tweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} userid={currentUser.id} onDelete={handleDelete} onTweetUpdated={fetchTweets}/>
                ))
            )}
            </div>
        </div>
        </MainLayout>
    );
}

export default HomePage;