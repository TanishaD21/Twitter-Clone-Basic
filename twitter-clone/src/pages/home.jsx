import Feed from "../components/feed";

function Home(props) {

    return (

        <div>

            <Feed posts={props.posts} />

        </div>

    );
}

export default Home;