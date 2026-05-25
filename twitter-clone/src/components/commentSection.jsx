import './commentSection.css';
// Component to display the comment section of a post
function CommentSection(props){
    return(
        <div className = "comment-section">
            <h2 className = "comment-section-title">Comments</h2>
            <div className = "comment-section-comments">
                {/* Map through the comments passed as props and display each comment */}
                {(props.comments||[]).map((comment, index) =>(
                    <p className="comment-section-comment" key={index}>
                        {comment}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default CommentSection;
