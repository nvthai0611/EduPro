import { useState } from "react";
import { formatTimeAgo } from "../../utils/format";
import { Check, ChevronUp, ChevronDown } from "lucide-react";
import CommentList from "./CommentList";
import { answerService } from "../../services/forum/answerService";

const AnswerItem = ({ answer, isPostAuthor, onAccept }) => {
    const [likes, setLikes] = useState(answer.likesCount || 0);

    // Note: Backend doesn't return userVote status yet, so frontend state is local for session or naïve.
    // For production, we need backend to return "userVoteStatus: 'up' | 'down' | null".
    // Assuming idempotent backend handles it, but UI needs feedback.
    // We'll proceed with simple optimistic UI.

    const handleVote = async (type) => {
        try {
            const updatedAnswer = await answerService.vote(answer._id, type);
            if (updatedAnswer && updatedAnswer.data) {
                setLikes(updatedAnswer.data.likesCount);
            }
        } catch (error) {
            console.error("Vote failed", error);
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border ${answer.isAccepted ? "border-green-200 ring-1 ring-green-100" : "border-gray-100"} p-6 mb-4 transition-all hover:shadow-md`}>
            <div className="flex gap-6">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                    <button
                        onClick={() => handleVote('up')}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition"
                    >
                        <ChevronUp className="w-8 h-8" />
                    </button>

                    <span className="font-bold text-lg text-gray-700">{likes}</span>

                    <button
                        onClick={() => handleVote('down')}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-500 transition"
                    >
                        <ChevronDown className="w-8 h-8" />
                    </button>

                    {answer.isAccepted && (
                        <div className="mt-4 flex flex-col items-center text-green-600">
                            <Check className="w-8 h-8 p-1 bg-green-100 rounded-full" />
                            <span className="text-xs font-semibold mt-1">Chuẩn</span>
                        </div>
                    )}
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    {/* Meta */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={"https://i.pravatar.cc/150?img=" + (answer.authorName?.length % 70)}
                                alt={answer.authorName}
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm text-gray-900">{answer.authorName}</span>
                                <span className="text-xs text-gray-500">{formatTimeAgo(answer.createdAt)}</span>
                            </div>
                        </div>

                        {isPostAuthor && !answer.isAccepted && (
                            <button
                                onClick={() => onAccept(answer._id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-full hover:bg-green-100 transition"
                            >
                                <Check className="w-3 h-3" />
                                Chấp nhận lời giải
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="prose prose-sm max-w-none text-gray-800 mb-6">
                        <p className="whitespace-pre-wrap">{answer.content}</p>
                    </div>

                    {/* Comments (Inline) */}
                    <CommentList targetType="answer" targetId={answer._id} />
                </div>
            </div>
        </div>
    );
};

export default AnswerItem;
