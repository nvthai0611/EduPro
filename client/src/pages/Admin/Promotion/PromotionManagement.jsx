"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PromotionList from "./PromotionList";
import PromotionForm from "./PromotionForm";
import { setPromotionActiveStatus, getAllPromotions, createPromotion, updatePromotion } from '../../../services/admin/promotionService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Tạm dừng" },
  { value: "upcoming", label: "Sắp diễn ra" },
  { value: "expired", label: "Đã hết hạn" },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "expiring", label: "Sắp hết hạn" },
  { value: "maxDiscount", label: "Giảm giá cao nhất" },
];

export default function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortType, setSortType] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
        try{
      setLoading(true);
      const response = await getAllPromotions();
      setPromotions(response.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const handleAddPromotion = async (newPromotion) => {
    try {
    const promotion = {
      ...newPromotion,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const response = await createPromotion(promotion);
    if (response.data) {
      setPromotions([response.data, ...promotions]);
      toast.success("Thêm promotion thành công");
    }
    setShowForm(false);
    } catch (error) {
      console.error("Error adding promotion:", error);
      toast.error(error.message);
    }
  };

  const handleEditPromotion = async (updatedPromotion) => {
    try {
    const response = await updatePromotion(updatedPromotion._id, updatedPromotion);
    if (response.data) {
      setPromotions(promotions.map((p) => p._id === updatedPromotion._id ? response.data : p));
      toast.success("Cập nhật promotion thành công");
    }
    setShowForm(false);
    setEditingPromotion(null);
    } catch (error) {
      console.error("Error editing promotion:", error);
      toast.error(error.message);
    }
  };

  const handleToggleActive = async (id, checked) => {
    try {
    const promotion = promotions.find((p) => p._id === id);
    if (!promotion) return;
    const updated = await setPromotionActiveStatus(id, checked);
    setPromotions(
      promotions.map((p) =>
        p._id === id ? { ...p, isActive: updated.data.isActive, updatedAt: new Date() } : p
      )
    );
    if (updated.data) {
      toast.success("Thay đổi trạng thái thành công");
    }
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      toast.error(error.message);
    }
  };

  const openEditForm = (promotion) => {
    setEditingPromotion(promotion);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPromotion(null);
  };

  // Filter promotions
  const now = new Date();
  const filteredPromotions = promotions.filter((p) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") {
      return p.isActive && new Date(p.startDate) <= now && new Date(p.endDate) >= now;
    }
    if (statusFilter === "inactive") {
      return !p.isActive;
    }
    if (statusFilter === "upcoming") {
      return p.isActive && new Date(p.startDate) > now;
    }
    if (statusFilter === "expired") {
      return p.isActive && new Date(p.endDate) < now;
    }
    return true;
  });
  // Sort promotions
  const sortedPromotions = [...filteredPromotions].sort((a, b) => {
    if (sortType === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortType === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortType === "expiring") return new Date(a.endDate) - new Date(b.endDate);
    if (sortType === "maxDiscount") return b.maxDiscount - a.maxDiscount;
    return 0;
  });
  // Hiển thị tối đa visibleCount promotion
  const visiblePromotions = sortedPromotions.slice(0, visibleCount);

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng Promotion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promotions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Đang hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {promotions.filter((p) => p.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tạm dừng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {promotions.filter((p) => !p.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sắp hết hạn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {
                  promotions.filter((p) => {
                    const now = new Date();
                    const endDate = new Date(p.endDate);
                    const diffTime = endDate - now;
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 7 && diffDays > 0;
                  }).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center justify-end">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Trạng thái:
              </span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border rounded px-2 py-1">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Sắp xếp:
              </span>
              <Select value={sortType} onValueChange={setSortType}>
                <SelectTrigger className="border rounded px-2 py-1">
                  <SelectValue placeholder="Chọn sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 w-fit"
          >
            <Plus className="h-4 w-4" />
            Thêm Promotion
          </Button>
        </div>

        {/* Promotion Form Modal */}
        {showForm && (
          <PromotionForm
            promotion={editingPromotion}
            onSubmit={
              editingPromotion ? handleEditPromotion : handleAddPromotion
            }
            onCancel={closeForm}
          />
        )}

        {/* Promotion List */}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="text-lg font-medium text-muted-foreground">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : (
          <>
            <PromotionList
              promotions={visiblePromotions}
              onEdit={openEditForm}
              onToggleActive={handleToggleActive}
            />
            {visibleCount < sortedPromotions.length && (
              <div className="flex justify-center mt-4">
                <Button onClick={() => setVisibleCount(visibleCount + 6)}>
                  Tải thêm
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
