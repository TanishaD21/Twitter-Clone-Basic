import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './rightSidebar.css'

function RightSidebar() {

    const navigate = useNavigate();

    const [searchUsername, setSearchUsername] = useState("");

    const handleSearch = (e) => {

        e.preventDefault();

        const username = searchUsername.trim();

        if(!username) return;

        navigate(`/profile/${username}`);
    };

    return (
        <div className="right-sidebar">

            <form
                onSubmit={handleSearch}
                className="search-form"
            >

                <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) =>
                        setSearchUsername(e.target.value)
                    }
                    placeholder="Search username"
                />

            </form>

        </div>
    );
}

export default RightSidebar;