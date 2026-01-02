"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SettingDetailDialog({ isOpen, onClose, setting }) {
    if (!setting) return null

    const formatDate = (date) => {
        return new Date(date).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const renderValue = (value) => {
        if (value === null || value === undefined) return 'N/A'
        if (typeof value === 'object') {
            return <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">{JSON.stringify(value, null, 2)}</pre>
        }
        return String(value)
    }

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        Chi tiết Setting
                        <Badge className={getCategoryColor(setting.category)}>
                            {setting.category}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Xem toàn bộ thông tin chi tiết của setting
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                    <div className="space-y-4">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Key</p>
                                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{setting.key}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Tên</p>
                                        <p className="text-sm mt-1">{setting.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                                        <Badge variant={setting.enabled ? "default" : "secondary"} className="mt-1">
                                            {setting.enabled ? "Đang hoạt động" : "Tắt"}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Danh mục</p>
                                        <Badge className={`${getCategoryColor(setting.category)} mt-1`}>
                                            {setting.category}
                                        </Badge>
                                    </div>
                                </div>
                                
                                {setting.description && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                                        <p className="text-sm mt-1">{setting.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Value */}
                        {setting.value !== null && setting.value !== undefined && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Giá trị (Value)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderValue(setting.value)}
                                </CardContent>
                            </Card>
                        )}

                        {/* Metadata */}
                        {setting.metadata && Object.keys(setting.metadata).length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Metadata</CardTitle>
                                    <CardDescription>Thông tin bổ sung</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                                        {JSON.stringify(setting.metadata, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        )}

                        {/* Banners */}
                        {setting.banners && setting.banners.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Banners ({setting.banners.length})</CardTitle>
                                    <CardDescription>Danh sách banners trong setting này</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {setting.banners.map((banner, index) => (
                                            <div key={banner._id || index} className="border rounded-lg p-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">{banner.title}</h4>
                                                    <div className="flex gap-2">
                                                        <Badge variant={banner.isActive ? "default" : "secondary"}>
                                                            {banner.isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                        <Badge variant="outline">Order: {banner.order}</Badge>
                                                    </div>
                                                </div>
                                                {banner.description && (
                                                    <p className="text-sm text-muted-foreground">{banner.description}</p>
                                                )}
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="font-medium">Image: </span>
                                                        <a href={banner.imageUrl} target="_blank" rel="noopener noreferrer" 
                                                           className="text-blue-600 hover:underline truncate">
                                                            {banner.imageUrl}
                                                        </a>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Link: </span>
                                                        <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" 
                                                           className="text-blue-600 hover:underline truncate">
                                                            {banner.linkUrl}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Thông tin thời gian</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-medium text-muted-foreground">Ngày tạo</p>
                                        <p className="mt-1">{formatDate(setting.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-muted-foreground">Cập nhật lần cuối</p>
                                        <p className="mt-1">{formatDate(setting.updatedAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ID */}
                        <Card>
                            <CardContent className="pt-4">
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">ID:</span> {setting._id}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
