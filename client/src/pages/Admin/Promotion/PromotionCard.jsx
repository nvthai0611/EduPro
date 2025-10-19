"use client";

import { useState } from "react";
import {
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PromotionCard({
  promotion,
  onEdit,
  onToggleActive,
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return <Badge variant="outline" className="bg-gray-500 text-white">Chưa kích hoạt</Badge>;
    }

    if (now < startDate) {
      return <Badge variant="outline" className="bg-yellow-500 text-white">Sắp diễn ra</Badge>;
    }

    if (now > endDate) {
      return <Badge variant="outline" className="bg-red-500 text-white">Đã hết hạn</Badge>;
    }

    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3 && diffDays > 0) {
      return <Badge variant="outline" className="bg-orange-500 text-white">Sắp hết hạn</Badge>;
    }

    return <Badge variant="outline" className="bg-green-500 text-white">Đang hoạt động</Badge>;
  };

  const handleDelete = () => {
    onDelete(promotion._id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="relative">
        <CardHeader className="pb-3">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.tZ07JzrgsoMIjnpP0WRStwHaDX?pid=Api&P=0&h=180"
            alt={promotion.name}
            className=" object-cover w-full"
          />
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-1">
                {promotion.name}
              </CardTitle>
              <div className="mt-2">{getStatusBadge()}</div>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(promotion)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Discount Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {promotion.discountType === "percentage" ? (
                <Percent className="h-4 w-4 text-blue-600" />
              ) : (
                <DollarSign className="h-4 w-4 text-green-600" />
              )}
              <span className="text-sm font-medium">
                {promotion.discountType === "percentage"
                  ? `Giảm ${promotion.salePrice}%`
                  : `Giảm ${formatCurrency(promotion.salePrice)}`}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Tối đa: {formatCurrency(promotion.maxDiscount)}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Thời gian</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(promotion.startDate)} -{" "}
              {formatDate(promotion.endDate)}
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-medium">Kích hoạt</span>
            <Switch
              checked={promotion.isActive}
              onCheckedChange={(checked) => onToggleActive(promotion._id, checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi "{promotion.name}"? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
