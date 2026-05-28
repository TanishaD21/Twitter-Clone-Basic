import { useState } from "react";
import { updateTweet } from "../../api/tweetApi";
// import "./TweetCard.css";

function TweetCard({ tweet,userid,onDelete,onTweetUpdated }) {
  const [isEditing,setIsEditing]=useState(false);
  const [editedContent,setEditedContent]=useState(tweet.content || "");
  const[loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const isOwner = Number(userid) === Number(tweet?.userId);
  const handleDelete=()=>{
    onDelete(tweet.id);
  }
  const handleUpdateClick=()=>{
    setIsEditing(true);
    setEditedContent(tweet.content || "");
    setError("");

  }
  const handleCancel=()=>{
    setIsEditing(false);
    setEditedContent(tweet.content || "");
    setError("");
  }
  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      if (!editedContent.trim()) {
        setError("Content cannot be empty");
        return;
      }

      await updateTweet(tweet.id, editedContent.trim());

      setIsEditing(false);

      if (onTweetUpdated) {
        onTweetUpdated();
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Content cannot be updated");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="tweet-card">
      {isOwner && !isEditing && (
        <div className="tweet-actions">
          <button onClick={handleUpdateClick}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      <div className="tweet-card-header">
        <div>
          <h4>Name: {tweet.name || "Unknown User"}</h4>
          <p><b>Username: </b>@{tweet.username || "user"}</p>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-box">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="4"
          />
          {error && <p className="error-text">{error}</p>}
          <div className="edit-buttons">
            <button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="tweet-content">
          <b>Content:</b> {tweet.content}
        </p>
      )}
      
      <div className="tweet-meta">
        <span><b>Date:</b>
          {tweet.createdAt
            ? new Date(tweet.createdAt).toLocaleString()
            : ""}
        </span>
        &nbsp;<span>Likes: {tweet.likesCount || 0} likes</span>
      </div>

      {tweet.likes && tweet.likes.length > 0 && (
        <div className="tweet-likes">
          <strong>Likes:</strong>
          <ul>
            {tweet.likes.map((like) => (
              <li key={like.likeId}>
                {like.name} (@{like.username})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TweetCard;