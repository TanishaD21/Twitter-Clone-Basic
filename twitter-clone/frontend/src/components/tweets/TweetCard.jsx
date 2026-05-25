function TweetCard({ tweet }) {
  return (
    <div className="tweet-card">
      <div className="tweet-card-header">
        <div>
          <h4>Name: {tweet.name || "Unknown User"}</h4>
          <p><b>Username: </b>@{tweet.username || "user"}</p>
        </div>
      </div>

      <p className="tweet-content"><b>Content:</b> {tweet.content}</p>

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