"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { jwtDecode } from "jwt-decode"
import { AUTH_TOKEN } from "../../constains/auth"
import Cookies from "js-cookie"
import { apiClient } from "../../utils/clientAxios"
import authService from "../../services/auth/authService"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { BookOpen, User, Menu, X, ChevronDown } from "lucide-react"
import LearningPlatformLogo from "../Logo/LearningPlatformLogo"
import { useAuth } from "../../hooks/useAuth"

const DATA_NAV = [
  { path: "/", nameKey: "home" },
  { path: "/courses", nameKey: "courses" },
  { path: "/about", nameKey: "about" },
  { path: "/advisory", nameKey: "advisory" },
]

const USER_MENU_ITEMS = [
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
]
const REDIRECT_URL = localStorage.getItem("redirect_url"); // Làm cho phần checkout

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // Thêm state cho modal
  const [activeModal, setActiveModal] = useState(null);

  const { t } = useTranslation();
  const userMenuRef = useRef(null);
  const { cart } = useCart();
  const navigate = useNavigate();

  // Lấy token và user từ service (giữ nguyên logic cũ)
  const token = apiClient?.getTokenFromCookie() || Cookies?.get(AUTH_TOKEN.ACCESS_TOKEN);
  const user = authService?.getUser();
  let tokenPayload = null;
  try {
    tokenPayload = jwtDecode(token);
  } catch (err) {
    tokenPayload = null;
  }

  if (REDIRECT_URL === "/shop/checkout") {// "/shop/checkout"
    navigate(REDIRECT_URL)
    localStorage.removeItem("redirect_url")
  }

  const isLoggedIn =
    !!token &&
    !!user &&
    typeof user === "object" &&
    user.UID &&
    user.name &&
    user.email &&
    !!tokenPayload &&
    tokenPayload.userId &&
    user.UID === tokenPayload.userId;

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const { data: bookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getAllUserBookings(user.UID),
  });



  const handleLogout = async () => {
    try {
      const result = await authService.logout(); // Chờ logout hoàn thành
      setIsUserMenuOpen(false); // Đóng menu
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          window.location.replace("/"); // Chuyển hướng về trang chủ
        }, 500)
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);
      setIsUserMenuOpen(false);
    }
  };

  // Thêm functions cho modal
  const openModal = (modalType) => {
    setActiveModal(modalType);
    setIsUserMenuOpen(false);
    setIsOpen(false);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const UserDropdown = () => (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center px-4 py-1.5 border border-blue-600 rounded-full text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors"
      >
        {user?.name}
        {user?.type === "VIP" && (
          <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-white text-xs rounded-full font-semibold">
            VIP
          </span>
        )}
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {USER_MENU_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => openModal(item.path.replace("/", ""))}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <span className="mr-3 text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <hr className="my-2 border-gray-200" />
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="mr-3 text-base">🚪</span>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img
              src="https://tse3.mm.bing.net/th/id/OIP.D9hkFgVwxVg_elPde-aaBAHaHa?pid=Api&P=0&h=180"
              alt="SpaConnect Logo"
              className="h-10 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {DATA_NAV.map((item) => (
              <Link key={item.path} to={item.path} className="text-gray-700 hover:text-blue-600 transition-colors">
                {t(item.nameKey)}
              </Link>
            ))}
          </div>
          <div style={{ display: window.location.href.includes("/shop") ? "block" : "none" }}>
            <div
              onClick={() => {
                navigate("/shop/cart-item")
                window.scrollTo(0, 'smooth')
              }}
              className="cursor-pointer flex items-center justify-center relative w-10 h-10 border border-gray-200 rounded-full ml-3 bg-gray-150"
            >
              <span className="text-gray-900">
                <ShoppingCart />
              </span>
              {cart?.items?.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
                  {cart?.items?.length}
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <UserDropdown />
            ) : (
              <>


                <a
                  href="/dang-nhap"
                  className="px-4 py-1.5 border border-blue-600 rounded-full text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  {t("login")}
                </a>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none p-2">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium bg-white border-t border-gray-200">
            {DATA_NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block text-gray-700 hover:text-blue-600 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t(item.nameKey)}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900 mb-3 px-2">👤 {user?.name}</div>
                  {USER_MENU_ITEMS.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => openModal(item.path.replace("/", ""))}
                      className="flex items-center py-2 px-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors w-full text-left"
                    >
                      <span className="mr-3 text-base">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center py-2 px-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors w-full text-left"
                  >
                    <span className="mr-3 text-base">🚪</span>
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <a
                  href={import.meta.env.VITE_SERVER_API_V1 + "/auth/google"}
                  className="block px-4 py-2 border border-blue-600 rounded-full text-blue-600 text-sm font-medium hover:bg-blue-50 text-center transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t("login")}
                </a>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Thêm Modal Dialog */}
      <Dialog open={!!activeModal} onOpenChange={closeModal}>
        <DialogContent describedby="" className="max-w-7xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {activeModal === "history" && "Lịch sử làm đẹp"}
              {activeModal === "offers" && "Ưu đãi của bạn"}
              {activeModal === "skincare-tips" && "Bí kíp chăm sóc da"}
              {/* {activeModal === "orders" && "Đơn hàng đã mua"} */}
              {activeModal === "user-profile" && "Thông tin tài khoản"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[90vh] p-6">
            {activeModal === "history" && <HistoryPage bookings={bookings} closeModal={closeModal} />}
            {activeModal === "offers" && <OffersPage />}
            {activeModal === "skincare-tips" && <SkincareTipsPage />}
            {/* {activeModal === "orders" && <OrdersPage />} */}
            {activeModal === "user-profile" && (
              <UserProfileModal
                isOpen={activeModal === "user-profile"}
                onClose={closeModal}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Navbar;
