import { Flame, Clock, Users, Sparkles } from "lucide-react";

const TabSwitcher = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "latest", label: "Mới nhất", icon: Clock },
    { id: "trending", label: "Thịnh hành", icon: Flame },
    { id: "following", label: "Đang theo dõi", icon: Users },
    { id: "featured", label: "Nổi bật", icon: Sparkles },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[70px] z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                  whitespace-nowrap transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabSwitcher;
