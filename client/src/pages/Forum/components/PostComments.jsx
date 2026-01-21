import { useEffect, useState, useCallback } from "react";
import { commentService } from "../../../services/forum/commentService";
import CommentItem from "../../../components/Forum/CommentItem";
import CreateComment from "../../../components/Forum/CreateComment";
import { Loader2 } from "lucide-react";

const PostComments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchComments = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const data = await commentService.getComments('post', postId);
            setComments(data);
        } catch (error) {
            console.error("Failed to load comments", error);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId, fetchComments]);

    const handleCreateComment = async (content) => {
        setIsRefreshing(true);
        try {
            await commentService.createPostComment(postId, content);
            // Refetch all comments to ensure we have the latest state including the new one
            await fetchComments(false);
        } catch (error) {
            console.error("Failed to create comment", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleReply = async (parentId, content) => {
        // For replies, we can also refetch or just append if we want to be faster. 
        // User asked specifically for "when comment, press send, it loads and fetches".
        // Applying same logic for consistency.
        setIsRefreshing(true);
        try {
            await commentService.createPostComment(postId, content, parentId);
            await fetchComments(false);
        } catch (error) {
            console.error("Failed to create reply", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Group comments: Root comments vs Replies
    const rootComments = comments.filter(c => !c.parentId);
    const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

    if (isLoading) return <div className="py-4 flex justify-center"><Loader2 className="animate-spin text-gray-400 w-5 h-5" /></div>;

    return (
        <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-4">
                <h4 className="text-sm font-semibold text-gray-700">Bình luận ({comments.length})</h4>
                {isRefreshing && <Loader2 className="animate-spin text-blue-600 w-4 h-4" />}
            </div>

            {/* List */}
            <div className={`space-y-2 transition-opacity ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}>
                {rootComments.map(comment => {
                    const renderCommentWithReplies = (parentComment, depth = 0, rootId = null) => {
                        const replies = getReplies(parentComment._id);
                        const currentRootId = rootId || parentComment._id;
                        return (
                            <div key={parentComment._id}>
                                <CommentItem 
                                    comment={parentComment} 
                                    onReply={handleReply}
                                    rootCommentId={currentRootId}
                                />
                                {/* Render Replies recursively */}
                                {replies.length > 0 && (
                                    <div className="pl-12 border-l-2 border-gray-100 ml-4">
                                        {replies.map(reply => renderCommentWithReplies(reply, depth + 1, currentRootId))}
                                    </div>
                                )}
                            </div>
                        );
                    };
                    
                    return renderCommentWithReplies(comment);
                })}
                {rootComments.length === 0 && (
                    <p className="text-gray-400 text-sm italic">Chưa có bình luận nào.</p>
                )}
            </div>

            {/* Main Create Input */}
            <CreateComment onSubmit={handleCreateComment} placeholder="Thêm bình luận..." />
        </div>
    );
};

export default PostComments;
