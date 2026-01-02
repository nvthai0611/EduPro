"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Search, Eye, Edit, X, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addNewSetting, updateSetting, deleteSetting } from "../../../../services/admin/settingService"
import { toast } from "react-toastify"
import SettingDetailDialog from "./SettingDetailDialog"

const CATEGORIES = [
    { value: 'general', label: 'General' },
    { value: 'homepage', label: 'Homepage' },
    { value: 'appearance', label: 'Appearance' },
    { value: 'system', label: 'System' },
    { value: 'email', label: 'Email' },
    { value: 'payment', label: 'Payment' },
    { value: 'security', label: 'Security' },
    { value: 'other', label: 'Other' }
]

const getCategoryColor = (category) => {
    const colors = {
        general: 'bg-blue-100 text-blue-800',
        homepage: 'bg-purple-100 text-purple-800',
        appearance: 'bg-pink-100 text-pink-800',
        system: 'bg-gray-100 text-gray-800',
        email: 'bg-green-100 text-green-800',
        payment: 'bg-yellow-100 text-yellow-800',
        security: 'bg-red-100 text-red-800',
        other: 'bg-indigo-100 text-indigo-800'
    }
    return colors[category] || colors.other
}

export default function SettingsTable({ settings, setSettings }) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [selectedSetting, setSelectedSetting] = useState(null)
    const [formData, setFormData] = useState({
        key: "",
        name: "",
        description: "",
        category: "general",
        enabled: true,
        value: "",
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const resetForm = () => {
        setFormData({
            key: "",
            name: "",
            description: "",
            category: "general",
            enabled: true,
            value: "",
        })
    }

    const handleAdd = async () => {
        if (!formData.key.trim()) {
            toast.error("Vui lòng nhập key setting")
            return
        }
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên setting")
            return
        }
        
        try {
            const dataToSend = {
                ...formData,
                value: formData.value ? (
                    formData.value.startsWith('{') || formData.value.startsWith('[') 
                        ? JSON.parse(formData.value) 
                        : formData.value
                ) : null
            }
            
            const res = await addNewSetting(dataToSend)
            if (!res.success) {
                toast.error(res.message || "Không thể thêm setting")
                return
            }
            setSettings([...settings, res.data])
            setIsAddDialogOpen(false)
            resetForm()
            toast.success("Thêm setting thành công")
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra")
        }
    }

    const handleEdit = async () => {
        if (!formData.key.trim()) {
            toast.error("Vui lòng nhập key setting")
            return
        }
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên setting")
            return
        }
        
        try {
            const dataToSend = {
                ...formData,
                value: formData.value ? (
                    typeof formData.value === 'string' && (formData.value.startsWith('{') || formData.value.startsWith('['))
                        ? JSON.parse(formData.value) 
                        : formData.value
                ) : null
            }
            
            const res = await updateSetting(selectedSetting._id, dataToSend)
            if (!res.success) {
                toast.error(res.message || "Không thể cập nhật setting")
                return
            }
            setSettings(settings.map(s => s._id === selectedSetting._id ? res.data : s))
            setIsEditDialogOpen(false)
            setSelectedSetting(null)
            resetForm()
            toast.success("Cập nhật setting thành công")
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra")
        }
    }

    const handleDelete = async (settingToDelete) => {
        if (!confirm(`Bạn có chắc muốn xóa setting "${settingToDelete.key}"?`)) {
            return
        }
        
        try {
            const res = await deleteSetting(settingToDelete._id)
            if (!res.success) {
                toast.error(res.message || "Không thể xóa setting")
                return
            }
            setSettings(settings.filter(s => s._id !== settingToDelete._id))
            toast.success("Xóa setting thành công")
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra")
        }
    }

    const openEditDialog = (setting) => {
        setSelectedSetting(setting)
        setFormData({
            key: setting.key,
            name: setting.name,
            description: setting.description || "",
            category: setting.category || "general",
            enabled: setting.enabled,
            value: setting.value ? (typeof setting.value === 'object' ? JSON.stringify(setting.value, null, 2) : setting.value) : "",
        })
        setIsEditDialogOpen(true)
    }

    const openDetailDialog = (setting) => {
        setSelectedSetting(setting)
        setIsDetailDialogOpen(true)
    }

    const formatDate = (date) => {
        if (!date) return "Chưa cập nhật"
        return new Date(date).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const filteredSettings = settings?.filter((setting) => {
        const matchesSearch = setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            setting.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (setting.description && setting.description.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = statusFilter === "all" ||
                            (statusFilter === "enabled" && setting.enabled) ||
                            (statusFilter === "disabled" && !setting.enabled)
        const matchesCategory = categoryFilter === "all" || setting.category === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
    }) || []

    const clearFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
        setCategoryFilter("all")
    }

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Settings</CardTitle>
                        <div className="h-4 w-4 bg-blue-500 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{settings.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {filteredSettings.length !== settings.length && `(${filteredSettings.length} hiển thị)`}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã Kích Hoạt</CardTitle>
                        <div className="h-4 w-4 bg-green-500 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{settings.filter((s) => s.enabled).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chưa Kích Hoạt</CardTitle>
                        <div className="h-4 w-4 bg-gray-400 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{settings.filter((s) => !s.enabled).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Với Banners</CardTitle>
                        <div className="h-4 w-4 bg-purple-500 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {settings.filter((s) => s.banners && s.banners.length > 0).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 items-center flex-1 w-full">
                            <div className="relative flex-1 max-w-sm w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Tìm kiếm theo key, tên hoặc mô tả..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Lọc theo category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    <X className="h-4 w-4 mr-2" />
                                    Xóa bộ lọc
                                </Button>
                            )}
                            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true) }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm Setting
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Settings Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Settings</CardTitle>
                    <CardDescription>
                        Quản lý tất cả các settings của hệ thống ({filteredSettings.length} / {settings.length} kết quả)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key</TableHead>
                                <TableHead>Tên</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Banners</TableHead>
                                <TableHead>Cập nhật</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSettings.length > 0 ? (
                                filteredSettings.map((setting) => (
                                    <TableRow key={setting._id}>
                                        <TableCell className="font-mono text-sm font-medium">{setting.key}</TableCell>
                                        <TableCell>{setting.name || setting.key}</TableCell>
                                        <TableCell>
                                            <Badge className={getCategoryColor(setting.category)}>
                                                {setting.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={setting.enabled ? "default" : "secondary"}>
                                                {setting.enabled ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {setting.banners && setting.banners.length > 0 ? (
                                                <Badge variant="outline">{setting.banners.length} banners</Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(setting.updatedAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => openDetailDialog(setting)} title="Xem chi tiết">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(setting)} title="Chỉnh sửa">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(setting)} 
                                                    className="text-red-600 hover:text-red-700" title="Xóa">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">Không tìm thấy settings nào</p>
                                            {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
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

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm Setting Mới</DialogTitle>
                        <DialogDescription>Tạo một setting mới cho hệ thống</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="key">Key * <span className="text-xs text-muted-foreground">(unique)</span></Label>
                                <Input
                                    id="key"
                                    placeholder="e.g., homepage, footer_config"
                                    value={formData.key}
                                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên *</Label>
                                <Input
                                    id="name"
                                    placeholder="Tên hiển thị"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger id="category">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <Switch
                                    id="enabled"
                                    checked={formData.enabled}
                                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                                />
                                <Label htmlFor="enabled">Kích hoạt ngay</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                placeholder="Mô tả chi tiết về setting này"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="value">
                                Giá trị <span className="text-xs text-muted-foreground">(JSON string hoặc text)</span>
                            </Label>
                            <Textarea
                                id="value"
                                placeholder='{"key": "value"} hoặc plain text'
                                rows={4}
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleAdd}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm Setting
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa Setting</DialogTitle>
                        <DialogDescription>Cập nhật thông tin setting</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-key">Key * <span className="text-xs text-muted-foreground">(unique)</span></Label>
                                <Input
                                    id="edit-key"
                                    placeholder="e.g., homepage, footer_config"
                                    value={formData.key}
                                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Tên *</Label>
                                <Input
                                    id="edit-name"
                                    placeholder="Tên hiển thị"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger id="edit-category">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <Switch
                                    id="edit-enabled"
                                    checked={formData.enabled}
                                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                                />
                                <Label htmlFor="edit-enabled">Kích hoạt</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Mô tả</Label>
                            <Textarea
                                id="edit-description"
                                placeholder="Mô tả chi tiết về setting này"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="edit-value">
                                Giá trị <span className="text-xs text-muted-foreground">(JSON string hoặc text)</span>
                            </Label>
                            <Textarea
                                id="edit-value"
                                placeholder='{"key": "value"} hoặc plain text'
                                rows={4}
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Dialog - Using new SettingDetailDialog component */}
            <SettingDetailDialog 
                isOpen={isDetailDialogOpen}
                onClose={() => {
                    setIsDetailDialogOpen(false)
                    setSelectedSetting(null)
                }}
                setting={selectedSetting}
            />
        </>
    )
}