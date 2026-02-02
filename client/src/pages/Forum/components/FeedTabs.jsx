import { FeedType } from "../../../utils/constants";

const FEED_TABS = [
    { label: "Dành cho bạn", value: FeedType.FOR_YOU },
    // { label: "Theo tác giả", value: FeedType.AUTHOR },
    { label: "Mới nhất", value: FeedType.LATEST },
    { label: "Sôi nổi", value: FeedType.HOT },
    { label: "Đánh giá cao nhất", value: FeedType.TOP },
];

const FeedTabs = ({ active, onChange }) => {
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
        </div>
    );
};

export default FeedTabs;
