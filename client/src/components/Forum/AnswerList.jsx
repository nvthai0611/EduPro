import { useEffect, useState } from "react";
import { answerService } from "../../services/forum/answerService";
import AnswerItem from "./AnswerItem";
import CreateAnswer from "./CreateAnswer";
import { Loader2 } from "lucide-react";

const AnswerList = ({ postId, postAuthorId, currentUserId }) => {
    const [answers, setAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnswers = async () => {
            setIsLoading(true);
            try {
                const data = await answerService.getByPostId(postId);
                setAnswers(data);
            } catch (error) {
                console.error("Failed to load answers", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (postId) {
            fetchAnswers();
        }
    }, [postId]);

    const handleCreateAnswer = async (content) => {
        const result = await answerService.create(postId, content);
        if (result && result.data) {
            setAnswers([...answers, result.data]);
        }
    };

    const handleAcceptAnswer = async (answerId) => {
        try {
            const result = await answerService.accept(answerId);
            if (result && result.data) {
                // Update local state to reflect change (easiest is re-fetch or manual splice)
                // Manual update for smoothness:
                const updatedAnswers = answers.map(a => ({
                    ...a,
                    isAccepted: a._id === answerId // Only this one is accepted
                }));
                // Move accepted to top
                const accepted = updatedAnswers.find(a => a._id === answerId);
                const others = updatedAnswers.filter(a => a._id !== answerId);
                setAnswers([accepted, ...others]);
            }
        } catch (error) {
            console.error("Accept failed", error);
        }
    };

    if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;

    const isPostAuthor = postAuthorId === currentUserId;

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{answers.length} Câu trả lời</h2>
            </div>

            <div className="space-y-6">
                {answers.map(answer => (
                    <AnswerItem
                        key={answer._id}
                        answer={answer}
                        isPostAuthor={isPostAuthor}
                        onAccept={handleAcceptAnswer}
                    />
                ))}
                {answers.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">Chưa có câu trả lời nào. Hãy là người đầu tiên giúp đỡ!</p>
                    </div>
                )}
            </div>

            <CreateAnswer onSubmit={handleCreateAnswer} />
        </div>
    );
};

export default AnswerList;
