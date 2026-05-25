import Feed from "../components/feed";

// Component for the home page that displays the feed of posts
function Home(props) {
    return (
        <div>
            <Feed posts={props.posts} />
        </div>
    );
}

export default Home;