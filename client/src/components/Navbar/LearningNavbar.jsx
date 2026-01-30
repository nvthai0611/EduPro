import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, User, Menu, X, ChevronDown, LogOut, FileText } from "lucide-react";
import LearningPlatformLogo from "../Logo/LearningPlatformLogo";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import SearchBar from "./components/SearchBar";
import NotificationDropdown from "./components/NotificationDropdown";
import { toast, ToastContainer } from "react-toastify";
import authService from "../../services/auth/authService";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef(null);
  const { user } = useAuth();

  const userMenuItems = [
    {
      label: "Khóa học của tôi",
      path: "/my-learning",
      icon: BookOpen,
    },
    {
      label: "Thông tin tài khoản",
      path: "/tai-khoan",
      icon: User,
    },
  ];
  const location = useLocation();
  const forumPaths = ['/forum', '/posts'];
  const isInForum = forumPaths.some(path => location.pathname.startsWith(path));
  const isForum = isInForum; // Re-defining for backward compatibility in the template

  const displayMenuItems = isInForum
    ? [
      {
        label: "Bài viết của tôi",
        path: "/forum/my-posts",
        icon: FileText,
      },
      ...userMenuItems,
    ]
    : userMenuItems;



  const handleLogout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          window.location.replace(import.meta.env.VITE_CLIENT_URL);
        }, 500);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className=" fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <LearningPlatformLogo size="md" />
          </Link>

          <ToastContainer />

          {/* Search Bar - Desktop */}
          {isForum ? null :
            <div className="hidden md:flex items-center flex-1 max-w-2xl">
              <SearchBar />
            </div>}

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4 justify-center">
                {/* Notification Dropdown Component */}
                <NotificationDropdown />
                
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <img
                      src={user.image || "https://static.vecteezy.com/system/resources/previews/024/766/958/non_2x/default-male-avatar-profile-icon-social-media-user-free-vector.jpg"}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{user.fullName}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {displayMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <item.icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Link>
                      ))}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() =>
                  (window.location.href =
                    import.meta.env.VITE_SERVER_API_V1 + "/auth/google")
                  }
                >
                  <svg
                    viewBox="-3 0 262 262"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        fill="#EB4335"
                      ></path>
                    </g>
                  </svg>
                  Đăng nhập
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="p-4 space-y-4">
              <SearchBar />

              {user ? (
                <>
                  {displayMenuItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Button
                  className="w-full"
                  onClick={() =>
                  (window.location.href =
                    import.meta.env.VITE_SERVER_API_V1 + "/auth/google")
                  }
                >
                  Đăng nhập Google
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
