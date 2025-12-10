"use client"

import { useState } from "react"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UserDialog from "./UserDialog"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import DeleteConfirmDialog from "./DeleteConfirmDialog"
import { ToastContainer, toast } from "react-toastify"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { addUser, deleteUserById, getAllRole, getAllUsers, updateUser } from "../../../services/admin/userService"

import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { isValidEmail, isValidName, isValidPhone } from "../../../utils/validation"

const USERS_PER_PAGE = 10

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)

  const qc = useQueryClient()

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  })

  const { data: roles = {} } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRole,
  })

  const roleOptions = Object.entries(roles || {})

  const currentId = jwtDecode(Cookies.get("render_id"))?.userId

  const createUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => qc.invalidateQueries(["users"]),
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => qc.invalidateQueries(["users"]),
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserById,
    onSuccess: () => qc.invalidateQueries(["users"]),
  })

  const filteredUsers = users
    ?.filter((user) => {
      const matchesSearch =
        user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.status === true) ||
        (statusFilter === "locked" && user.status === false)

      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName)
      }
      if (sortField === "email") {
        return sortDirection === "asc" ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)
      }
      if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      }
      return 0
    })

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  )

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleCreateUser = () => {
    setCurrentUser(null)
    setIsUserDialogOpen(true)
  }

  const handleEditUser = (user) => {
    setCurrentUser(user)
    setIsUserDialogOpen(true)
  }

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    await deleteUserMutation.mutateAsync(userToDelete._id)
    setIsDeleteDialogOpen(false)
    toast.success("Xóa người dùng thành công")
  }

  const handleSaveUser = async (data) => {
    if (!data.fullName || !data.email || !data.phoneNumber) {
      toast.error("Vui lòng điền đầy đủ trường")
      return
    }

    if (!isValidPhone(data.phoneNumber)) return toast.error("Số điện thoại không hợp lệ")
    if (!isValidEmail(data.email)) return toast.error("Email không hợp lệ")
    if (!isValidName(data.fullName)) return toast.error("Tên không hợp lệ")

    try {
      // Update
      if (data.id) {
        await updateUserMutation.mutateAsync({ id: data.id, data })
        toast.success("Cập nhật thành công")
      }
      // Create
      else {
        // Validate password for admin role
        if (data.role === "admin" && !data.password) {
          toast.error("Mật khẩu là bắt buộc cho tài khoản admin")
          return
        }
        
        await createUserMutation.mutateAsync(data)
        toast.success("Tạo người dùng thành công")
      }

      setIsUserDialogOpen(false)
    } catch (error) {
      // Handle backend validation errors
      const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra"
      toast.error(errorMessage)
    }
  }

  const toggleUserStatus = async (id) => {
    const user = users.find((u) => u._id === id)
    await updateUserMutation.mutateAsync({ id, data: { status: !user.status } })
    toast.success("Đổi trạng thái thành công")
  }

  const changeUserRole = async (id, newRole) => {
    await updateUserMutation.mutateAsync({ id, data: { role: newRole } })
    toast.success("Đã cập nhật vai trò")
  }

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "staff":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="space-y-4">
      <ToastContainer />

      <Card>
        <CardContent className="p-6">
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  {roleOptions.map(([key, role]) => (
                    <SelectItem key={key} value={role.name} className="capitalize">
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="locked">Bị khóa</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleCreateUser}>
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                    Tên {sortField === "name" && (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
                  </TableHead>

                  <TableHead onClick={() => handleSort("email")} className="cursor-pointer">
                    Email {sortField === "email" && (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
                  </TableHead>

                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>

                  <TableHead onClick={() => handleSort("createdAt")} className="cursor-pointer">
                    Ngày tạo {sortField === "createdAt" && (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
                  </TableHead>

                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Không tìm thấy người dùng.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell>{u.fullName}</TableCell>
                      <TableCell>{u.email}</TableCell>

                      <TableCell>
                        <Badge className={`${getRoleBadgeColor(u.role)} capitalize`}>{u.role}</Badge>
                      </TableCell>

                      <TableCell>
                        {u.status ? (
                          <Badge className="bg-emerald-100 text-emerald-800">Hoạt động</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Bị khóa</Badge>
                        )}
                      </TableCell>

                      <TableCell>{formatDate(u.createdAt)}</TableCell>

                      {u._id !== currentId && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(u)}>
                                <PenSquare className="mr-2 h-4 w-4" />
                                Chi tiết
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem onClick={() => toggleUserStatus(u._id)}>
                                {u.status ? (
                                  <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Khóa
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="mr-2 h-4 w-4" />
                                    Mở khóa
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenu>
                                <DropdownMenuTrigger className="px-2 py-1.5 text-sm flex gap-2">
                                  <Users className="mr-2 h-4 w-4" />
                                  Đổi vai trò
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {roleOptions.map(([k, r]) => (
                                    <DropdownMenuItem key={k} onClick={() => changeUserRole(u._id, r.name)}>
                                      Đặt làm {r.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteUser(u)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between">
            <div className="text-sm block w-[100px]">
              Hiển thị <b>{paginatedUsers.length}</b> / <b>{users.length}</b>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      className={currentPage === i + 1 ? "bg-primary text-white" : ""}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* User Dialog */}
      <UserDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        user={currentUser}
        roleOptions={roleOptions}
        onSave={handleSaveUser}
      />

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        user={userToDelete}
      />
    </div>
  )
}