"use client"

import { useState, useRef } from "react"
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
import { Plus, Edit, Trash2, Upload, X } from "lucide-react"
import { useAdminBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from "../../../../hooks/useBanners"
import { toast } from "react-toastify"

export default function BannerManagement() {
    const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)
    const [selectedBanner, setSelectedBanner] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)
    const [bannerFormData, setBannerFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
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
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Vui lòng chọn file ảnh hợp lệ")
                return
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Kích thước ảnh không được vượt quá 5MB")
                return
            }
            
            setImageFile(file)
            
            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const clearImage = () => {
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleAddBanner = async () => {
        if (!bannerFormData.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề banner")
            return
        }
        
        // Kiểm tra phải có ảnh (file hoặc URL)
        if (!imageFile && !bannerFormData.imageUrl.trim()) {
            toast.error("Vui lòng chọn ảnh hoặc nhập URL hình ảnh")
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
            linkUrl: bannerFormData.linkUrl,
            isActive: bannerFormData.isActive,
            key: "homepage"
        }
        
        // Thêm image file hoặc imageUrl
        if (imageFile) {
            transformedData.image = imageFile
        } else {
            transformedData.imageUrl = bannerFormData.imageUrl
        }
        
        try {
            await createBannerMutation.mutateAsync(transformedData)
            setIsBannerDialogOpen(false)
            resetBannerForm()
        } catch (error) {
            // Error is handled by the mutation's onError
        }
    }

    const handleEditBanner = async () => {
        console.log('=== handleEditBanner started ===')
        console.log('bannerFormData:', bannerFormData)
        console.log('imageFile:', imageFile)
        console.log('imageFile is File?', imageFile instanceof File)
        console.log('imagePreview:', imagePreview)
        console.log('selectedBanner:', selectedBanner)
        
        if (!bannerFormData.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề banner")
            return
        }
        
        // Kiểm tra phải có ảnh (file mới, preview hiện tại, hoặc URL)
        if (!imageFile && !imagePreview && !bannerFormData.imageUrl.trim()) {
            toast.error("Vui lòng chọn ảnh hoặc nhập URL hình ảnh")
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
            linkUrl: bannerFormData.linkUrl,
            isActive: bannerFormData.isActive,
            key: "homepage"
        }
        
        // CHỈ thêm image file mới NẾU thực sự có file được chọn
        if (imageFile && imageFile instanceof File) {
            console.log('Adding NEW image file to transformedData:', imageFile.name, imageFile.size, 'bytes')
            transformedData.image = imageFile
            // Gửi publicId cũ để xóa ảnh cũ trên Cloudinary
            if (selectedBanner?.publicId) {
                console.log('Adding oldPublicId:', selectedBanner.publicId)
                transformedData.oldPublicId = selectedBanner.publicId
            }
        } else if (bannerFormData.imageUrl) {
            // Nếu không có file mới, GIỮ NGUYÊN imageUrl cũ
            console.log('Keeping existing imageUrl:', bannerFormData.imageUrl)
            transformedData.imageUrl = bannerFormData.imageUrl
            // Nếu có publicId cũ, giữ lại
            if (selectedBanner?.publicId) {
                transformedData.publicId = selectedBanner.publicId
            }
        }
        
        console.log('Final transformedData:', transformedData)
        console.log('Has image file?', 'image' in transformedData && transformedData.image instanceof File)
        console.log('selectedBanner._id:', selectedBanner._id)
        
        try {
            console.log('Calling updateBannerMutation...')
            const result = await updateBannerMutation.mutateAsync({ 
                id: selectedBanner._id, 
                bannerData: transformedData 
            })
            console.log('Update result:', result)
            toast.success("Cập nhật banner thành công!")
            setIsBannerDialogOpen(false)
            setSelectedBanner(null)
            resetBannerForm()
        } catch (error) {
            console.error('Update error:', error)
            toast.error(`Lỗi cập nhật banner: ${error.message}`)
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
                        <DialogContent className="max-w-2xl">
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
                                
                                {/* Image Upload Section */}
                                <div className="space-y-2">
                                    <Label>Hình ảnh Banner *</Label>
                                    <div className="space-y-3">
                                        {/* Image Preview */}
                                        {(imagePreview || (selectedBanner && bannerFormData.imageUrl)) && (
                                            <div className="relative inline-block">
                                                <img 
                                                    src={imagePreview || bannerFormData.imageUrl} 
                                                    alt="Preview" 
                                                    className="w-full max-w-md h-48 object-cover rounded border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={clearImage}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                        
                                        {/* Upload Button */}
                                        <div className="flex items-center gap-2">
                                            <Input
                                                ref={fileInputRef}
                                                id="banner-image-file"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                {imageFile ? "Chọn ảnh khác" : "Chọn ảnh từ máy"}
                                            </Button>
                                            {imageFile && (
                                                <span className="text-sm text-muted-foreground">
                                                    {imageFile.name}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* URL Input (alternative) */}
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <span className="w-full border-t" />
                                                </div>
                                                <div className="relative flex justify-center text-xs uppercase">
                                                    <span className="bg-background px-2 text-muted-foreground">
                                                        Hoặc nhập URL
                                                    </span>
                                                </div>
                                            </div>
                                            <Input
                                                id="banner-image-url"
                                                placeholder="https://example.com/image.jpg"
                                                value={bannerFormData.imageUrl}
                                                onChange={(e) => {
                                                    setBannerFormData({ ...bannerFormData, imageUrl: e.target.value })
                                                    if (e.target.value) {
                                                        clearImage()
                                                    }
                                                }}
                                                disabled={!!imageFile}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="banner-link">Link đích *</Label>
                                    <Input
                                        id="banner-link"
                                        placeholder="https://example.com hoặc /courses/123"
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
                                                linkUrl: banner.linkUrl,
                                                isActive: banner.isActive,
                                            })
                                            setImagePreview(banner.imageUrl)
                                            setImageFile(null)
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