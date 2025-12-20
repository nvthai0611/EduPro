import { Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Users,
  Settings,
  HelpCircle
} from 'lucide-react';

const SideBar = () => {
  // const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help' }
  ];

  return (
    <div className="sticky top-4 left-4   rounded-2xl p-3 z-40">
      <nav className="flex flex-col gap-2">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all hover:scale-110 ${
              isActive(path) 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={label}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;