import { Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  HelpCircle,
  Route 
} from 'lucide-react';

const SideBar = () => {
  // const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/courses', icon: Home, label: 'Trang chủ' },
    // { path: '/courses', icon: BookOpen, label: 'Khóa học' },
    { path: '/about', icon: BookOpen, label: 'Giới thiệu' },
    { path: '/advisory', icon: Route , label: 'Lộ trình' },
    { path:"", icon: HelpCircle, label: 'Help' }
  ];

  return (
    <div className="sticky top-4 left-4   rounded-2xl p-3 z-40 item-center">
      <nav className="flex flex-col gap-2">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all hover:scale-110 ${
              isActive(path) 
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
  );
};

export default SideBar;