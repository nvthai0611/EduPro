"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  PenSquare,
  Plus,
  Search,
  Trash2,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addNewCoupon,
  getAllCoupon,
  updateCoupon,
  getAllService,
  deleteCoupon,
} from "../../../services/admin/couponService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ToastContainer, toast } from "react-toastify";
import CouponDialog from "./CouponDialog";
import { formatDate } from "date-fns";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { COUPON_TYPE } from "../../../constains/coupon";

const COUPONS_PER_PAGE = 5;

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [services, setServices] = useState([]);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [sortField, setSortField] = useState("code");
  const [sortDirection, setSortDirection] = useState("asc");
  const [viewDetailMode, setViewDetailMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [filter, setFilter] = useState({
    type: "all",
    status: "all",
    search: "",
  });

  useEffect(() => {
    fetchCoupons();
    fetchServices();
  }, []);

  const fetchCoupons = async () => {
    const response = await getAllCoupon();
    setCoupons(response.data);
    setFilteredCoupons(response.data);
    setTotalPages(Math.ceil(response.data.length / COUPONS_PER_PAGE));
    setTotalCoupons(response.data.length);
  };

  const fetchServices = async () => {
    const response = await getAllService();
    setServices(response.data);
  };

  const handleCreateCoupon = () => {
    setCoupon(null);
    setCouponDialogOpen(true);
  };

  const handleSaveCoupon = async (couponData) => {
    try {
      if (couponData.id) {
        const response = await updateCoupon(couponData.id, couponData);
        console.log("response", response.data);
        fetchCoupons();
        handleCloseCouponDialog();
        toast.success(response.message);
      } else {
        const response = await addNewCoupon(couponData);
        console.log("response", response.data);
        fetchCoupons();
        handleCloseCouponDialog();
        toast.success(response.message);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  const handleCloseCouponDialog = () => {
    setCouponDialogOpen(false);
    setCoupon(null);
  };

  const applyFilterAndSort = (filterObj, sortField, sortDirection) => {
    let filtered = coupons.filter((coupon) => {
      const matchType =
        filterObj.type === "all" || coupon.discountType === filterObj.type;
      const matchStatus =
        filterObj.status === "all" ||
        coupon.isActive.toString() === filterObj.status;
      const matchSearch =
        filterObj.search === "" ||
        coupon.code.toLowerCase().includes(filterObj.search.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });

    let sorted = [...filtered].sort((a, b) => {
      if (sortField === "code") {
        return a.code.localeCompare(b.code);
      }
      if (sortField === "startDate") {
        return new Date(a.startDate) - new Date(b.startDate);
      }
      if (sortField === "endDate") {
        return new Date(a.endDate) - new Date(b.endDate);
      }
      if (sortField === "discount") {
        return a.discountValue - b.discountValue;
      }
      return a[sortField] - b[sortField];
    });
    if (sortDirection === "desc") {
      sorted.reverse();
    }

    setFilteredCoupons(sorted);
  };

  const handleFilter = (field, value) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);
    setCurrentPage(1);
    applyFilterAndSort(newFilter, sortField, sortDirection);
  };

  const handleSearch = (value) => {
    const newFilter = { ...filter, search: value };
    setFilter(newFilter);
    setCurrentPage(1);
    applyFilterAndSort(newFilter, sortField, sortDirection);
  };

  const handleSort = (field) => {
    let newSortField = sortField;
    let newSortDirection = sortDirection;
    if (sortField === field) {
      newSortDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newSortDirection);
    } else {
      newSortField = field;
      setSortField(newSortField);
      setSortDirection("asc");
      newSortDirection = "asc";
    }
    setCurrentPage(1);
    applyFilterAndSort(filter, newSortField, newSortDirection);
  };

  const confirmDeleteCoupon = async () => {
    try {
      const response = await deleteCoupon(couponToDelete._id);
      console.log("response", response.data);
      fetchCoupons();
      setIsDeleteDialogOpen(false);
      toast.success(response.message);
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCouponToDelete(null);
  };

  const startIdx = (currentPage - 1) * COUPONS_PER_PAGE;
  const paginatedCoupons = filteredCoupons.slice(
    startIdx,
    startIdx + COUPONS_PER_PAGE
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredCoupons.length / COUPONS_PER_PAGE));
  }, [filteredCoupons]);

  return (
    <div className="space-y-4">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm mã giảm giá..."
                className="w-full pl-8"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={filter.type}
                onValueChange={(value) => handleFilter("type", value)}
              >
                <SelectTrigger className="w-full sm:w-[170px]">
                  <SelectValue placeholder="Lọc theo loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả mã giảm giá</SelectItem>
                  <SelectItem value={COUPON_TYPE.PERCENTAGE}>
                    Phần trăm
                  </SelectItem>
                  <SelectItem value={COUPON_TYPE.FIXED}>Cố định</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filter.status}
                onValueChange={(value) => handleFilter("status", value)}
              >
                <SelectTrigger className="w-full sm:w-[170px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="true">Hoạt động</SelectItem>
                  <SelectItem value="false">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="gap-1"
                onClick={() => {
                  setViewDetailMode(false);
                  handleCreateCoupon();
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Thêm mã giảm giá</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-[250px] cursor-pointer"
                    onClick={() => handleSort("code")}
                  >
                    <div className="flex items-center">
                      Mã
                      {sortField === "code" && (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <div className="flex items-center">Loại</div>
                  </TableHead>
                  <TableHead
                    className="w-[150px] cursor-pointer"
                    onClick={() => handleSort("discount")}
                  >
                    <div className="flex items-center">
                      Giảm giá
                      {sortField === "discount" && (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[150px] cursor-pointer"
                    onClick={() => handleSort("startDate")}
                  >
                    <div className="flex items-center">
                      Ngày bắt đầu
                      {sortField === "startDate" && (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[150px] cursor-pointer"
                    onClick={() => handleSort("endDate")}
                  >
                    <div className="flex items-center">
                      Ngày kết thúc
                      {sortField === "endDate" && (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[150px]">Trạng thái</TableHead>
                  <TableHead className="w-[150px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCoupons.length > 0 ? (
                  paginatedCoupons.map((coupon, index) => (
                    <TableRow key={index}>
                      <TableCell>{coupon.code}</TableCell>
                      <TableCell>{coupon.discountType}</TableCell>
                      <TableCell>
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `${coupon.discountValue.toLocaleString()} VNĐ`}
                      </TableCell>
                      <TableCell>
                        {coupon.startDate ? formatDate(coupon.startDate, "dd/MM/yyyy") : "Vĩnh viễn"}
                      </TableCell>
                      <TableCell>
                        {coupon.endDate ? formatDate(coupon.endDate, "dd/MM/yyyy") : ""}
                      </TableCell>
                      <TableCell>
                        {coupon.isActive ? "Hoạt động" : "Không hoạt động"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setViewDetailMode(true);
                            setCoupon(coupon);
                            setCouponDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setViewDetailMode(false);
                            setCoupon(coupon);
                            setCouponDialogOpen(true);
                          }}
                        >
                          <PenSquare className="h-4 w-4 text-yellow-500" />
                        </Button>
                        {!coupon.isActive && coupon.usedCount === 0 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setIsDeleteDialogOpen(true);
                              setCouponToDelete(coupon);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Không tìm thấy mã giảm giá.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị <strong>{filteredCoupons.length}</strong> trong{" "}
              <strong>{totalCoupons}</strong> mã giảm giá
            </div>
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </PaginationItem>

                {totalPages > 1 ? (
                  Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))
                ) : (
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <CouponDialog
        open={couponDialogOpen}
        onOpenChange={handleCloseCouponDialog}
        coupon={coupon}
        services={services}
        onSave={handleSaveCoupon}
        loading={loading}
        viewDetailMode={viewDetailMode}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleCloseDeleteDialog}
        onConfirm={confirmDeleteCoupon}
        coupon={couponToDelete}
      />
    </div>
  );
}
