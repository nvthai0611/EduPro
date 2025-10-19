"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye, Settings, Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addNewSetting, getAllSetting, updateSetting } from "../../../services/admin/settingService"
import { toast } from "react-toastify"

// Fake data
const initialSettings = [
    {
        _id: "1",
        key: "email_notifications",
        enabled: true,
        description: "Enable email notifications for important updates",
        updatedAt: new Date("2024-01-15T10:30:00Z"),
    },
    {
        _id: "2",
        key: "maintenance_mode",
        enabled: false,
        description: "Put the application in maintenance mode",
        updatedAt: new Date("2024-01-14T15:45:00Z"),
    },
    {
        _id: "3",
        key: "user_registration",
        enabled: true,
        description: "Allow new users to register accounts",
        updatedAt: new Date("2024-01-13T09:20:00Z"),
    },
    {
        _id: "4",
        key: "debug_mode",
        enabled: false,
        description: "Enable debug mode for development",
        updatedAt: new Date("2024-01-12T14:10:00Z"),
    },
    {
        _id: "5",
        key: "auto_backup",
        enabled: true,
        description: "Automatically backup data every 24 hours",
        updatedAt: new Date("2024-01-11T08:00:00Z"),
    },
]

export default function SettingsManagement() {
    const [settings, setSettings] = useState([])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [selectedSetting, setSelectedSetting] = useState(null)
    const [formData, setFormData] = useState({
        key: "",
        enabled: false,
        description: "",
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        const fetchData = async () => {
            const resData = await getAllSetting()
            console.log("resData", resData.data);

            if (resData.success) {
                setSettings(resData.data)
            }
        }
        fetchData()
    }, [])
    const resetForm = () => {
        setFormData({
            key: "",
            enabled: false,
            description: "",
        })
    }

    const handleAdd = async () => {
        if (!formData.key.trim()) {
            toast.error("Vui lòng nhập key")
        }
        const newSetting = {
            ...formData,
        }
        const resAddNewSetting = await addNewSetting(newSetting)
        if (!resAddNewSetting.success) {
            toast.error(resAddNewSetting.message)
            return
        }

        setSettings([...settings, newSetting])
        setIsAddDialogOpen(false)
        resetForm()
        toast.success("Thêm setting thành công")
    }

    const handleEdit = async () => {
        if (!formData.key.trim()) {
            toast.error("Vui lòng nhập key")
            return
        }

        const resUpdateSetting = await updateSetting(selectedSetting._id, formData)
        if (!resUpdateSetting.success) {
            toast.error(resUpdateSetting.message)
            return
        }

        setSettings(
            settings.map((setting) =>
                setting._id === selectedSetting._id ? { ...setting, ...formData, updatedAt: new Date() } : setting,
            ),
        )
        setIsEditDialogOpen(false)
        setSelectedSetting(null)
        resetForm()
        toast.success("Chỉnh sửa setting thành công")
    }

    const handleDelete = async (settingToDelete) => {
        const resDeleteSetting = await deleteSetting(settingToDelete._id)
        if (!resDeleteSetting.success) {
            toast.error(resDeleteSetting.message)
            return
        }
        setSettings(settings.filter((setting) => setting._id !== settingToDelete._id))
        toast.success("Xóa setting thông")
    }

    const openEditDialog = (setting) => {
        setSelectedSetting(setting)
        setFormData({
            key: setting.key,
            enabled: setting.enabled,
            description: setting.description,
        })
        setIsEditDialogOpen(true)
    }

    const openDetailDialog = (setting) => {
        setSelectedSetting(setting)
        setIsDetailDialogOpen(true)
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString("vi-VN")
    }

    const filteredSettings = settings?.filter((setting) => {
        const matchesSearch =
            setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            setting.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "enabled" && setting.enabled) ||
            (statusFilter === "disabled" && !setting.enabled)

        return matchesSearch && matchesStatus
    })

    const clearFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Settings className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Quản lý Settings</h1>
                        <p className="text-muted-foreground">Quản lý các cài đặt hệ thống</p>
                    </div>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm Setting
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm Setting Mới</DialogTitle>
                            <DialogDescription>Tạo một setting mới cho hệ thống</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="key">Key *</Label>
                                <Input
                                    id="key"
                                    placeholder="Nhập key setting"
                                    value={formData.key}
                                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="enabled"
                                    checked={formData.enabled}
                                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                                />
                                <Label htmlFor="enabled">Kích hoạt</Label>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Nhập mô tả setting"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleAdd}>Thêm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Settings</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredSettings.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {filteredSettings.length !== settings.length && `(${settings.length} tổng cộng)`}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã Kích Hoạt</CardTitle>
                        <div className="h-4 w-4 bg-green-500 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{filteredSettings.filter((s) => s.enabled).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chưa Kích Hoạt</CardTitle>
                        <div className="h-4 w-4 bg-gray-400 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{filteredSettings.filter((s) => !s.enabled).length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Tìm kiếm theo key hoặc mô tả..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Lọc theo trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="enabled">Đã kích hoạt</SelectItem>
                                    <SelectItem value="disabled">Chưa kích hoạt</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            {(searchTerm || statusFilter !== "all") && (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    <X className="h-4 w-4 mr-2" />
                                    Xóa bộ lọc
                                </Button>
                            )}
                            <div className="text-sm text-muted-foreground">
                                {filteredSettings.length} / {settings.length} kết quả
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Settings Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Settings</CardTitle>
                    <CardDescription>Quản lý tất cả các settings của hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Cập nhật lần cuối</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSettings.length > 0 ? (
                                filteredSettings.map((setting) => (
                                    <TableRow key={setting._id}>
                                        <TableCell className="font-medium">{setting.key}</TableCell>
                                        <TableCell>
                                            <Badge variant={setting.enabled ? "default" : "secondary"}>
                                                {setting.enabled ? "Kích hoạt" : "Tắt"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">{setting.description || "Không có mô tả"}</TableCell>
                                        <TableCell>{formatDate(setting.updatedAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => openDetailDialog(setting)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(setting)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bạn có chắc chắn muốn xóa setting "{setting.key}"? Hành động này không thể hoàn tác.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(setting)}>Xóa</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">Không tìm thấy settings nào</p>
                                            {(searchTerm || statusFilter !== "all") && (
                                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                                    Xóa bộ lọc
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa Setting</DialogTitle>
                        <DialogDescription>Cập nhật thông tin setting</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-key">Key *</Label>
                            <Input
                                id="edit-key"
                                placeholder="Nhập key setting"
                                value={formData.key}
                                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="edit-enabled"
                                checked={formData.enabled}
                                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                            />
                            <Label htmlFor="edit-enabled">Kích hoạt</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Mô tả</Label>
                            <Textarea
                                id="edit-description"
                                placeholder="Nhập mô tả setting"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleEdit}>Cập nhật</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết Setting</DialogTitle>
                        <DialogDescription>Thông tin chi tiết của setting</DialogDescription>
                    </DialogHeader>
                    {selectedSetting && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                                    <p className="text-sm">{selectedSetting._id}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Key</Label>
                                    <p className="text-sm font-medium">{selectedSetting.key}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
                                <div className="mt-1">
                                    <Badge variant={selectedSetting.enabled ? "default" : "secondary"}>
                                        {selectedSetting.enabled ? "Kích hoạt" : "Tắt"}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Mô tả</Label>
                                <p className="text-sm mt-1">{selectedSetting.description || "Không có mô tả"}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</Label>
                                <p className="text-sm">{formatDate(selectedSetting.updatedAt)}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
