"use client"

import { useState } from "react"
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
import { Plus, Edit, Trash2 } from "lucide-react"
import { useAdminBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from "../../../../hooks/useBanners"
import { toast } from "react-toastify"

export default function BannerManagement() {
    const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)
    const [selectedBanner, setSelectedBanner] = useState(null)
    const [bannerFormData, setBannerFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        link: "",
        isActive: true,
    })

    // TanStack Query hooks
    const { data: banners = [], isLoading, error } = useAdminBanners("homepage")
    const createBannerMutation = useCreateBanner()
    const updateBannerMutation = useUpdateBanner()
    const deleteBannerMutation = useDeleteBanner()

    const resetBannerForm = () => {
        setBannerFormData({
            title: "",
            description: "",
            imageUrl: "",
            linkUrl: "",
            isActive: true,
        })
    }

    const handleAddBanner = async () => {
        if (!bannerFormData.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề banner")
            return
        }
        if (!bannerFormData.imageUrl.trim()) {
            toast.error("Vui lòng nhập URL hình ảnh")
            return
        }
        if (!bannerFormData.linkUrl.trim()) {
            toast.error("Vui lòng nhập link đích")
            return
        }
        
        // Transform field names to match backend schema
        const transformedData = {
            title: bannerFormData.title,
            description: bannerFormData.description,
            imageUrl: bannerFormData.imageUrl,
            linkUrl: bannerFormData.linkUrl,
            isActive: bannerFormData.isActive,
            key: "homepage"
        }
        
        console.log("Transformed data:", transformedData)
        console.log("bannerFormData.isActive:", bannerFormData.isActive)
        console.log("bannerFormData:", bannerFormData)
        
        try {
            await createBannerMutation.mutateAsync(transformedData)
            setIsBannerDialogOpen(false)
            resetBannerForm()
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    }

    const handleEditBanner = async () => {
        if (!bannerFormData.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề banner")
            return
        }
        if (!bannerFormData.imageUrl.trim()) {
            toast.error("Vui lòng nhập URL hình ảnh")
            return
        }
        if (!bannerFormData.linkUrl.trim()) {
            toast.error("Vui lòng nhập link đích")
            return
        }
        
        // Transform field names to match backend schema
        const transformedData = {
            title: bannerFormData.title,
            description: bannerFormData.description,
            imageUrl: bannerFormData.imageUrl,
            linkUrl: bannerFormData.linkUrl,
            isActive: bannerFormData.isActive,
            key: "homepage"
        }
        
        try {
            await updateBannerMutation.mutateAsync({ 
                id: selectedBanner._id, 
                bannerData: transformedData 
            })
            setIsBannerDialogOpen(false)
            setSelectedBanner(null)
            resetBannerForm()
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    }

    const handleDeleteBanner = async (bannerId) => {
        try {
            await deleteBannerMutation.mutateAsync(bannerId)
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    }

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Homepage Banners</CardTitle>
                <CardDescription>Quản lý các banner hiển thị trên trang chủ</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                        {banners.length} banner(s)
                    </div>
                    <Dialog open={isBannerDialogOpen} onOpenChange={(open) => {
                        setIsBannerDialogOpen(open)
                        if (!open) {
                            setSelectedBanner(null)
                            resetBannerForm()
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                setSelectedBanner(null)
                                resetBannerForm()
                            }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm Banner
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{selectedBanner ? "Chỉnh sửa Banner" : "Thêm Banner Mới"}</DialogTitle>
                                <DialogDescription>{selectedBanner ? "Cập nhật thông tin banner" : "Tạo banner cho trang chủ"}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="banner-title">Tiêu đề *</Label>
                                    <Input
                                        id="banner-title"
                                        placeholder="Nhập tiêu đề banner"
                                        value={bannerFormData.title}
                                        onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="banner-description">Mô tả</Label>
                                    <Textarea
                                        id="banner-description"
                                        placeholder="Nhập mô tả banner"
                                        value={bannerFormData.description}
                                        onChange={(e) => setBannerFormData({ ...bannerFormData, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="banner-image">URL Hình ảnh</Label>
                                    <Input
                                        id="banner-image"
                                        placeholder="Nhập URL hình ảnh"
                                        value={bannerFormData.imageUrl}
                                        onChange={(e) => setBannerFormData({ ...bannerFormData, imageUrl: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="banner-link">Link</Label>
                                    <Input
                                        id="banner-link"
                                        placeholder="Nhập link đích"
                                        value={bannerFormData.linkUrl}
                                        onChange={(e) => setBannerFormData({ ...bannerFormData, linkUrl: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="banner-enabled"
                                        checked={bannerFormData.isActive}
                                        onCheckedChange={(checked) => setBannerFormData({ ...bannerFormData, isActive: checked })}
                                    />
                                    <Label htmlFor="banner-enabled">Kích hoạt</Label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsBannerDialogOpen(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={selectedBanner ? handleEditBanner : handleAddBanner}>
                                    {selectedBanner ? "Cập nhật" : "Thêm"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {banners.map((banner) => (
                        <Card key={banner._id}>
                            <CardContent className="p-4">
                                {banner.imageUrl && (
                                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-32 object-cover rounded mb-2" />
                                )}
                                <h3 className="font-semibold">{banner.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{banner.description}</p>
                                <div className="flex justify-between items-center">
                                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                                        {banner.isActive ? "Kích hoạt" : "Tắt"}
                                    </Badge>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            setSelectedBanner(banner)
                                            setBannerFormData({
                                                title: banner.title,
                                                description: banner.description,
                                                imageUrl: banner.imageUrl,
                                                linkUrl: banner.link,
                                                isActive: banner.isActive,
                                            })
                                            setIsBannerDialogOpen(true)
                                        }}>
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
                                                        Bạn có chắc chắn muốn xóa banner "{banner.title}"?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteBanner(banner._id)}>Xóa</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}