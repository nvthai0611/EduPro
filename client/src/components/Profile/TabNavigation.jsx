import { FileText, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'posts',
      label: 'Bài viết',
      icon: FileText,
    },
    {
      id: 'saved',
      label: 'Đã lưu',
      icon: Bookmark,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium text-sm transition-all relative",
                isActive 
                  ? "text-blue-600" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
