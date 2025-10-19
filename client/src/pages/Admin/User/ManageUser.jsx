"use client"

import { useEffect, useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Lock,
  MoreHorizontal,
  PenSquare,
  Plus,
  Search,
  Trash2,
  Unlock,
  Users,
} from "lucide-react" // Các icon từ thư viện lucide-react

import { Button } from "@/components/ui/button" // Nút bấm
import { Card, CardContent } from "@/components/ui/card" // Thẻ chứa nội dung
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Menu thả xuống
import { Input } from "@/components/ui/input" // Ô nhập liệu
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Thanh chọn
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" // Bảng
import UserDialog from "./UserDialog" // Dialog để thêm/sửa người dùng
import { Badge } from "@/components/ui/badge" // Huy hiệu/nhãn trạng thái
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination" // Phân trang
import DeleteConfirmDialog from "./DeleteConfirmDialog" // Dialog xác nhận xóa
import { ToastContainer, toast } from 'react-toastify'; // Thư viện hiển thị thông báo toast
import {
  addUser,
  deleteUserById,
  getAllRole,
  getAllUsers,
  updateUser
} from '../../../services/admin/userService' // Các API liên quan đến người dùng
import { isValidEmail, isValidName, isValidPhone } from "../../../utils/validation" // Các hàm kiểm tra dữ liệu
import { getAllPositions } from "../../../services/commonService" // API lấy tất cả vị trí

