"use client"
import { Bell, Moon, Sun, User, Eye, EyeOff, AlertCircle, Edit3, Save, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect, useRef } from "react"
import { authService } from "../../services/auth/authService"
import { toast } from "react-toastify"
import useNotificationStore from "../../stores/zustand/notificationStore"
import { changePassword } from "../../services/user/userService"
import { getStaffProfile, updateStaffProfile, updateStaffAvatar } from "../../services/staff/staffProfileService"
import { useNavigate } from "react-router-dom"

export default function StaffHeader() {
  const [theme, setTheme] = useState("light")
  const { notifications, clearNotifications, markAsRead } = useNotificationStore()
  const unreadCount = notifications.filter((n) => !n.read).length
  const navigate = useNavigate()

  // State để kích hoạt hiệu ứng pop tức thời
  const [shouldAnimatePop, setShouldAnimatePop] = useState(false)

  // Ref để lưu trữ số lượng thông báo cũ
  const prevUnreadCountRef = useRef(unreadCount)

  // Ref cho thẻ audio
  const audioRef = useRef(null)

  // State cho modal đổi mật khẩu
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // State cho modal thông tin tài khoản
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    image: "",
  })
  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    image: "",
    imageFile: null,
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState("")

  // useEffect để xử lý âm thanh và hiệu ứng khi có thông báo mới
  useEffect(() => {
    // Chỉ chạy khi unreadCount thay đổi và lớn hơn số lượng cũ
    if (unreadCount > prevUnreadCountRef.current) {
      // Kích hoạt âm thanh
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.error("Error playing sound:", e))
      }
      // Kích hoạt hiệu ứng pop
      setShouldAnimatePop(true)
      const timer = setTimeout(() => {
        setShouldAnimatePop(false) // Tắt hiệu ứng sau một thời gian ngắn
      }, 500) // Thời gian hiệu ứng 0.5 giây
      return () => clearTimeout(timer) // Dọn dẹp timer
    }
    // Cập nhật số lượng thông báo cũ
    prevUnreadCountRef.current = unreadCount
  }, [unreadCount]) // Dependency array: chạy lại khi unreadCount thay đổi

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = async () => {
    try {
      const result = await authService.logout()
      if (result.success) {
        toast.success(result.message)
        setTimeout(() => {
          window.location.replace("/courses")
        }, 500)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Hàm lấy thông tin user
  const fetchUserProfile = async () => {
    setIsLoadingProfile(true)
    setProfileError("")
    try {
      const result = await getStaffProfile()
      if (result.success) {
        setUserData(result.data)
        setEditData({
          fullName: result.data.fullName,
          phoneNumber: result.data.phoneNumber,
          image: result.data.image,
          imageFile: null,
        })
      } else {
        setProfileError("Không thể tải thông tin tài khoản")
      }
    } catch (error) {
      setProfileError("Có lỗi xảy ra khi tải thông tin tài khoản")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Hàm mở modal thông tin tài khoản
  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true)
    fetchUserProfile()
  }

  // Hàm mở modal chỉnh sửa
  const handleOpenEditModal = () => {
    setIsEditProfileModalOpen(true)
    setEditData({
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      image: userData.image,
      imageFile: null,
    })
    setProfileError("")
    setProfileSuccess("")
  }

  // Hàm xử lý thay đổi input
  const handleEditInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error khi user thay đổi input
    if (profileError) {
      setProfileError("")
    }
    if (profileSuccess) {
      setProfileSuccess("")
    }
  }

  // Hàm xử lý upload ảnh
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setProfileError("Vui lòng chọn file ảnh hợp lệ")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setProfileError("Kích thước ảnh không được vượt quá 5MB")
        return
      }

      // Preview ảnh
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditData(prev => ({
          ...prev,
          image: e.target.result,
          imageFile: file // Lưu file để upload
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Hàm lưu thông tin chỉnh sửa
  const handleSaveProfile = async () => {
    if (!editData.fullName || !editData.fullName.trim()) {
      setProfileError("Vui lòng nhập họ tên")
      return
    }

    // Validate số điện thoại nếu có nhập
    if (editData.phoneNumber && editData.phoneNumber.trim()) {
      const phoneRegex = /^((03|05|07|08|09)[0-9]{8})$/
      if (!phoneRegex.test(editData.phoneNumber.trim())) {
        setProfileError("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ")
        return
      }
    }

    setIsSavingProfile(true)
    setProfileError("")
    setProfileSuccess("")

    try {
      // Cập nhật thông tin cơ bản
      const profileResult = await updateStaffProfile({
        fullName: editData.fullName.trim(),
        phoneNumber: editData.phoneNumber ? editData.phoneNumber.trim() : "",
      })

      if (profileResult.success) {
        // Nếu có thay đổi ảnh, cập nhật ảnh
        if (editData.imageFile) {
          const imageResult = await updateStaffAvatar(editData.imageFile)
          if (!imageResult.success) {
            throw new Error("Không thể cập nhật ảnh đại diện")
          }
        }

        setProfileSuccess("Cập nhật thông tin thành công!")
        setUserData(prev => ({
          ...prev,
          fullName: editData.fullName.trim(),
          phoneNumber: editData.phoneNumber ? editData.phoneNumber.trim() : "",
          image: editData.image,
        }))
        
        setTimeout(() => {
          setIsEditProfileModalOpen(false)
        }, 1000)
      } else {
        setProfileError(profileResult.message || "Cập nhật thông tin thất bại")
      }
    } catch (error) {
      setProfileError(error.message || "Có lỗi xảy ra khi cập nhật thông tin")
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error khi user thay đổi input
    if (errorMessage) {
      setErrorMessage("")
    }
    if (successMessage) {
      setSuccessMessage("")
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validatePasswordForm = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm

    if (!currentPassword || !currentPassword.trim()) {
      setErrorMessage("Vui lòng nhập mật khẩu hiện tại")
      return false
    }

    if (!newPassword || !newPassword.trim()) {
      setErrorMessage("Vui lòng nhập mật khẩu mới")
      return false
    }

    const trimmed = newPassword.trim()
    if (trimmed.length < 8) {
      setErrorMessage("Mật khẩu mới phải có ít nhất 8 ký tự")
      return false
    }

    if (!/[A-Z]/.test(trimmed)) {
      setErrorMessage("Mật khẩu mới phải chứa ít nhất một chữ cái in hoa")
      return false
    }

    if (!/[a-z]/.test(trimmed)) {
      setErrorMessage("Mật khẩu mới phải chứa ít nhất một chữ cái thường")
      return false
    }

    if (!/[0-9]/.test(trimmed)) {
      setErrorMessage("Mật khẩu mới phải chứa ít nhất một chữ số")
      return false
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(trimmed)) {
      setErrorMessage("Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt")
      return false
    }

    if (trimmed === currentPassword.trim()) {
      setErrorMessage("Mật khẩu mới phải khác mật khẩu hiện tại")
      return false
    }

    if (trimmed !== confirmPassword?.trim()) {
      setErrorMessage("Mật khẩu xác nhận không khớp")
      return false
    }

    return true
  }

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return

    setIsChangingPassword(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const result = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      )

      if (result.success) {
        setSuccessMessage("Đổi mật khẩu thành công!")
        setTimeout(() => {
          navigate("/manager/dang-nhap")
        }, 1000)
        setTimeout(() => {
          setIsPasswordModalOpen(false)
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
        }, 1000)
      } else {
        setErrorMessage(result.message || "Đổi mật khẩu thất bại")
      }
    } catch (error) {
      setErrorMessage(error.message || "Có lỗi xảy ra khi đổi mật khẩu")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    })
    setErrorMessage("")
    setSuccessMessage("")
  }

  return (
    <>
      <header
        className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-4 md:px-6"
        style={{ zIndex: 0 }}
      >
        {/* Thêm khối style vào đây */}
        <style>{`
          @keyframes notification-pulse {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.7);
            }
          }
          .animate-notification-pulse {
            animation: notification-pulse 1.5s infinite ease-in-out;
          }
          @keyframes notification-pop {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(2.5); /* Phóng to hơn một chút */
            }
            100% {
              transform: scale(1);
            }
          }
          .animate-notification-pop {
            animation: notification-pop 0.3s ease-out; /* Thời gian ngắn, nhanh */
          }
        `}</style>
        {/* Kết thúc khối style */}

        {/* Thẻ audio cho âm thanh thông báo */}
        <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />

        <SidebarTrigger />
        <div className="flex items-center gap-2 md:ml-auto">
          {/* Toggle theme */}
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notification dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center
                      rounded-full bg-red-500 text-[10px] text-white px-1 leading-none
                      ${shouldAnimatePop ? "animate-notification-pop" : "animate-notification-pulse"}
                    `}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 max-h-[400px] overflow-y-auto shadow-lg" sideOffset={8}>
              <DropdownMenuLabel className="text-xl font-extrabold text-gray-800 border-b pb-2 mb-2">
                🔔 Thông báo của bạn
              </DropdownMenuLabel>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-base text-gray-500 text-center">Không có thông báo nào.</div>
              ) : (
                notifications.map((noti, idx) => {
                  const booking = noti.booking
                  const isUnread = !noti.read
                  const notificationTime = new Date(noti.createdAt || Date.now()).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })

                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!noti.read) markAsRead(idx)
                        const booking = noti.booking
                        const toastContent =
                          `📅 Lịch hẹn với ${booking?.customer?.fullName || "khách hàng không rõ"}\n` +
                          `🧖 Dịch vụ: ${booking?.service?.map((s) => s.name).join(", ")}\n` +
                          `📍 Chi nhánh: ${booking?.branch?.name}\n` +
                          `⏰ Thời gian: ${new Date(booking?.dateTime).toLocaleString("vi-VN")}\n` +
                          `💰 Tổng tiền: ${booking?.totalPrice?.toLocaleString("vi-VN")}₫`
                        switch (noti.type) {
                          case "success":
                            toast.success(toastContent, {
                              autoClose: 5000,
                              position: "top-center",
                            })
                            break
                          case "error":
                            toast.error(toastContent, {
                              autoClose: 5000,
                              position: "top-center",
                            })
                            break
                          default:
                            toast.info(toastContent, {
                              autoClose: 5000,
                              position: "top-center",
                            })
                        }
                      }}
                      className={`relative flex flex-col items-start px-4 py-3 gap-1 cursor-pointer transition-colors duration-200 ease-in-out border-b last:border-b-0
                        ${isUnread ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-gray-50"}`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className={`text-base font-semibold ${isUnread ? "text-blue-800" : "text-gray-700"}`}>
                          {noti.message}
                        </div>
                        {isUnread && <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />}
                      </div>
                      <div className="text-xs text-gray-600">
                        👤 {booking?.customer?.fullName || "Khách hàng không rõ"} – 📅{" "}
                        <span className="font-medium">
                          {new Date(booking?.dateTime).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        🧖 Dịch vụ:{" "}
                        <span className="font-medium">
                          {booking?.service?.map((s) => s?.name).join(", ") || "Không rõ"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        💰 Tổng tiền:{" "}
                        <span className="font-medium">{booking?.totalPrice?.toLocaleString("vi-VN")}₫</span>
                      </div>
                      <div className="text-xs text-gray-500 italic mt-1">
                        📍 {booking?.branch?.name || "Chi nhánh không xác định"}
                      </div>
                      <div className="text-xs text-gray-400 mt-2 self-end">{notificationTime}</div>
                    </div>
                  )
                })
              )}
              <DropdownMenuSeparator className="mt-2" />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  clearNotifications()
                }}
                className="text-center justify-center text-red-600 font-semibold cursor-pointer hover:bg-red-50 transition-colors duration-200 py-2"
              >
                🗑️ Xóa tất cả thông báo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleOpenProfileModal} className="cursor-pointer">
                👤 Thông tin tài khoản
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsPasswordModalOpen(true)} className="cursor-pointer">
                🔒 Đổi mật khẩu
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>🚪 Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modal thông tin tài khoản */}
      <Dialog
        open={isProfileModalOpen}
        onOpenChange={(open) => {
          setIsProfileModalOpen(open)
          if (!open) {
            setUserData({
              fullName: "",
              email: "",
              phoneNumber: "",
              image: "",
            })
            setProfileError("")
            setProfileSuccess("")
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>👤 Thông tin tài khoản</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết của tài khoản staff của bạn.
            </DialogDescription>
          </DialogHeader>

          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
            </div>
          ) : (
            <div className="grid gap-6 py-4">
              {/* Ảnh đại diện */}
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.image} alt={userData.fullName} />
                  <AvatarFallback className="text-lg">
                    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "S"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Thông tin chi tiết */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">👤 Họ và tên</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-900 font-medium">{userData.fullName || "Chưa cập nhật"}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">📧 Email</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-900 font-medium">{userData.email || "Chưa cập nhật"}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700">📞 Số điện thoại</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-900 font-medium">{userData.phoneNumber || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Đóng
            </Button>
            <Button
              type="button"
              onClick={handleOpenEditModal}
              disabled={isLoadingProfile}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal chỉnh sửa thông tin tài khoản */}
      <Dialog
        open={isEditProfileModalOpen}
        onOpenChange={(open) => {
          setIsEditProfileModalOpen(open)
          if (!open) {
            setEditData({
              fullName: "",
              phoneNumber: "",
              image: "",
              imageFile: null,
            })
            setProfileError("")
            setProfileSuccess("")
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>✏️ Chỉnh sửa thông tin tài khoản</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cá nhân của bạn.
            </DialogDescription>
          </DialogHeader>

          {/* Hiển thị thông báo lỗi */}
          {profileError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{profileError}</AlertDescription>
            </Alert>
          )}

          {/* Hiển thị thông báo thành công */}
          {profileSuccess && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{profileSuccess}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 py-4">
            {/* Ảnh đại diện */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={editData.image} alt={editData.fullName} />
                <AvatarFallback className="text-lg">
                  {editData.fullName ? editData.fullName.charAt(0).toUpperCase() : "S"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Thay đổi ảnh
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Họ và tên */}
            <div className="grid gap-2">
              <Label htmlFor="edit-fullname">👤 Họ và tên</Label>
              <Input
                id="edit-fullname"
                type="text"
                value={editData.fullName}
                onChange={(e) => handleEditInputChange("fullName", e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Số điện thoại */}
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">📞 Số điện thoại</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editData.phoneNumber}
                onChange={(e) => handleEditInputChange("phoneNumber", e.target.value)}
                placeholder="Nhập số điện thoại (VD: 0123456789)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditProfileModalOpen(false)}
              disabled={isSavingProfile}
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSavingProfile ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal đổi mật khẩu */}
      <Dialog
        open={isPasswordModalOpen}
        onOpenChange={(open) => {
          setIsPasswordModalOpen(open)
          if (!open) {
            resetPasswordForm()
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi mật khẩu của bạn.
              <br />
              <small className="text-gray-500 mt-2 block">
                Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
              </small>
            </DialogDescription>
          </DialogHeader>

          {/* Hiển thị thông báo lỗi */}
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Hiển thị thông báo thành công */}
          {successMessage && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            {/* Mật khẩu hiện tại */}
            <div className="grid gap-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordFormChange("currentPassword", e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div className="grid gap-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordFormChange("newPassword", e.target.value)}
                  placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
                  className="pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordFormChange("confirmPassword", e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPasswordModalOpen(false)}
              disabled={isChangingPassword}
            >
              Hủy
            </Button>
            <Button type="button" onClick={handleChangePassword} disabled={isChangingPassword}>
              {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}