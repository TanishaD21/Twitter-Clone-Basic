function Home() {
  return (
    <div className="page">
      <h1 className="page-title">Home</h1>
      <p className="page-text">Welcome to the home page.</p>

      <div className="static-card">
        <h3>Trending now</h3>
        <p>This is static content for your home page.</p>
      </div>

      <div className="static-card">
        <h3>Latest update</h3>
        <p>Your posts will appear on the Post page.</p>
      </div>
    </div>
  );
}

export default Home;