const USERS_PER_PAGE = 10; // Số người dùng hiển thị trên mỗi trang
export default function UserManagement() {
  // State để lưu trữ danh sách người dùng
  const [users, setUsers] = useState([])
  // State cho thanh tìm kiếm
  const [searchTerm, setSearchTerm] = useState("")
  // State cho bộ lọc vai trò
  const [roleFilter, setRoleFilter] = useState("all")
  // State cho các tùy chọn vai trò (lấy từ API)
  const [roleOptions, setRoleOptions] = useState([])
  // State cho bộ lọc trạng thái
  const [statusFilter, setStatusFilter] = useState("all")
  // State cho trường sắp xếp
  const [sortField, setSortField] = useState("")
  // State cho hướng sắp xếp ('asc' - tăng dần, 'desc' - giảm dần)
  const [sortDirection, setSortDirection] = useState("asc")
  // State để điều khiển việc mở/đóng UserDialog
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  // State để lưu trữ thông tin người dùng hiện tại (khi sửa)
  const [currentUser, setCurrentUser] = useState(null)
  // State để điều khiển việc mở/đóng DeleteConfirmDialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  // State để lưu trữ người dùng cần xóa
  const [userToDelete, setUserToDelete] = useState(null)
  // State cho trạng thái tải (loading)
  const [loading, setLoading] = useState(false)
  // State để lưu trữ danh sách vị trí (Position)
  const [position, setPosition] = useState([]);
  // State để kích hoạt lại useEffect sau khi gửi form
  const [submited, setSubmited] = useState(false);

  // useEffect để lấy dữ liệu người dùng, vai trò và vị trí khi component được mount hoặc khi `submited` thay đổi
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers() // Gọi API lấy tất cả người dùng
        const roleResponse = await getAllRole(); // Gọi API lấy tất cả vai trò
        const positionResponse = await getAllPositions(); // Gọi API lấy tất cả vị trí

        if (response?.data.success == true) {
          setUsers(response?.data.data) // Cập nhật state `users`
        }
        if (roleResponse?.data.success) {
          // Chuyển đổi đối tượng vai trò thành mảng các cặp [label, value]
          setRoleOptions(Object.entries(roleResponse?.data.data[0]));
          // Ví dụ: roleResponse?.data.data[0] = { "CUSTOMER": "customer", "STAFF": "staff" }
          // setRoleOptions sẽ là: [["CUSTOMER", "customer"], ["STAFF", "staff"], ...]
        }
        if (positionResponse?.success) {
          setPosition(positionResponse.data) // Cập nhật state `position`
        }
      } catch (error) {
        console.log(error); // Ghi lỗi ra console
      }
    }
    fetchUsers() // Gọi hàm fetchUsers
  }, [submited]) // Dependencies: chạy lại khi `submited` thay đổi

  // Lọc và sắp xếp người dùng dựa trên `searchTerm`, `roleFilter`, `statusFilter`, `sortField`, `sortDirection`
  const filteredUsers = users
    .filter((user) => {
      // Tìm kiếm theo tên hoặc email
      const matchesSearch =
        user?.fullName.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        user?.email.toLowerCase().includes(searchTerm?.toLowerCase())
      // Lọc theo vai trò
      const matchesRole = roleFilter === "all" || user?.role === roleFilter
      // Lọc theo trạng thái
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && user?.status === true) ||
        (statusFilter === "locked" && user?.status === false)
      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      // Sắp xếp theo tên
      if (sortField === "name") {
        return sortDirection === "asc" ? a?.fullName.localeCompare(b.fullName) : b?.fullName.localeCompare(a.fullName)
      }
      // Sắp xếp theo email
      else if (sortField === "email") {
        return sortDirection === "asc" ? a?.email.localeCompare(b.email) : b?.email.localeCompare(a.email)
      }
      // Sắp xếp theo thời gian tạo (createdAt)
      else if (sortField === "lastLogin") { // "lastLogin" thực chất là "createdAt" trong code này
        return sortDirection === "asc"
          ? new Date(a?.createdAt) - new Date(b?.createdAt)
          : new Date(b?.createdAt) - new Date(a?.createdAt)
      }
      return 0 // Không sắp xếp
    })


  // State và logic phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE); // Tổng số trang

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  ); // Danh sách người dùng của trang hiện tại

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Xử lý sắp xếp cột
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc") // Đảo ngược hướng sắp xếp nếu cùng trường
    } else {
      setSortField(field) // Đặt trường sắp xếp mới
      setSortDirection("asc") // Mặc định sắp xếp tăng dần
    }
  }

  // Mở dialog tạo người dùng mới
  const handleCreateUser = () => {
    setCurrentUser(null) // Đặt currentUser về null để biết là tạo mới
    setIsUserDialogOpen(true) // Mở dialog
  }

  // Mở dialog sửa người dùng
  const handleEditUser = (user) => {
    setCurrentUser(user) // Đặt người dùng hiện tại để sửa
    setIsUserDialogOpen(true) // Mở dialog
  }

  // Mở dialog xác nhận xóa người dùng
  const handleDeleteUser = (user) => {
    setUserToDelete(user) // Đặt người dùng cần xóa
    setIsDeleteDialogOpen(true) // Mở dialog xác nhận
  }

  // Xác nhận và thực hiện xóa người dùng
  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        const response = await deleteUserById(userToDelete?.id) // Gọi API xóa người dùng
        if (response?.data.success) {
          setUsers(users.filter((user) => user?.id !== userToDelete?.id)) // Cập nhật danh sách người dùng sau khi xóa
          setIsDeleteDialogOpen(false) // Đóng dialog
          setUserToDelete(null) // Xóa người dùng khỏi state
          toast.success("Người dùng đã được xóa thành công"); // Hiển thị thông báo thành công
        }
        else {
          toast.error(response?.data.message); // Hiển thị thông báo lỗi từ server
        }
      } catch (error) {
        console.error("Lỗi xóa người dùng:", error.message); // Ghi lỗi ra console
        toast.error("Đã xảy ra lỗi khi xóa người dùng."); // Thông báo lỗi chung
      }
    }
  }

  // Xử lý lưu (thêm mới hoặc cập nhật) người dùng
  const handleSaveUser = async (userData) => {
    try {
      // Kiểm tra dữ liệu người dùng
      if (!userData?.fullName || !userData?.email || !userData?.phoneNumber) {
        toast.error("Vui lòng điền đầy đủ tất cả các trường", {
          style: {
            backgroundColor: "#f0f4ff",
            color: "#1e3a8a",
          },
          duration: 2000,
        });
        return
      }
      // Kiểm tra số điện thoại hợp lệ
      if (!isValidPhone(userData?.phoneNumber)) {
        toast.error("Số điện thoại phải có ít nhất 10 chữ số và là số điện thoại Việt Nam", {
          style: {
            backgroundColor: "#f0f4ff",
            color: "#1e3a8a",
          },
          duration: 2000,
        });
        return
      }
      // Kiểm tra email hợp lệ
      if (!isValidEmail(userData?.email)) {
        toast.error("Email không hợp lệ", {
          style: {
            backgroundColor: "#f0f4ff",
            color: "#1e3a8a",
          },
          duration: 2000,
        });
        return
      }
      // Kiểm tra tên không chứa số hoặc ký tự đặc biệt
      if (isValidName(userData?.fullName) == false) {
        toast.error("Tên không hợp lệ và không được chứa ký tự đặc biệt hoặc số", {
          style: {
            backgroundColor: "#f0f4ff",
            color: "#1e3a8a",
          },
          duration: 2000,
        });
        return
      }

      setLoading(true) // Bắt đầu trạng thái loading

      // Cập nhật người dùng hiện có
      if (userData?.id) {
        const updatedUser = await updateUser(userData?.id, userData) // Gọi API cập nhật
        setLoading(false) // Kết thúc loading
        if (updatedUser?.data.success == true) {
          toast.success(updatedUser?.data.message, { // Thông báo thành công
            style: {
              backgroundColor: "#f0f4ff",
              color: "#1e3a8a",
            },
            duration: 2000,
          });
          setIsUserDialogOpen(false) // Đóng dialog
          // Cập nhật người dùng trong danh sách `users`
          setUsers(users?.map((user) => (user?.id === userData?.id ? { ...user, ...updatedUser?.data.data } : user)))
        } else {
          toast.error(updatedUser?.data.message, { // Thông báo lỗi
            style: {
              backgroundColor: "#f0f4ff",
              color: "#1e3a8a",
            },
            duration: 2000,
          });
        }
      }
      // Tạo người dùng mới
      else {
        const createUser = await addUser(userData) // Gọi API thêm người dùng
        setLoading(false) // Kết thúc loading
        if (createUser.data.success == true) {
          toast.success(createUser?.data.message, { // Thông báo thành công
            style: {
              backgroundColor: "#f0f4ff",
              color: "#1e3a8a",
            },
            duration: 2000,
          });
          setIsUserDialogOpen(false) // Đóng dialog
          setUsers([...users, createUser?.data.data]) // Thêm người dùng mới vào danh sách
        } else {
          toast.error(createUser?.data.message, { // Thông báo lỗi
            style: {
              backgroundColor: "#f0f4ff",
              color: "#1e3a8a",
            },
            duration: 2000,
          });
        }
      }
    } catch (error) {
      console.log(error) // Ghi lỗi ra console
      setLoading(false) // Kết thúc loading
      toast.error("Đã xảy ra lỗi khi lưu người dùng.", { // Thông báo lỗi chung
        style: {
          backgroundColor: "#f0f4ff",
          color: "#1e3a8a",
        },
        duration: 2000,
      });
    }
  }

  // Chuyển đổi trạng thái hoạt động/khóa của người dùng
  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find((user) => user?.id === userId) // Tìm người dùng theo ID
      if (!user) return // Nếu không tìm thấy, thoát
      const changeStatus = await updateUser(userId, { status: !user.status }) // Gọi API cập nhật trạng thái
      if (changeStatus?.data.success == true) {
        toast.success(changeStatus?.data.message, { // Thông báo thành công
          style: {
            backgroundColor: "#f0f4ff",
            color: "#1e3a8a",
          },
          duration: 2000,
        });
        setUsers(users?.map((user) => (user?.id === userId ? { ...user, status: !user?.status } : user))) // Cập nhật trạng thái trong state
      }
    } catch (error) {
      console.log(error) // Ghi lỗi ra console
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái người dùng", { // Thông báo lỗi chung
        style: {
          backgroundColor: "#f0f4ff",
          color: "#1e3a8a",
        },
        duration: 2000,
      });
    }
  }

  // Thay đổi vai trò của người dùng
  const changeUserRole = async (userId, newRole) => {
    try {
      const user = users?.find((user) => user?.id === userId) // Tìm người dùng theo ID
      if (user?.role === 'admin' && newRole === 'admin') {
        toast.error("Vai trò quản trị viên không thể thay đổi thành quản trị viên", {
          style: {
            backgroundColor: "#f0f4ff",
            color: "#1e3a8a",
          },
          duration: 2000,
        });
        return
      }
      const updateRole = await updateUser(userId, { role: newRole }) // Gọi API cập nhật vai trò
      if (updateRole?.data.success == true) {
        toast.success(updateRole?.data.message, { // Thông báo thành công
          style: {
            backgroundColor: "#f0f4ff",
            color: "#1e3a8a",
          },
          duration: 2000,
        });
        setUsers(users?.map((user) => (user?.id === userId ? { ...user, role: newRole } : user))) // Cập nhật vai trò trong state
      }
    } catch (error) {
      console.log(error) // Ghi lỗi ra console
      toast.error("Đã xảy ra lỗi khi cập nhật vai trò người dùng", { // Thông báo lỗi chung
        style: {
          backgroundColor: "#f0f4ff",
          color: "#1e3a8a",
        },
        duration: 2000,
      });
    }
  }

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    if (dateString === "-") return "-"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Lấy màu huy hiệu (badge) dựa trên vai trò
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "staff":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "customer":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {/* Container cho các thông báo Toast */}
      <ToastContainer position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            {/* Thanh tìm kiếm */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm người dùng..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Bộ lọc và nút Thêm người dùng */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Bộ lọc theo vai trò */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Lọc theo vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  {roleOptions.map(([label, value]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Bộ lọc theo trạng thái */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="locked">Bị khóa</SelectItem>
                </SelectContent>
              </Select>
              {/* Nút Thêm người dùng */}
              <Button onClick={handleCreateUser} className="gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Thêm người dùng</span>
              </Button>
            </div>
          </div>

          {/* Bảng quản lý người dùng */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Cột Tên (có thể sắp xếp) */}
                  <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Tên
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  {/* Cột Email (có thể sắp xếp) */}
                  <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                    <div className="flex items-center">
                      Email
                      {sortField === "email" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  {/* Cột Ngày tạo (có thể sắp xếp) */}
                  <TableHead className="cursor-pointer" onClick={() => handleSort("lastLogin")}>
                    <div className="flex items-center">
                      Ngày tạo
                      {sortField === "lastLogin" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Không tìm thấy người dùng nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user?.id}>
                      <TableCell className="font-medium">{user?.fullName}</TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleBadgeColor(user?.role)} capitalize`}>{user?.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {user?.status === true ? (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Hoạt động</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Bị khóa</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user?.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        {/* Menu hành động cho từng người dùng */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <PenSquare className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleUserStatus(user?.id)}>
                              {user?.status === true ? (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Khóa tài khoản
                                </>
                              ) : (
                                <>
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Mở khóa tài khoản
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/* Dropdown con để thay đổi vai trò */}
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex items-center w-full px-2 py-1.5 text-sm">
                                <Users className="mr-2 h-4 w-4" />
                                Thay đổi vai trò
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => changeUserRole(user?.id, "admin")}
                                  disabled={user?.role === "admin"}
                                >
                                  Đặt làm Quản trị viên
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => changeUserRole(user?.id, "staff")}
                                  disabled={user?.role === "staff"}
                                >
                                  Đặt làm Nhân viên
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => changeUserRole(user?.id, "customer")}
                                  disabled={user?.role === "customer"}
                                >
                                  Đặt làm Khách hàng
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Thanh phân trang */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị <strong>{paginatedUsers?.length}</strong> trên tổng số <strong>{users?.length}</strong> người dùng
            </div>
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        className={page === currentPage ? "bg-primary text-white" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Dialog thêm/sửa người dùng */}
      <UserDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        user={currentUser}
        roleOptions={roleOptions}
        onSave={handleSaveUser}
        loading={loading}
        positions={position}
      />

      {/* Dialog xác nhận xóa */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        user={userToDelete}
      />
    </div>
  )
}