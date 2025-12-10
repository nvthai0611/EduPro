"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { isValidPassword } from "../../../utils/validation"
// import { getBranches } from "../../../services/common/branchService"

export default function UserDialog({ open, onOpenChange, roleOptions, user, onSave, loading }) {
    // State để lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        id: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "customer", // Mặc định là khách hàng
        status: "false", // Khởi tạo là chuỗi "false" hoặc "true"
        password: "",
        confirmPassword: "",
    })

    // State để quản lý hiển thị password
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState("")

    // Hook useEffect để điền dữ liệu form khi có user hoặc khi dialog mở/đóng
    useEffect(() => {
        if (user) {
            // Nếu có user (chế độ chỉnh sửa), điền dữ liệu của user vào form
            setFormData({
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                // Chuyển đổi trạng thái boolean của user thành chuỗi "true" hoặc "false"
                status: user.status ? "true" : "false",
                password: "",
                confirmPassword: "",
            })
        } else {
            // Nếu không có user (chế độ tạo mới), đặt lại form về giá trị mặc định
            setFormData({
                id: "",
                fullName: "",
                email: "",
                phoneNumber: "",
                role: "customer",
                status: "false", // Đặt mặc định là chuỗi "false"
                password: "",
                confirmPassword: "",
            })
        }
        setPasswordError("")
        setShowPassword(false)
        setShowConfirmPassword(false)
    }, [user, open]) // Chạy lại khi user hoặc open thay đổi

    // Validate password strength
    const validatePassword = (password) => {
        const result = isValidPassword(password)
        return result.message
    }

    // Xử lý thay đổi cho các trường Input thông thường
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        
        // Validate password khi nhập
        if (name === "password" && value) {
            setPasswordError(validatePassword(value))
        } else if (name === "password" && !value) {
            setPasswordError("")
        }
    }

    // Xử lý thay đổi cho các trường Select
    const handleSelectChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Xử lý khi gửi form
    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Validate password nếu đang tạo admin mới
        if (!user && formData.role === "admin") {
            if (!formData.password) {
                setPasswordError("Mật khẩu là bắt buộc cho tài khoản admin")
                return
            }
            const passwordValidation = validatePassword(formData.password)
            if (passwordValidation) {
                setPasswordError(passwordValidation)
                return
            }
            if (formData.password !== formData.confirmPassword) {
                setPasswordError("Mật khẩu xác nhận không khớp")
                return
            }
        }
        
        // Khi gửi dữ liệu, bạn cần chuyển đổi lại status từ chuỗi thành boolean
        const dataToSave = {
            ...formData,
            status: formData.status === "true", // Chuyển "true" thành true, "false" thành false
        }
        
        // Không gửi confirmPassword lên server
        delete dataToSave.confirmPassword
        
        // Không gửi password rỗng khi update user
        if (user && !dataToSave.password) {
            delete dataToSave.password
        }
        
        // Không gửi password cho customer
        if (dataToSave.role !== "admin") {
            delete dataToSave.password
        }
        
        onSave(dataToSave) // Gọi hàm onSave được truyền từ component cha
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{user ? "Chi tiết người dùng" : "Tạo người dùng mới"}</DialogTitle>
                        <DialogDescription>
                            {user ? "Thông tin chi tiết và quyền hạn của người dùng." : "Điền thông tin để tạo người dùng mới."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullName" className={`text-right ${!user ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}`}>
                                Tên đầy đủ
                            </Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="col-span-3"
                                required // Yêu cầu nhập
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className={`text-right ${!user ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}`}>
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                disabled={!!user} // Vô hiệu hóa nếu đang ở chế độ chỉnh sửa user hiện có
                                value={formData.email}
                                onChange={handleChange}
                                className="col-span-3"
                                required // Yêu cầu nhập
                            />
                            <p className="text-center text-xs text-gray-500 col-span-4">
                                {user ? "Email không thể thay đổi." : "Email sẽ được sử dụng để đăng nhập."}
                            </p>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className={`text-right ${!user ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}`}>
                                Điện thoại
                            </Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text" // Đổi thành text để tránh vấn đề với số 0 đầu tiên
                                value={formData.phoneNumber || ""}
                                onChange={handleChange}
                                className="col-span-3"
                                required // Yêu cầu nhập
                            />
                        </div>
                        
                        {/* Hiển thị trường password khi tạo admin mới */}
                        {!user && formData.role === "admin" && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="password" className="text-right after:content-['*'] after:ml-1 after:text-red-500">
                                        Mật khẩu
                                    </Label>
                                    <div className="col-span-3 relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="pr-10"
                                            autoComplete="new-password"
                                            placeholder="Nhập mật khẩu"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {passwordError && (
                                        <p className="col-span-4 text-right text-xs text-red-500">{passwordError}</p>
                                    )}
                                    <p className="col-span-4 text-right text-xs text-gray-500">
                                        Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="confirmPassword" className="text-right after:content-['*'] after:ml-1 after:text-red-500">
                                        Xác nhận
                                    </Label>
                                    <div className="col-span-3 relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="pr-10"
                                            autoComplete="new-password"
                                            placeholder="Nhập lại mật khẩu"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className={`text-right ${!user ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}`}>
                                Vai trò
                            </Label>
                            <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.map((role) => (
                                        <SelectItem key={role[1].name} value={role[1].name} className="capitalize">
                                            <span className="capitalize">{role[1].name}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Hiển thị trường trạng thái nếu đang chỉnh sửa user hiện có */}
                        {user && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Trạng thái
                                </Label>
                                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        {/* Đảm bảo value là chuỗi */}
                                        <SelectItem value="true">Hoạt động</SelectItem>
                                        <SelectItem value="false">Khóa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {/* Nút "Tạo người dùng" chỉ hiển thị khi không có user (chế độ tạo mới) */}
                        {user ? (
                         <Button disabled={loading} type="submit">
                                Cập nhật người dùng
                                {loading && <Loader2 className="animate-spin ml-2" />}
                            </Button>
                        ) : (
                            <Button disabled={loading} type="submit">
                                Tạo người dùng
                                {loading && <Loader2 className="animate-spin ml-2" />}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}