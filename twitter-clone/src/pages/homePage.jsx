import Feed from "../components/feed";
import api from "../services/api";

import { useEffect } from 'react';


import './homePage.css';

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

        <div className="home-page">
            <div className="home-content">
                <Feed posts={props.posts} onDelete={props.onDelete} activeTab={props.activeTab} setActiveTab={props.setActiveTab}/>
            </div>
        </div>

    );
}

export default Home;