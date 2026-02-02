import { useEffect, useState } from "react";
import { commentService } from "../../services/forum/commentService";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const CommentList = ({ targetType, targetId, onLoginRequired }) => {
    const { user: currentUser } = useAuth();
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const data = await commentService.getComments(targetType, targetId);
                setComments(data);
            } catch (error) {
                console.error("Failed to load comments", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (targetId) {
            fetchComments();
        }
    }, [targetId, targetType]);

    const handleCreateComment = async (content) => {
        if (!currentUser) {
            onLoginRequired?.();
            return;
        }
        
        // Create root comment
        let result;
        if (targetType === 'post') {
            result = await commentService.createPostComment(targetId, content);
        } else {
            result = await commentService.createAnswerComment(targetId, content);
        }

        if (result && result.data) {
            // Add new comment to list. Usually append to end.
            setComments([...comments, result.data]);
        }
    };

    const handleReply = async (parentId, content) => {
        if (!currentUser) {
            onLoginRequired?.();
            return;
        }
        
        let result;
        if (targetType === 'post') {
            result = await commentService.createPostComment(targetId, content, parentId);
        } else {
            result = await commentService.createAnswerComment(targetId, content, parentId);
        }

        if (result && result.data) {
            setComments([...comments, result.data]);
        }
    };

    // Group comments: Root comments vs Replies
    const rootComments = comments.filter(c => !c.parentId);
    const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

    if (isLoading) return <div className="py-4 flex justify-center"><Loader2 className="animate-spin text-gray-400 w-5 h-5" /></div>;

    return (
        <div className="mt-6 border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Bình luận ({comments.length})</h4>

            {/* List */}
            <div className="space-y-2">
                {rootComments.map(comment => (
                    <div key={comment._id}>
                        <CommentItem comment={comment} onReply={handleReply} />
                        {/* Render Replies */}
                        <div className="pl-12 border-l-2 border-gray-100 ml-4">
                            {getReplies(comment._id).map(reply => (
                                <CommentItem key={reply._id} comment={reply} onReply={handleReply} />
                            ))}
                        </div>
                    </div>
                ))}
                {rootComments.length === 0 && (
                    <p className="text-gray-400 text-sm italic">Chưa có bình luận nào.</p>
                )}
            </div>

            {/* Main Create Input */}
            <CreateComment 
                onSubmit={handleCreateComment} 
                placeholder="Thêm bình luận..." 
                targetId={targetId}
                targetType={targetType}
            />
        </div>
    );
};

export default CommentList;
