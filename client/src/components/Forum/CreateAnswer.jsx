import { useState } from "react";
import { Loader2 } from "lucide-react";

const CreateAnswer = ({ onSubmit }) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent("");
        } catch (error) {
            console.error("Failed to submit answer", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 mt-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Câu trả lời của bạn</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Chia sẻ kiến thức của bạn..."
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none min-h-[150px] mb-4 text-base"
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!content.trim() || isSubmitting}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Gửi câu trả lời
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAnswer;
