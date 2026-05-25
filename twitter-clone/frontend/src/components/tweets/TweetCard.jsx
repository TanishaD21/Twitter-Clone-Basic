function TweetCard({ tweet }) {
  return (
    <div className="tweet-card">
      <div className="tweet-card-header">
        <div>
          <h4>{tweet.name || "Unknown User"}</h4>
          <p>@{tweet.username || "user"}</p>
        </div>
      </div>

      <p className="tweet-content">{tweet.content}</p>

      <div className="tweet-meta">
        <span>
          {tweet.createdAt
            ? new Date(tweet.createdAt).toLocaleString()
            : ""}
        </span>
        <span>{tweet.likesCount || 0} likes</span>
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