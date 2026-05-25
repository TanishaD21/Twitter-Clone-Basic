import { useState } from "react";
import { createTweet } from "../../api/tweetApi";

function TweetComposer({ onTweetCreated }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!content.trim()) {
        setError("Tweet content is required.");
        return;
        }

        try {
        setLoading(true);
        const response = await createTweet(content);

        setContent("");

        if (onTweetCreated) {
            onTweetCreated(response.data.tweet);
        }
        } catch (err) {
        setError(err.response?.data?.message || "Failed to create tweet.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="tweet-composer">
        <form onSubmit={handleSubmit}>
            <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            rows="4"
            />

            {error && <p className="error-text">{error}</p>}

            <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Tweet"}
            </button>
        </form>
        </div>
    );
}

export default TweetComposer;