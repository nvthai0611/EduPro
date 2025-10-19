"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    User,
    Mail,
    Phone,
    Camera,
    Shield,
    CheckCircle,
    Clock,
    Edit3,
    Save,
    X,
    Eye,
    EyeOff,
    Upload,
    Lock,
    Key,
    Calendar,
} from "lucide-react"
import { changeImageProfile, changeUserProfile, getUserProfile, sendOTP, resendOTP, verifyOTP, changePassword } from "../../../services/user/userService"
import { toast } from "react-toastify"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { isValidName, isValidPhone } from "../../../utils/validation"
import { formatPhoneNumber } from "../../../utils/format"
import { useBookingStore } from "../../../stores/zustand/bookingStore"

// OTP Verification Modal Component
const OTPModal = ({ isOpen, onClose, type, value, onVerify }) => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        let timer;
        if (countdown > 0 && isOpen) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setCountdown(60);
            setOtp("");
        }
    }, [isOpen]);

    // Gửi lại mã OTP
    const handleResendOTP = async () => {
        try {
            setCountdown(60);
            setOtp("");
            const res = await resendOTP(value, type);
            if (res.success) {
                toast.success("Đã gửi lại mã OTP");
            } else {
                toast.error("Gửi lại mã OTP thất bại");
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            toast.error("Có lỗi xảy ra khi gửi lại OTP");
        }
    };

    // Xác nhận OTP
    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const res = await verifyOTP(value, otp, type);
            if (res.success) {
                onVerify();
                onClose();
            } else {
                toast.error("Mã OTP không chính xác");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("Mã OTP không chính xác");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Xác thực email
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Bắt buộc khi thay đổi email
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 animate-slide-up">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                        <p className="text-sm text-muted-foreground">
                            Mã xác nhận đã được gửi đến
                        </p>
                        <p className="font-semibold text-foreground text-lg mt-1">
                            {value}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Không nhận được mã?{" "}
                            <button
                                onClick={handleResendOTP}
                                disabled={countdown > 0}
                                className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 transition-colors"
                            >
                                {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại"}
                            </button>
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 hover:bg-gray-50 transition-colors bg-transparent"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={otp.length < 6 || isLoading}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Đang xác nhận...</span>
                                </div>
                            ) : (
                                "Xác nhận"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Change Password Modal Component
const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handlePasswordChange = (field, value) => {
        setPasswords((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    const validatePasswords = () => {
        const newErrors = {}
        const { current, new: newPassword, confirm } = passwords

        // Case 1: Mật khẩu hiện tại không được để trống
        if (!current || !current.trim()) {
            newErrors.current = "Vui lòng nhập mật khẩu hiện tại"
        }

        // Case 2: Mật khẩu mới không được để trống
        if (!newPassword || !newPassword.trim()) {
            newErrors.new = "Vui lòng nhập mật khẩu mới"
        } else {
            const trimmedNewPassword = newPassword.trim()

            // Case 3: Mật khẩu mới phải có ít nhất 8 ký tự
            if (trimmedNewPassword.length < 8) {
                newErrors.new = "Mật khẩu mới phải có ít nhất 8 ký tự"
            }
            // Case 4: Mật khẩu mới phải chứa ít nhất một chữ cái in hoa
            else if (!/[A-Z]/.test(trimmedNewPassword)) {
                newErrors.new = "Mật khẩu mới phải chứa ít nhất một chữ cái in hoa"
            }
            // Case 5: Mật khẩu mới phải chứa ít nhất một chữ cái thường
            else if (!/[a-z]/.test(trimmedNewPassword)) {
                newErrors.new = "Mật khẩu mới phải chứa ít nhất một chữ cái thường"
            }
            // Case 6: Mật khẩu mới phải chứa ít nhất một chữ số
            else if (!/[0-9]/.test(trimmedNewPassword)) {
                newErrors.new = "Mật khẩu mới phải chứa ít nhất một chữ số"
            }
            // Case 7: Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt
            else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(trimmedNewPassword)) {
                newErrors.new = "Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt"
            }
            // Case 8: Mật khẩu mới phải khác mật khẩu hiện tại
            else if (trimmedNewPassword === current.trim()) {
                newErrors.new = "Mật khẩu mới phải khác mật khẩu hiện tại"
            }
        }

        // Case 9: Mật khẩu xác nhận không khớp
        if (!confirm || confirm.trim() !== newPassword.trim()) {
            newErrors.confirm = "Mật khẩu xác nhận không khớp"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validatePasswords()) return

        setIsLoading(true)
        try {
            const res = await changePassword(passwords.current, passwords.new) // Gọi API
            if (res.success) {
                onSuccess() // Xử lý thành công
                onClose()
                toast.success("Đã cập nhật mật khẩu thành công, bạn sẽ phải đăng nhập lại.")
            } else {
                setErrors({ ...errors, api: res.message }) // Hiển thị lỗi từ API
                toast.error(res.message || "Cập nhật mật khẩu thất bại")
            }
        } catch (error) {
            console.error("Error changing password:", error)
            setErrors({ ...errors, api: "Đã xảy ra lỗi. Vui lòng thử lại." })
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        onClose()
        setPasswords({ current: "", new: "", confirm: "" })
        setErrors({})
        setShowPasswords({ current: false, new: false, confirm: false })
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full animate-bounce">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Đổi mật khẩu
                        </h3>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 animate-slide-up">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                        <div className="relative">
                            <Input
                                id="current-password"
                                type={showPasswords.current ? "text" : "password"}
                                value={passwords.current}
                                onChange={(e) => handlePasswordChange("current", e.target.value)}
                                className={`pr-10 transition-all duration-200 ${errors.current ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("current")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.current && <p className="text-red-500 text-sm animate-shake">{errors.current}</p>}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showPasswords.new ? "text" : "password"}
                                value={passwords.new}
                                onChange={(e) => handlePasswordChange("new", e.target.value)}
                                className={`pr-10 transition-all duration-200 ${errors.new ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("new")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.new && <p className="text-red-500 text-sm animate-shake">{errors.new}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwords.confirm}
                                onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                                className={`pr-10 transition-all duration-200 ${errors.confirm ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                                placeholder="Xác nhận mật khẩu mới"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirm")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirm && <p className="text-red-500 text-sm animate-shake">{errors.confirm}</p>}
                    </div>

                    {errors.api && <p className="text-red-500 text-sm animate-shake">{errors.api}</p>}

                    <div className="flex space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 hover:bg-gray-50 transition-colors bg-transparent"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Đang cập nhật...</span>
                                </div>
                            ) : (
                                "Cập nhật"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Image Upload Modal Component
const ImageUploadModal = ({ isOpen, onClose, currentImage, onImageChange, userData, setUserData }) => {
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(currentImage)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            console.log("Tên file:", file.name);
            console.log("Kích thước:", file.size, "bytes");
            console.log("Kích thước (MB):", (file.size / (1024 * 1024)).toFixed(2), "MB");
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                toast.error("Kích thước file không được vượt quá 5MB")
                return
            }

            if (!file.type.startsWith("image/")) {
                toast.error("Vui lòng chọn file ảnh")
                return
            }

            setSelectedImage(file)
            const reader = new FileReader()
            reader.onload = (e) => setPreviewUrl(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    const handleUpload = async () => {
        if (!selectedImage) return
        setIsUploading(true)
        try {
            // const formData = new FormData()
            // formData.append("image", selectedImage)
            console.log("selectedImage:", selectedImage);

            const res = await changeImageProfile(selectedImage) // Gọi API

            if (res.success) {
                onImageChange(res.data.imageUrl) // Cập nhật ảnh với URL mới từ API
                setUserData({ ...userData, image: res.data.image })
                onClose()
                setSelectedImage(null)
                toast.success("Đã cập nhật ảnh")
            } else {
                toast.error("Cập nhật ảnh thất bại")
            }
        } catch (error) {
            console.error("Error uploading image:", error)
            toast.error("Có lỗi xảy ra khi tải ảnh lên")
        } finally {
            setIsUploading(false)
        }
    }

    const handleClose = () => {
        setSelectedImage(null)
        setPreviewUrl(currentImage)
        onClose()
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files.length > 0) {
            const file = files[0]
            if (file.type.startsWith("image/")) {
                handleFileSelect({ target: { files: [file] } })
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-orange-600 rounded-full animate-pulse">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                            Thay đổi ảnh đại diện
                        </h3>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 animate-slide-up">
                    <div className="flex justify-center">
                        <div className="relative group">
                            <Avatar className="w-32 h-32 border-4 border-gradient-to-r from-pink-500 to-orange-600 transition-all duration-300 group-hover:scale-105">
                                <AvatarImage src={previewUrl || "/placeholder.svg"} alt="Preview" />
                                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-orange-600 text-white text-2xl">
                                    <User className="w-12 h-12" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="border-dashed border-2 border-gray-300 rounded-lg p-6 hover:border-pink-500 transition-all duration-300 hover:bg-pink-50 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600 mb-1">Kéo thả ảnh vào đây hoặc</p>
                            <Button
                                variant="outline"
                                className="border-dashed border-2 border-gray-300 hover:border-pink-500 transition-all duration-300 hover:bg-pink-50 bg-transparent"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Chọn ảnh từ máy tính
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Hỗ trợ JPG, PNG, GIF. Tối đa 5MB.</p>
                    </div>

                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 hover:bg-gray-50 transition-colors bg-transparent"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedImage || isUploading}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Đang tải lên...</span>
                                </div>
                            ) : (
                                "Cập nhật ảnh"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// User Info Tab Component
const UserInfoTab = ({ userData, editData, isEditing, onEdit, onCancel, onSave, onInputChange, isSaving }) => {
    return (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-all duration-500 hover:shadow-2xl">
            <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Thông tin cá nhân
                    </h3>
                    {!isEditing ? (
                        <Button
                            onClick={onEdit}
                            variant="outline"
                            size="sm"
                            className="transition-all duration-300 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 bg-transparent"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    ) : (
                        <div className="flex space-x-3">
                            <Button
                                onClick={onCancel}
                                variant="outline"
                                size="sm"
                                className="transition-all duration-300 hover:bg-red-50 hover:border-red-500 bg-transparent"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Hủy
                            </Button>
                            <Button
                                onClick={onSave}
                                size="sm"
                                disabled={isSaving}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="space-y-3 group">
                        <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center">
                            <User className="w-4 h-4 mr-2 text-blue-500" />
                            Họ và tên
                        </Label>
                        {isEditing ? (
                            <Input
                                id="fullName"
                                value={editData.fullName}
                                onChange={(e) => onInputChange("fullName", e.target.value)}
                                className="border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                            />
                        ) : (
                            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-gray-100 transition-all duration-300 group-hover:border-blue-200 group-hover:shadow-md">
                                <User className="w-5 h-5 text-gray-400" />
                                <span className="font-semibold text-gray-800">{userData.fullName}</span>
                            </div>
                        )}
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-3 group">
                        <Label htmlFor="birthDate" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-pink-500" />
                            Ngày sinh
                        </Label>
                        {isEditing ? (
                            <Input
                                id="birthDate"
                                type="date"
                                value={editData.birthDate ? new Date(editData.birthDate).toISOString().split('T')[0] : ''}
                                onChange={e => onInputChange("birthDate", e.target.value)}
                                className="border-2 border-gray-200 focus:border-pink-500 transition-all duration-300 hover:border-pink-300"
                            />
                        ) : (
                            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-gray-100 transition-all duration-300 group-hover:border-pink-200 group-hover:shadow-md">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span className="font-semibold text-gray-800">
                                    {userData.birthDate ? new Date(userData.birthDate).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-3 group">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-green-500" />
                            Email
                            <Badge className="ml-2 bg-orange-100 text-orange-800 text-xs">Cần OTP</Badge>
                        </Label>
                        {isEditing ? (
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    disabled
                                    value={editData.email}
                                    onChange={(e) => onInputChange("email", e.target.value)}
                                    className="border-2 border-gray-200 focus:border-green-500 pl-12 transition-all duration-300 hover:border-green-300"
                                />
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-gray-100 transition-all duration-300 group-hover:border-green-200 group-hover:shadow-md">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span className="font-semibold text-gray-800">{userData.email}</span>
                                {userData.confirmEmail && <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />}
                            </div>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-3 group">
                        <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-purple-500" />
                            Số điện thoại
                        </Label>
                        {isEditing ? (
                            <div className="relative">
                                <Input
                                    id="phoneNumber"
                                    value={editData.phoneNumber}
                                    onChange={(e) => onInputChange("phoneNumber", e.target.value)}
                                    className="border-2 border-gray-200 focus:border-purple-500 pl-12 transition-all duration-300 hover:border-purple-300"
                                    placeholder="0987654321"
                                />
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-gray-100 transition-all duration-300 group-hover:border-purple-200 group-hover:shadow-md">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span className="font-semibold text-gray-800">{userData.phoneNumber}</span>
                            </div>
                        )}
                    </div>

                    {/* Join Date */}
                    <div className="space-y-3 group">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                            Ngày tham gia
                        </Label>
                        <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-gray-100 transition-all duration-300 group-hover:border-indigo-200 group-hover:shadow-md">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-gray-800">
                                {new Date(userData.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Security Tab Component
const SecurityTab = ({ userData, onPasswordChange }) => {
    return (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 via-white to-blue-50 transition-all duration-500 hover:shadow-2xl">
            <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Cài đặt bảo mật
                </h3>

                <div className="space-y-6">
                    {/* Password */}
                    <div className="flex items-center justify-between p-6 bg-white rounded-xl border-2 border-gray-100 transition-all duration-300 hover:border-blue-200 hover:shadow-lg group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-110">
                                <Lock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Mật khẩu</p>
                                <p className="text-sm text-gray-500">Cập nhật lần cuối: 2 tuần trước</p>
                            </div>
                        </div>
                        <Button
                            onClick={onPasswordChange}
                            variant="outline"
                            size="sm"
                            className="transition-all duration-300 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 bg-transparent"
                        >
                            <Key className="w-4 h-4 mr-2" />
                            Đổi mật khẩu
                        </Button>
                    </div>

                    {/* Two Factor Authentication */}
                    <div className="flex items-center justify-between p-6 bg-white rounded-xl border-2 border-gray-100 transition-all duration-300 hover:border-purple-200 hover:shadow-lg group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-purple-200 group-hover:scale-110">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Xác thực 2 bước</p>
                                <p className="text-sm text-gray-500">Bảo vệ tài khoản với OTP qua Email</p>
                            </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Đã kích hoạt
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Main User Profile Modal Component - MODIFIED to accept external control
const UserProfileModal = ({ isOpen, onClose }) => {
    const setPhone = useBookingStore((state) => state.setPhone);
    // User data state
    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        image: "",
        role: "customer",
        status: "",
        confirmEmail: "",
        createdAt: "",
        birthDate: null,
    })

    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({ ...userData })
    const [otpModal, setOtpModal] = useState({ isOpen: false, type: "", value: "" })
    const [passwordModal, setPasswordModal] = useState(false)
    const [imageModal, setImageModal] = useState(false)
    const [pendingChanges, setPendingChanges] = useState({})
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const resDataUser = await getUserProfile()
                console.log("resDataUser", resDataUser);

                if (resDataUser.success) {
                    setUserData(resDataUser.data)
                    setEditData(resDataUser.data)
                }
            } catch (error) {
                console.error("Error fetching user data:", error)
                toast.error("Không thể tải thông tin người dùng")
            }
        }

        if (isOpen) {
            fetchUserData()
        }
    }, [isOpen])

    const handleEdit = () => {
        setIsEditing(true)
        setEditData({ ...userData })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditData({ ...userData })
        setPendingChanges({})
    }

    const handleInputChange = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        const changedFields = {}
        if (editData.fullName !== userData.fullName) {
            if (isValidName(editData.fullName) === false) {
                toast.error("Tên không được chứ số hoặc ký tự đặc biệt")
                setIsSaving(false)
                return
            }
            changedFields.fullName = editData.fullName
        }
        if (editData.phoneNumber !== userData.phoneNumber) {
            // validate phoneNumber
            if (isValidPhone(editData.phoneNumber) === false) {
                toast.error("Số định dạng sđt không đúng, vui lòng nhập lại theo số Việt Nam")
                setIsSaving(false)
                return
            }
            changedFields.phoneNumber = editData.phoneNumber
        }
        if (
            (editData.birthDate && userData.birthDate && new Date(editData.birthDate).toISOString().split('T')[0] !== new Date(userData.birthDate).toISOString().split('T')[0]) ||
            (!editData.birthDate && userData.birthDate) ||
            (editData.birthDate && !userData.birthDate)
        ) {
            changedFields.birthDate = editData.birthDate ? new Date(editData.birthDate) : null
        }

        try {
            if (Object.keys(changedFields).length > 0) {
                const res = await changeUserProfile({ ...userData, ...changedFields })
                            
                if (res.success) {
                    setUserData((prev) => ({ ...prev, ...changedFields }))
                    setPhone(formatPhoneNumber(res?.data?.phoneNumber))
                    toast.success("Cập nhật thông tin người dùng thành công!")
                } else {
                    toast.error("Cập nhật thông tin người dùng không thành công!")
                }
            }

            // Xử lý thay đổi email (cần OTP)
            if (editData.email !== userData.email) {
                toast.error("Không được thay đổi email")
                setIsSaving(false)
                return
            } else {
                setIsEditing(false)
            }

        } catch (error) {
            console.error("Error updating user profile:", error)
            toast.error(error.message || "Cập nhật thông tin người dùng không thành công")
        } finally {
            setIsSaving(false)
        }
    }

    const handleOtpVerify = async () => {
        // Apply email change after OTP verification
        console.log("pendingChanges", pendingChanges);

        const updateEmail = await changeUserProfile({ ...userData, email: pendingChanges.email })
        if (updateEmail.success) {
            setUserData((prev) => ({ ...prev, email: updateEmail.data.email }))
            setIsEditing(false)
            setPendingChanges({})
            toast.success("Đã cập nhật email thành công!")
        }
    }

    const handlePasswordSuccess = () => {
        console.log("Password changed successfully!")
    }

    const handleImageChange = (newImageUrl) => {
        setUserData((prev) => ({ ...prev, image: newImageUrl }))
    }

    const getRoleBadge = (role) => {
        const roleConfig = {
            admin: { label: "Quản trị viên", className: "bg-red-100 text-red-800 border-red-200 animate-pulse" },
            staff: { label: "Nhân viên", className: "bg-blue-100 text-blue-800 border-blue-200" },
            customer: { label: "Khách hàng", className: "bg-green-100 text-green-800 border-green-200" },
        }

        const config = roleConfig[role] || roleConfig.customer
        return <Badge className={`${config.className} transition-all duration-300 hover:scale-105`}>{config.label}</Badge>
    }

    // Reset states when modal closes
    useEffect(() => {
        if (!isOpen) {
            setIsEditing(false)
            setEditData({ ...userData })
            setPendingChanges({})
            setOtpModal({ isOpen: false, type: "", value: "" })
            setPasswordModal(false)
            setImageModal(false)
        }
    }, [isOpen, userData])

    return (
        <>
            {/* Main Modal - controlled by external props */}
            <div className="w-full h-full">
                <div className="flex items-center justify-center space-x-4 animate-fade-in mb-8">
                    <div className="relative group">
                        <Avatar className="w-20 h-20 border-4 border-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:scale-110 shadow-lg">
                            <AvatarImage src={userData?.image || "/placeholder.svg"} alt={userData?.fullName} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                                {userData?.fullName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="sm"
                            onClick={() => setImageModal(true)}
                            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                            <Camera className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="text-left">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                            {userData?.fullName}
                        </h2>
                        <div className="flex items-center space-x-2 mt-2">
                            {getRoleBadge(userData?.role)}
                            {userData?.status && (
                                <Badge className="bg-green-100 text-green-800 border-green-200 transition-all duration-300 hover:scale-105">
                                    <CheckCircle className="w-3 h-3 mr-1 animate-pulse" />
                                    Hoạt động
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-50 to-purple-50">
                        <TabsTrigger
                            value="info"
                            className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                        >
                            Thông tin cơ bản
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                        >
                            Bảo mật
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-6 animate-slide-up">
                        <UserInfoTab
                            userData={userData}
                            editData={editData}
                            isEditing={isEditing}
                            onEdit={handleEdit}
                            onCancel={handleCancel}
                            onSave={handleSave}
                            onInputChange={handleInputChange}
                            isSaving={isSaving}
                        />
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6 animate-slide-up">
                        <SecurityTab userData={userData} onPasswordChange={() => setPasswordModal(true)} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Sub-Modals */}
            <OTPModal
                isOpen={otpModal.isOpen}
                onClose={() => setOtpModal({ isOpen: false, type: "", value: "" })}
                type={otpModal.type}
                value={otpModal.value}
                onVerify={handleOtpVerify}
            />

            <ChangePasswordModal
                isOpen={passwordModal}
                onClose={() => setPasswordModal(false)}
                onSuccess={handlePasswordSuccess}
            />

            <ImageUploadModal
                isOpen={imageModal}
                onClose={() => setImageModal(false)}
                currentImage={userData.image}
                onImageChange={handleImageChange}
                userData={userData}
                setUserData={setUserData}
            />
        </>
    )
}

export default UserProfileModal