import React, { useState, useEffect } from "react";
import { interactionService } from "../../services/interaction.service.js";
import { MessageSquare, Trash2, Reply, Pencil, ChevronDown, ChevronUp } from "lucide-react";

const CommentSection = ({ videoId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [showReplies, setShowReplies] = useState({});

    /** * 1. IDENTIFY THE CURRENT USER
     * We check multiple paths in case your auth-service wraps the user data
     */
    const userJson = localStorage.getItem("user");
    const currentUser = userJson ? JSON.parse(userJson) : null;
    const currentUserId = currentUser?._id || currentUser?.id || currentUser?.data?._id || currentUser?.user?._id;

    const loadComments = async () => {
        try {
            const res = await interactionService.getVideoComments(videoId);
            const data = res.data || res;
            setComments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error loading comments:", err);
        }
    };

    useEffect(() => { loadComments(); }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await interactionService.postComment({ videoId, content: newComment });
            setNewComment("");
            loadComments();
        } catch (err) { alert("Action failed. Are you logged in?"); }
    };

    const handleReply = async (parentId) => {
        if (!replyContent.trim()) return;
        try {
            await interactionService.postComment({ videoId, content: replyContent, parentId });
            setReplyContent("");
            setReplyingTo(null);
            setShowReplies(prev => ({ ...prev, [parentId]: true }));
            loadComments();
        } catch (err) { alert("Error posting reply"); }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm("Delete this comment and its replies?")) {
            await interactionService.deleteComment(commentId);
            loadComments();
        }
    };

    const toggleReplies = (id) => {
        setShowReplies(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Filter logic
    const rootComments = comments.filter(c => !c.parentId);
    const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

    return (
        <div className="mt-10 max-w-4xl">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-white">
                <MessageSquare size={20} className="text-primary" /> {comments.length} Comments
            </h3>

            {/* Main Comment Input */}
            <form onSubmit={handleSubmit} className="flex gap-4 mb-10">
                <input 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a public comment..." 
                    className="input-field bg-zinc-900/50" 
                />
                <button type="submit" className="btn-next h-10 px-6">Comment</button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {rootComments.map((comment) => {
                    const replies = getReplies(comment._id);
                    
                    /** * 2. CHECK OWNERSHIP FOR ROOT COMMENT
                     * String conversion ensures matching even if one is a MongoDB ObjectId object
                     */
                    const isOwner = currentUserId && comment.userId && String(comment.userId) === String(currentUserId);

                    return (
                        <div key={comment._id} className="group animate-in fade-in duration-500">
                            <div className="flex gap-4 p-2 rounded-xl">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${comment.username}&background=random&color=fff`} 
                                    className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0" 
                                    alt="avatar" 
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-white">@{comment.username}</span>
                                            <span className="text-[10px] text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        {/* 3. CONDITIONAL BUTTONS FOR OWNER */}
                                        {isOwner && (
                                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="text-zinc-500 hover:text-blue-400">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(comment._id)} className="text-zinc-500 hover:text-red-500">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{comment.content}</p>
                                    
                                    <div className="flex items-center gap-4 mt-2">
                                        <button 
                                            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                            className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white flex items-center gap-1"
                                        >
                                            <Reply size={12} /> {replyingTo === comment._id ? "Cancel" : "Reply"}
                                        </button>

                                        {replies.length > 0 && (
                                            <button 
                                                onClick={() => toggleReplies(comment._id)}
                                                className="text-[10px] uppercase font-bold text-primary flex items-center gap-1"
                                            >
                                                {showReplies[comment._id] ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                                {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Reply Input */}
                                    {replyingTo === comment._id && (
                                        <div className="mt-4 flex gap-2">
                                            <input 
                                                autoFocus
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Add a reply..."
                                                className="flex-1 bg-transparent border-b border-zinc-700 outline-none p-1 text-sm text-white focus:border-primary"
                                            />
                                            <button onClick={() => handleReply(comment._id)} className="text-xs text-primary font-bold uppercase hover:text-white">Post</button>
                                        </div>
                                    )}

                                    {/* Render Nested Replies */}
                                    {showReplies[comment._id] && replies.length > 0 && (
                                        <div className="mt-4 space-y-4 border-l-2 border-zinc-800 pl-6">
                                            {replies.map((reply) => {
                                                // 4. CHECK OWNERSHIP FOR REPLIES
                                                const isReplyOwner = currentUserId && reply.userId && String(reply.userId) === String(currentUserId);
                                                
                                                return (
                                                    <div key={reply._id} className="flex gap-3 items-start group/reply">
                                                        <img 
                                                            src={`https://ui-avatars.com/api/?name=${reply.username}&background=333&color=fff`} 
                                                            className="w-7 h-7 rounded-full flex-shrink-0" 
                                                            alt="avatar" 
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-semibold text-zinc-200">@{reply.username}</span>
                                                                    <span className="text-[9px] text-zinc-600">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                                
                                                                {/* 5. CONDITIONAL DELETE FOR REPLY OWNER */}
                                                                {isReplyOwner && (
                                                                    <button onClick={() => handleDelete(reply._id)} className="opacity-0 group-hover/reply:opacity-100 text-zinc-600 hover:text-red-500">
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-zinc-400 text-xs mt-1">{reply.content}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CommentSection;