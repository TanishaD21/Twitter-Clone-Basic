import CreatePost from "../components/createPost";
import { useNavigate } from 'react-router-dom';
import './postPage.css';

function Post(props) {
    const navigate = useNavigate();

    return (
        <div className="post-page">
            <div className="post-page-content">
                {/* Sticky header with back button */}
                <div className="post-page-header">
                    <button className="post-page-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                    </button>
                    <h2>New Post</h2>
                </div>

                <CreatePost addPost={props.addPost} />
            </div>
        </div>
    );
}

export default Post;