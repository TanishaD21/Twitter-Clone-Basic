import './commentSection.css';

function CommentSection(props){
    return(
        <div className = "comment-section">
            <h2 className = "comment-section-title">Comments</h2>
            <div className = "comment-section-comments">
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
