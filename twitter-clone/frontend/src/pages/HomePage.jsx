import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import TweetCard from "../components/tweets/TweetCard";
import TweetComposer from "../components/tweets/TweetComposer";
import { getAllTweets } from "../api/tweetApi";

function HomePage() {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTweets = async () => {
        try {
        setLoading(true);
        setError("");

        const response = await getAllTweets();
        setTweets(response.data.AllTweets || response.data.allTweets || response.data.tweets || []);
        } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load tweets.");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, []);

    const handleTweetCreated = () => {
        fetchTweets(); // easiest way: refresh feed after posting
    };

    return (
        <MainLayout>
        <div className="home-page">
            <h1>Home</h1>

            <TweetComposer onTweetCreated={handleTweetCreated} />

            {loading && <p>Loading tweets...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="tweet-list">
            {tweets.length === 0 && !loading ? (
                <p>No tweets found.</p>
            ) : (
                tweets.map((tweet) => (
                <TweetCard key={tweet.tweetId || tweet.id} tweet={tweet} />
                ))
            )}
            </div>
        </div>
        </MainLayout>
    );
}

export default HomePage;