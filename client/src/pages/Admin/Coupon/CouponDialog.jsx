"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { COUPON_FORM_ERRORS, COUPON_TYPE } from "../../../constains/coupon";
import { toast } from "react-toastify";

export default function CouponDialog({
  open,
  onOpenChange,
  coupon,
  services,
  onSave,
  loading,
  viewDetailMode,
}) {
  const [formData, setFormData] = useState({
    id: "",
    code: "",
    type: "",
    discount: "",
    startDate: "",
    endDate: "",
    status: "",
    maxUses: "",
    minOrderAmount: "",
    isActive: false,
    applicableToAll: false,
    applicableServices: [],
    isGift: false,
  });

  const [applicableToAll, setApplicableToAll] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({
        id: coupon._id,
        code: coupon.code,
        type: coupon.discountType,
        discount: coupon.discountValue,
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : null,
        endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : null,
        maxUses: coupon.maxUses,
        minOrderAmount: coupon.minOrderAmount,
        isActive: coupon.isActive,
        applicableToAll: coupon.applicableToAll,
        applicableServices: coupon.applicableServices,
        isGift: coupon.isGift,
      });
    } else {
      setFormData({
        id: "",
        code: "",
        type: "",
        discount: "",
        startDate: "",
        endDate: "",
        maxUses: "",
        minOrderAmount: "",
        isActive: false,
        applicableToAll: false,
        applicableServices: [],
        isGift: false,
      });
    }
  }, [coupon, open]);

  useEffect(() => {
    if (!open) {
      setIsSubmitted(false);
    }
  }, [open]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const error = validateForm(formData);
    if (!error) {
      onSave(formData);
    } else {
      toast.error(error.message);
    }
  };

  const validateForm = (formData) => {
    if (validateFormField("code", formData.code))
      return validateFormField("code", formData.code);
    if (validateFormField("type", formData.type))
      return validateFormField("type", formData.type);
    if (validateFormField("discount", formData.discount))
      return validateFormField("discount", formData.discount);
    if (validateFormField("startDate", formData.startDate))
      return validateFormField("startDate", formData.startDate);
    if (validateFormField("endDate", formData.endDate))
      return validateFormField("endDate", formData.endDate);
    if (validateFormField("maxUses", formData.maxUses))
      return validateFormField("maxUses", formData.maxUses);
    if (validateFormField("minOrderAmount", formData.minOrderAmount))
      return validateFormField("minOrderAmount", formData.minOrderAmount);
    return null;
  };

  const validateFormField = (field, value) => {
    if (field === "code" && value.trim() === "")
      return COUPON_FORM_ERRORS.CODE_REQUIRED;
    if (field === "discount") {
      if (value === "") return COUPON_FORM_ERRORS.DISCOUNT_REQUIRED;
      if (value <= 0) return COUPON_FORM_ERRORS.DISCOUNT_GREATER_THAN_0;
      if (formData.type === COUPON_TYPE.PERCENTAGE && value > 100)
        return COUPON_FORM_ERRORS.DISCOUNT_LESS_THAN_100;
    }
    if (field === "type") {
      if (value === "") return COUPON_FORM_ERRORS.DISCOUNT_TYPE_REQUIRED;
      if (value !== COUPON_TYPE.PERCENTAGE && value !== COUPON_TYPE.FIXED)
        return COUPON_FORM_ERRORS.DISCOUNT_TYPE_INVALID;
    }
    if (field === "startDate") {
      if (value === null) return null;
      if (value === "") return COUPON_FORM_ERRORS.START_DATE_REQUIRED;
    }
    if (field === "endDate") {
      if (value === null) return null;
      if (value === "") return COUPON_FORM_ERRORS.END_DATE_REQUIRED;
      if (value <= formData.startDate)
        return COUPON_FORM_ERRORS.END_DATE_AFTER_START_DATE;
      if (value < new Date().toISOString().split("T")[0])
        return COUPON_FORM_ERRORS.END_DATE_TODAY_OR_LATER;
    }
    if (field === "maxUses") {
      if (value === "") return COUPON_FORM_ERRORS.MAX_USES_REQUIRED;
      if (value <= 0) return COUPON_FORM_ERRORS.MAX_USES_GREATER_THAN_0;
    }
    if (field === "minOrderAmount") {
      if (value === "") return COUPON_FORM_ERRORS.MIN_ORDER_AMOUNT_REQUIRED;
      if (value <= 0) return COUPON_FORM_ERRORS.MIN_ORDER_AMOUNT_GREATER_THAN_0;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {viewDetailMode
                ? "Xem mã giảm giá"
                : coupon
                ? "Sửa mã giảm giá"
                : "Tạo mã giảm giá"}
            </DialogTitle>
            <DialogDescription>
              {viewDetailMode
                ? "Xem chi tiết mã giảm giá."
                : coupon
                ? "Cập nhật chi tiết mã giảm giá."
                : "Điền thông tin để tạo mã giảm giá."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="id" value={formData.id} />
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="code" className="font-semibold">
                  Mã
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  disabled={viewDetailMode}
                />
                {isSubmitted && validateFormField("code", formData.code) && (
                  <p className="text-red-500 text-xs">
                    {validateFormField("code", formData.code)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="discount" className="font-semibold">
                  Giảm giá
                </Label>
                <Input
                  id="discount"
                  name="discount"
                  type="Number"
                  value={formData.discount}
                  onChange={handleChange}
                  disabled={viewDetailMode}
                />
                {isSubmitted &&
                  validateFormField("discount", formData.discount) && (
                    <p className="text-red-500 text-xs">
                      {validateFormField("discount", formData.discount)}
                    </p>
                  )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="type" className="font-semibold">
                  Loại
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  disabled={viewDetailMode}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={COUPON_TYPE.PERCENTAGE}>
                      Phần trăm
                    </SelectItem>
                    <SelectItem value={COUPON_TYPE.FIXED}>Cố định</SelectItem>
                  </SelectContent>
                </Select>
                {isSubmitted && validateFormField("type", formData.type) && (
                  <p className="text-red-500 text-xs">
                    {validateFormField("type", formData.type)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="startDate" className="font-semibold">
                  Ngày bắt đầu
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  disabled={viewDetailMode || formData.startDate === null}
                  onChange={handleChange}
                />
                {isSubmitted &&
                  validateFormField("startDate", formData.startDate) && (
                    <p className="text-red-500 text-xs">
                      {validateFormField("startDate", formData.startDate)}
                    </p>
                  )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="endDate" className="font-semibold">
                  Ngày kết thúc
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={viewDetailMode || formData.endDate === null}
                />
                {isSubmitted &&
                  validateFormField("endDate", formData.endDate) && (
                    <p className="text-red-500 text-xs">
                      {validateFormField("endDate", formData.endDate)}
                    </p>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="maxUses" className="font-semibold">
                  Số lần sử dụng tối đa
                </Label>
                <Input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={handleChange}
                  disabled={viewDetailMode}
                />
                {isSubmitted &&
                  validateFormField("maxUses", formData.maxUses) && (
                    <p className="text-red-500 text-xs">
                      {validateFormField("maxUses", formData.maxUses)}
                    </p>
                  )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="minOrderAmount" className="font-semibold">
                  Số tiền tối thiểu
                </Label>
                <Input
                  id="minOrderAmount"
                  name="minOrderAmount"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  disabled={viewDetailMode}
                />
                {isSubmitted &&
                  validateFormField(
                    "minOrderAmount",
                    formData.minOrderAmount
                  ) && (
                    <p className="text-red-500 text-xs">
                      {validateFormField(
                        "minOrderAmount",
                        formData.minOrderAmount
                      )}
                    </p>
                  )}
              </div>
            </div>

            {coupon && (
              <div className="flex flex-row items-center justify-between gap-4">
                <Label htmlFor="status" className="font-semibold">
                    Trạng thái
                </Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleSelectChange("isActive", checked)
                  }
                  disabled={viewDetailMode}
                >
                  <span className="sr-only">Trạng thái</span>
                </Switch>
              </div>
            )}

            <div>
              <div className="flex flex-row justify-between gap-1">
                <Label htmlFor="applicableToAll" className="font-semibold">
                  Áp dụng cho tất cả
                </Label>
                <Switch
                  checked={formData.applicableToAll}
                  onCheckedChange={(checked) => {
                    handleSelectChange("applicableToAll", checked);
                    setApplicableToAll(checked);
                  }}
                  disabled={viewDetailMode}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Label className="font-semibold">Dịch vụ áp dụng</Label>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service, index) => {
                  if (!service._id) return null;
                  const id = String(service._id);

                  return (
                    <div key={index} className="flex flex-row gap-1">
                      <Checkbox
                        id={`service_${id}`}
                        name={`applicableService_${id}`}
                        disabled={applicableToAll || viewDetailMode}
                        checked={
                          !!(
                            Array.isArray(formData.applicableServices) &&
                            formData.applicableServices.includes(id)
                          )
                        }
                        onCheckedChange={(checked) => {
                          let newServices = Array.isArray(
                            formData.applicableServices
                          )
                            ? [...formData.applicableServices]
                            : [];
                          if (checked) {
                            if (!newServices.includes(id)) newServices.push(id);
                          } else {
                            newServices = newServices.filter(
                              (item) => item !== id
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            applicableServices: newServices,
                          }));
                        }}
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid #e0e0e0",
                        }}
                      />
                      <Label htmlFor={`service_${id}`}>{service.name}</Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            {!viewDetailMode && (
              <Button disabled={loading} type="submit">
                {coupon ? "Lưu thay đổi" : "Tạo mã giảm giá"}
                {loading && <Loader2 className="animate-spin ml-2" />}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
