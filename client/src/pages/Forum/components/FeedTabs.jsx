import { Link } from "react-router-dom";
import { FeedType } from "../../../utils/constants";
import { SquarePen } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

const FEED_TABS = [
    { label: "Dành cho bạn", value: FeedType.FOR_YOU },
    // { label: "Theo tác giả", value: FeedType.AUTHOR },
    { label: "Mới nhất", value: FeedType.LATEST },
    { label: "Sôi nổi", value: FeedType.HOT },
    { label: "Đánh giá cao nhất", value: FeedType.TOP },
];

const FeedTabs = ({ active, onChange }) => {
    const { user } = useAuth();

    return (
        <div className="flex gap-1 md:gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
            {FEED_TABS.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`pb-3 px-1 text-sm font-medium whitespace-nowrap transition-colors relative
            ${active === tab.value
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-900"
                        }
          `}
                >
                    {tab.label}
                    {active === tab.value && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                </button>
            ))}

            {user && (
                <>
                    <div className="hidden md:flex items-center justify-end flex-1 mb-4">
                        <Link
                            to="/forum/create"
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200"
                        >
                            <SquarePen className="w-4 h-4" />
                            <span>Tạo bài viết</span>
                        </Link>
                    </div>
                </>
            )
            }
        </div>
    );
};

export default FeedTabs;
