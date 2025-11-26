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
import { Loader2 } from "lucide-react"
// import { getBranches } from "../../../services/common/branchService"

export default function UserDialog({ open, onOpenChange, roleOptions, user, onSave, loading, positions }) {
    // State để lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        id: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "customer", // Mặc định là khách hàng
        position: "",
        branchId: "",
        status: "false", // Khởi tạo là chuỗi "false" hoặc "true"
    })

    // Hook useEffect để điền dữ liệu form khi có user hoặc khi dialog mở/đóng
    useEffect(() => {
        if (user) {
            // Nếu có user (chế độ chỉnh sửa), điền dữ liệu của user vào form
            setFormData({
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                position: user?.staff?.position || "", // Đảm bảo giá trị mặc định là chuỗi rỗng nếu không có staff/position
                branchId: user?.staff?.branchId || "", // Đảm bảo giá trị mặc định là chuỗi rỗng nếu không có staff/branchId
                // Chuyển đổi trạng thái boolean của user thành chuỗi "true" hoặc "false"
                status: user.status ? "true" : "false",
            })
        } else {
            // Nếu không có user (chế độ tạo mới), đặt lại form về giá trị mặc định
            setFormData({
                id: "",
                fullName: "",
                email: "",
                phoneNumber: "",
                role: "customer",
                position: "",
                branchId: "",
                status: "false", // Đặt mặc định là chuỗi "false"
            })
        }
    }, [user, open]) // Chạy lại khi user hoặc open thay đổi

    // Xử lý thay đổi cho các trường Input thông thường
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Xử lý thay đổi cho các trường Select
    const handleSelectChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Xử lý khi gửi form
    const handleSubmit = (e) => {
        e.preventDefault()
        // Khi gửi dữ liệu, bạn cần chuyển đổi lại status từ chuỗi thành boolean
        const dataToSave = {
            ...formData,
            status: formData.status === "true", // Chuyển "true" thành true, "false" thành false
        };
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
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="col-span-3"
                                required // Yêu cầu nhập
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className={`text-right ${!user ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}`}>
                                Vai trò
                            </Label>
                            <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.map(([label, value]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Hiển thị các trường dành riêng cho nhân viên nếu vai trò là "staff" */}
                        {formData.role === "staff" && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="position" className={`text-right ${!user ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}`}>
                                        Chức vụ
                                    </Label>
                                    <Select value={formData.position} onValueChange={(value) => handleSelectChange("position", value)}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Chọn chức vụ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {positions.filter(value => value !== "serviceStaff").map((value) => ( // Lọc "serviceStaff" trước khi map
                                                <SelectItem key={value} value={value}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
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
                            // Có thể thêm nút "Cập nhật người dùng" ở đây nếu muốn
                            ""
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