import Feed from "../components/feed";
import api from "../services/api";

import { useEffect } from 'react';


function Home(props) {
    useEffect(() =>{
        const testbackend = async () => {
            try{
                const response = await api.get("/");
                console.log(response.data);
            }catch(error){
                console.log(error);
            }
        };
        testbackend();
    },[]);

    return (

        <div>

            <Feed posts={props.posts} />

        </div>

    );
}

export default Home;