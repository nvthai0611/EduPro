import { useState } from "react";
import { formatTimeAgo } from "../../utils/format";
import CreateComment from "./CreateComment";

const CommentItem = ({ comment, onReply, rootCommentId }) => {
    const [isReplying, setIsReplying] = useState(false);

    const handleReplySubmit = async (content) => {
        // If this is a reply (has parentId), use the root comment ID
        // Otherwise, use this comment's ID as the parent
        const targetParentId = comment.parentId ? (rootCommentId || comment.parentId) : comment._id;
        await onReply(targetParentId, content);
        setIsReplying(false);
    };

    return (
        <div className="flex gap-3 py-4">
            <img
                src={"https://i.pravatar.cc/150?img=" + (comment.authorName?.length % 70)} // Random avatar based on name length
                alt={comment.authorName}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                            {comment.authorName || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.createdAt)}
                        </span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>

                <div className="flex gap-4 mt-1 ml-1">
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        Trả lời
                    </button>
                </div>

                {isReplying && (
                    <div className="mt-2 ml-2">
                        <CreateComment
                            onSubmit={handleReplySubmit}
                            placeholder={`Trả lời ${comment.authorName}...`}
                            onCancel={() => setIsReplying(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
