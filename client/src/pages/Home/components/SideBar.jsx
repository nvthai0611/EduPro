import { Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  HelpCircle,
  Route,
  Library
} from 'lucide-react';
// import { useAuth } from '../../../hooks/useAuth';

const SideBar = () => {
  // const location = useLocation();

  const isActive = (path) => location.pathname === path;
  // const { user } = useAuth();

  const menuItems = [
    { path: '/', icon: Home, label: 'Trang chủ' },
     { path: '/forum', icon: Library, label: 'Thảo luận' },
    { path: '/about', icon: BookOpen, label: 'Giới thiệu' },
    { path: '/advisory', icon: Route, label: 'Lộ trình' },
    { path: "", icon: HelpCircle, label: 'Help' }
  ].filter(Boolean);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-20 left-4 z-40 rounded-2xl p-3">
        <nav className="flex flex-col gap-2">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all hover:scale-110 ${isActive(path)
                ? 'bg-grey-500 text-black shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
              title={label}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium text-center">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <nav className="flex justify-around items-center px-2 py-2 safe-area-inset-bottom">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[60px] ${isActive(path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[9px] sm:text-[10px] font-medium text-center">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SideBar;