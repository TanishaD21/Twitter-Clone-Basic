import './postCard.css';
import CommentSection from './commentSection';
import { useState } from 'react';
import { likeTweet, unlikeTweet, addComment, getComments, deleteComments, updateComments } from '../services/tweetService';
import { formatTime } from '../utils/formatTime';

function PostCard(props){
    const [likes, setLikes] = useState(props.likesCount || 0);
    const [liked, setLiked] = useState(props.likedByCurrentUser);
    const [commentsCount, setCommentsCount] = useState(props.commentsCount || 0);
    const [comments, setComments] = useState([]);
    const [retweets, setRetweets] = useState(0);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleLike = async() => {
        try{
            if(liked){
                await unlikeTweet(props.id);
                setLiked(false);
                setLikes((prev) => Math.max(0, prev - 1));
            }else{
                await likeTweet(props.id);
                setLiked(true);
                setLikes((prev) => prev + 1);
            }
        }catch(error){
            console.log(error);
        }
    };

    const handleRetweet = () => {
        setRetweets(retweets + 1);
    };

    const handleFetchComment = async() => {
        try{
            const data = await getComments(props.id);
            setComments(data.comments || []);
        }catch(error){
            console.log(error);
        }
    };

    const handleSubmitComment = async() => {
        if(commentText.trim() === "") return;
        try{
            await addComment(props.id, commentText);
            setCommentsCount(prev =>  prev + 1 );
            await handleFetchComment();
            setCommentText("");
            
        }catch(error){
            console.log(error);
        }
    };

    const handleDeleteComment = async(commentId) => {
        try{
            await deleteComments(props.id, commentId);
            await handleFetchComment();
        }catch(error){
            console.log(error);
        }
    };

    const handleUpdateComment = async(commentId, updatedContent) => {
        try{
            await updateComments(props.id, commentId, updatedContent);
            await handleFetchComment();
        }catch(error){
            console.log(error);
        }
    };

    return(
        <div className="post-card">
            {/* Avatar circle using first letter of username */}
            <div
                className="post-card-avatar"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff', background: '#1d9bf0', flexShrink: 0 }}
            >
                {props.username?.[0]?.toUpperCase() || 'U'}
            </div>

            <div className="post-card-body">
                {/* Meta: name · handle · time */}
                <div className="post-card-meta">
                    <h3>{props.username}</h3>
                    <span className="post-card-handle">@{props.username?.toLowerCase().replace(/\s+/g, '')}</span>
                    <span className="post-card-dot">·</span>
                    <span className="post-card-time">{formatTime(props.createdAt)}</span>
                </div>

                <p>{props.content}</p>

                {/* Stats row */}
                <div className="post-card-stats">
                    <span>{likes} likes · {commentsCount} comments · {retweets} retweets</span>
                </div>

                {/* Action buttons */}
                <div className="post-card-actions">
                    {/* Comment */}
                    <button
                        className="post-card-button"
                        onClick={async() => {
                            const nextState = !showCommentBox;
                            setShowCommentBox(nextState);
                            if(nextState){ await handleFetchComment(); }
                        }}
                        title="Comment"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span>{commentsCount}</span>
                    </button>

                    {/* Retweet */}
                    <button className="post-card-button repost-btn" onClick={handleRetweet} title="Retweet">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                        {retweets > 0 && <span>{retweets}</span>}
                    </button>

                    {/* Like */}
                    <button className="post-card-button like-btn" onClick={handleLike} title={liked ? "Unlike" : "Like"}>
                        <svg viewBox="0 0 24 24" fill={liked ? "#f91880" : "none"} stroke={liked ? "#f91880" : "currentColor"} strokeWidth="2" width="18" height="18"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        {likes > 0 && <span style={{ color: liked ? '#f91880' : undefined }}>{likes}</span>}
                    </button>

                    {/* Share */}
                    <button className="post-card-button" title="Share">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </div>

                {/* Comment input box */}
                {showCommentBox && (
                    <>
                        <div className="comment-box" style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #2f3336' }}>
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                style={{ flex: 1, background: 'transparent', border: '1px solid #333639', borderRadius: 4, padding: '10px 12px', color: '#e7e9ea', fontSize: 15, outline: 'none' }}
                                onFocus={e => e.target.style.borderColor = '#1d9bf0'}
                                onBlur={e => e.target.style.borderColor = '#333639'}
                            />
                            <button
                                onClick={handleSubmitComment}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '9999px', background: '#1d9bf0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                            >
                                Reply
                            </button>
                        </div>

                        <CommentSection
                            comments={comments}
                            currentUserId={props.currentUserId}
                            onDeleteComment={handleDeleteComment}
                            onUpdateComment={handleUpdateComment}
                        />
                    </>
                )}

                {/* Delete post — only for post owner */}
                {props.currentUserId === props.userId && (
                    <button
                        onClick={() => props.onDelete(props.id)}
                        style={{ marginTop: 10, background: 'none', border: 'none', color: '#71767b', fontSize: 13, cursor: 'pointer', padding: '4px 0' }}
                    >
                        Delete post
                    </button>
                )}
            </div>
        </div>
    );
}

export default PostCard;