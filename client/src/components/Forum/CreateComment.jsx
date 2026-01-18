import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const CreateComment = ({ onSubmit, placeholder = "Viết bình luận...", onCancel }) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent("");
            if (onCancel) onCancel();
        } catch (error) {
            console.error("Failed to submit comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-2 items-start">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm min-h-[80px]"
                />
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </div>
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                >
                    Hủy
                </button>
            )}
        </form>
    );
};

export default CreateComment;
