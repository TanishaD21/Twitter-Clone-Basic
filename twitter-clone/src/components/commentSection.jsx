import './commentSection.css';
import { useState } from 'react';

function CommentSection(props){

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedText, setEditedText] = useState("");

    return(
        <div className="comment-section">
            <h2 className="comment-section-title">Comments</h2>
            <div className="comment-section-comments">
                {(props.comments || []).length === 0 ? (
                    <p style={{ color: '#71767b', fontSize: 15, padding: '12px 16px' }}>No comments yet</p>
                ) : (
                    (props.comments || []).map((comment) => (
                        <div className="comment-section-comment" key={comment.id}>
                            <div
                                style={{ width: 32, height: 32, borderRadius: '50%', background: '#794bc4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}
                            >
                                {comment.username?.[0]?.toUpperCase() || 'U'}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <strong>@{comment.username}</strong>

                                {editingCommentId === comment.id ? (
                                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                        <input
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                            style={{ flex: 1, background: 'transparent', border: '1px solid #333639', borderRadius: 4, padding: '8px 12px', color: '#e7e9ea', fontSize: 14, outline: 'none' }}
                                        />
                                        <button
                                            onClick={async() => {
                                                await props.onUpdateComment(comment.id, editedText);
                                                setEditedText("");
                                                setEditingCommentId(null);
                                            }}
                                            style={{ padding: '6px 14px', border: 'none', borderRadius: '9999px', background: '#1d9bf0', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <p>{comment.content}</p>
                                )}

                                {props.currentUserId === comment.userId && (
                                    <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                                        <button
                                            onClick={() => {
                                                setEditingCommentId(comment.id);
                                                setEditedText(comment.content);
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#1d9bf0', fontSize: 13, cursor: 'pointer', padding: 0 }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => props.onDeleteComment(comment.id)}
                                            style={{ background: 'none', border: 'none', color: '#71767b', fontSize: 13, cursor: 'pointer', padding: 0 }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;