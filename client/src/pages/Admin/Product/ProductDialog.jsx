"use client"; // This component uses useState and useEffect, so it must be a client component.

import { useState, useEffect } from "react";
// Corrected shadcn/ui imports
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { XCircle, Upload, Loader2 } from "lucide-react"; 
import { useRef } from "react";
import { toast } from "react-toastify";

import {
  createProduct,
  updateProduct,
} from "../../../services/admin/productService";

export default function ProductDialog({ open, onClose, product, onSuccess, categories }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    salePrice: "",
    stock: "",
    description: "",
    category: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]); 
  const [showImageDialog, setShowImageDialog] = useState(false); 
  const [currentLargeImage, setCurrentLargeImage] = useState(null); 
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product) {
        const categoryId = product.category._id;
      setForm({
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
        description: product.description,
        category: categoryId,
        images: product.images || [],
      });
      setPreviewImages(product.images || []);
    } else if (open && !product) {
      setForm({
        name: "",
        price: "",
        salePrice: "",
        stock: "",
        description: "",
        category: "",
        images: [],
      });
      setPreviewImages([]);
    }
  }, [open, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    setImageError("");
    const files = Array.from(e.target.files);
    const validFiles = [];
    const validPreviewUrls = [];
    let hasInvalid = false;

    for (const file of files) {
      const isValidType = file.type === "image/png" || file.type === "image/jpeg";
      const isValidSize = file.size <= 10 * 1024 * 1024;
      if (!isValidType) {
        hasInvalid = true;
        toast.error(`"${file.name}" không đúng định dạng PNG/JPG.`);
        continue;
      }
      if (!isValidSize) {
        hasInvalid = true;
        toast.error(`"${file.name}" vượt quá 10MB.`);
        continue;
      }
      // Check duplicate
      if (!form.images.some((f) => f.name === file.name && f.size === file.size)) {
        validFiles.push(file);
        validPreviewUrls.push(URL.createObjectURL(file));
      }
    }

    setForm((prev) => ({ ...prev, images: [...prev.images, ...validFiles] }));
    setPreviewImages((prev) => [...prev, ...validPreviewUrls]);
    setErrors((prev) => ({ ...prev, images: "" }));

    //e.target.value = null; // reset input để có thể chọn lại cùng file nếu muốn
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedFormImages = form.images.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedPreviewImages = previewImages.filter(
      (_, index) => index !== indexToRemove
    );

    setForm({ ...form, images: updatedFormImages });
    setPreviewImages(updatedPreviewImages);

    if (
      previewImages[indexToRemove] &&
      previewImages[indexToRemove].startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewImages[indexToRemove]);
    }
  };

  const handleShowLargeImage = (imageSrc) => {
    setCurrentLargeImage(imageSrc);
    setShowImageDialog(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên sản phẩm không được để trống.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) newErrors.price = "Giá phải là số lớn hơn 0.";
    if (!form.salePrice || isNaN(form.salePrice) || Number(form.salePrice) < 0) newErrors.salePrice = "Giá khuyến mãi phải là số lớn hơn 0.";
    if (form.salePrice && Number(form.salePrice) > Number(form.price)) newErrors.salePrice = "Giá khuyến mãi phải nhỏ hơn hoặc bằng giá gốc.";
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) newErrors.stock = "Số lượng phải là số lớn hơn 0.";
    if (!form.description.trim()) newErrors.description = "Mô tả không được để trống.";
    if (!form.category || form.category === "") newErrors.category = "Vui lòng chọn danh mục.";
    if (!form.images || form.images.length === 0) newErrors.images = "Vui lòng chọn ít nhất 1 hình ảnh.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (product?._id) {
        await updateProduct(product._id, form);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await createProduct(form);
        toast.success("Thêm sản phẩm thành công");
      }
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // setForm({
    //   name: "",
    //   price: "",
    //   salePrice: "",
    //   stock: "",
    //   description: "",
    //   pCate: "",
    //   images: [],
    // });
    // setPreviewImages([]);
    setErrors({});
    setImageError("");
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-6">
          {" "}
          {/* Increased padding and max-width */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {product && product._id ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập đầy đủ thông tin sản phẩm để quản lý hiệu quả.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left font-medium">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 flex flex-col">
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="text-red-500 text-sm p-1">{errors.name}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-left font-medium">
                Giá <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 flex flex-col">
                <Input
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                />
                {errors.price && (
                  <div className="text-red-500 text-sm p-1">
                    {errors.price}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salePrice" className="text-left font-medium">
                Giá khuyến mãi <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 flex flex-col">
                <Input
                  id="salePrice"
                  name="salePrice"
                  value={form.salePrice}
                  onChange={handleChange}
                  type="number"
                />
                {errors.salePrice && (
                  <div className="text-red-500 text-sm p-1 col-span-3">
                    {errors.salePrice}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-left font-medium">
                Số lượng <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 flex flex-col">
                <Input
                  id="stock"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  type="number"
                />
                {errors.stock && (
                  <div className="text-red-500 text-sm p-1 col-span-3">
                    {errors.stock}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label
                htmlFor="description"
                className="text-left font-medium pt-2"
              >
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 flex flex-col">
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="min-h-[80px]"
                />
                {errors.description && (
                  <div className="text-red-500 text-sm p-1 col-span-3">
                    {errors.description}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-left font-medium">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3 flex flex-col">
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    handleCategoryChange("category", value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={String(cat._id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <div className="text-red-500 text-sm p-1 col-span-3">
                    {errors.category}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              {" "}
              {/* Changed to items-start for file input */}
              <Label htmlFor="images" className="text-left font-medium pt-2">
                Hình ảnh <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/png,image/jpeg"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="mb-3"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Thêm ảnh
                </Button>
                {imageError && (
                  <div className="text-red-500 text-sm mb-2">{imageError}</div>
                )}
                {errors.images && (
                  <div className="text-red-500 text-sm mb-2">
                    {errors.images}
                  </div>
                )}
                <div className="flex flex-wrap gap-3 mt-4">
                  {" "}
                  {/* Increased gap and margin-top */}
                  {previewImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Product preview ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer transition-all group-hover:opacity-80" // Added border, rounded, hover effect
                        onClick={() => handleShowLargeImage(img)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6 flex justify-end gap-2">
              {" "}
              {/* Adjusted margin-top and alignment */}
              <Button type="button" variant="outline" onClick={handleClose}>
                Đóng
              </Button>
              <Button type="submit" disabled={loading}>
                {" "}
                {loading && (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                )}{" "}
                {product && product._id ? "Cập nhật" : "Tạo mới"}{" "}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Large Image Preview Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {" "}
          {/* No padding, overflow hidden for image */}
          <img
            src={currentLargeImage || "/placeholder.svg"}
            alt="Large product preview"
            className="w-full h-auto object-contain max-h-[80vh]" // Object-contain to fit image
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
