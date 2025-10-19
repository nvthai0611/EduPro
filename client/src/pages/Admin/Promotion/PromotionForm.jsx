"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";

export default function PromotionForm({ promotion, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    discountType: "percentage",
    maxDiscount: "",
    salePrice: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (promotion) {
      setFormData({
        ...promotion,
        startDate: new Date(promotion.startDate).toISOString().split("T")[0],
        endDate: new Date(promotion.endDate).toISOString().split("T")[0],
      });
    }
  }, [promotion]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên khuyến mãi là bắt buộc";
    }

    if (!formData.maxDiscount || formData.maxDiscount <= 0) {
      newErrors.maxDiscount = "Giảm giá tối đa phải lớn hơn 0";
    }

    if (!formData.salePrice || formData.salePrice <= 0) {
      newErrors.salePrice = "Giá trị giảm phải lớn hơn 0";
    }

    if (formData.discountType === "percentage" && formData.salePrice > 100) {
      newErrors.salePrice = "Phần trăm giảm không được vượt quá 100%";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const timeDiff = endDate - startDate;
      if (timeDiff < 24 * 60 * 60 * 1000) {
        newErrors.endDate = "Thời gian khuyến mãi tối thiểu là 24 giờ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      maxDiscount: Number(formData.maxDiscount),
      salePrice: Number(formData.salePrice),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto z-51"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {promotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên khuyến mãi */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên khuyến mãi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập tên khuyến mãi"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Loại giảm giá */}
            <div className="space-y-2">
              <Label>
                Loại giảm giá <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) =>
                  handleInputChange("discountType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                  <SelectItem value="fixed">Số tiền cố định (VNĐ)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Giá trị giảm */}
              <div className="space-y-2">
                <Label htmlFor="salePrice">
                  {formData.discountType === "percentage"
                    ? "Phần trăm giảm (%)"
                    : "Số tiền giảm (VNĐ)"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) =>
                    handleInputChange("salePrice", e.target.value)
                  }
                  placeholder={
                    formData.discountType === "percentage"
                      ? "Ví dụ: 20"
                      : "Ví dụ: 50000"
                  }
                  className={errors.salePrice ? "border-red-500" : ""}
                />
                {errors.salePrice && (
                  <p className="text-sm text-red-500">{errors.salePrice}</p>
                )}
              </div>

              {/* Giảm giá tối đa */}
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">
                  Giảm giá tối đa (VNĐ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) =>
                    handleInputChange("maxDiscount", e.target.value)
                  }
                  placeholder="Ví dụ: 100000"
                  className={errors.maxDiscount ? "border-red-500" : ""}
                />
                {errors.maxDiscount && (
                  <p className="text-sm text-red-500">{errors.maxDiscount}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ngày bắt đầu */}
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>

              {/* Ngày kết thúc */}
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Trạng thái kích hoạt */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Kích hoạt ngay</Label>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 bg-transparent"
              >
                Hủy
              </Button>
              <Button type="submit" className="flex-1">
                {promotion ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
