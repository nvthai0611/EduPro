"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Phone,
  Mail,
  MoreHorizontal,
  Plus,
  Download,
  Eye,
  Edit,
  MapPin,
  Users,
  DollarSign,
  WalletMinimal,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BookingDialog from "./BookingDialog";
import { BOOKING_STATUS } from "../../../constains/booking";
import { toast } from "react-toastify";

// Import service thật
import {
  getBookingsByDate,
  createBooking,
  updateBooking,
  getCoupons,
  updateBookingStatus,
} from "../../../services/staff/bookingService";

const getStatusColor = (status) => {
  switch (status) {
    case BOOKING_STATUS.CONFIRMED:
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case BOOKING_STATUS.PENDING:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case BOOKING_STATUS.CANCELLED:
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case BOOKING_STATUS.COMPLETED:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case BOOKING_STATUS.NO_SHOW:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const hour = Number.parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const getStatusActions = (currentStatus) => {
  const actions = [];
  switch (currentStatus) {
    case BOOKING_STATUS.PENDING:
      actions.push({
        label: "Confirm",
        status: "confirmed",
        color: "text-green-600",
      });
      actions.push({
        label: "Cancel",
        status: "cancelled",
        color: "text-red-600",
      });
      break;
    case BOOKING_STATUS.CONFIRMED:
      actions.push({
        label: "Complete",
        status: "completed",
        color: "text-blue-600",
      });
      actions.push({
        label: "Mark No Show",
        status: "no_show",
        color: "text-gray-600",
      });
      break;
    case BOOKING_STATUS.COMPLETED:
      break;
    case BOOKING_STATUS.CANCELLED:
      break;
    case BOOKING_STATUS.NO_SHOW:
      break;
  }
  return actions;
};
const ITEMS_PER_PAGE = 5;
export default function BookingPage() {
  const [loading, setLoading] = useState(true);
  const [loadingBookingId, setLoadingBookingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async (date) => {
    setLoading(true);
    try {
      const response = await getBookingsByDate(date);
      setBookings(response.data);
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setLoadingBookingId(bookingId);
    setLoadingAction(newStatus);
    try {
      const response = await updateBookingStatus(bookingId, newStatus);
      toast.success(response.message);
      // Refresh bookings after status change
      fetchBookings(selectedDate);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingBookingId(null);
      setLoadingAction(null);
    }
  };

  // Booking handlers
  const handleCreateBooking = () => {
    setDialogMode("create");
    setSelectedBooking(null);
    setDialogOpen(true);
  };

  const handleEditBooking = (booking) => {
    // Transform booking data to match dialog format
    const transformedBooking = {
      ...booking,
      customerName: booking?.customerId?.fullName,
      customerPhone: booking?.customerId?.phoneNumber,
      customerEmail: booking?.customerId?.email,
      serviceDetails:
        booking?.serviceId?.map((service, index) => ({
          serviceId: service._id,
          staffId: booking?.staffId?.[index]?._id || "",
          roomId: booking?.roomId?.[index]?._id || "",
        })) || [],
    };

    setDialogMode("edit");
    setSelectedBooking(transformedBooking);
    setDialogOpen(true);
  };

  const handleSubmitBooking = async (bookingData) => {
    try {
      if (dialogMode === "create") {
        // Call API to create booking
        const response = await createBooking(bookingData);
        toast.success("Tạo booking thành công!");
      } else {
        // Call API to update booking
        const response = await updateBooking(bookingData);
        toast.success("Cập nhật booking thành công!");
      }

      // Refresh bookings from API
      fetchBookings(selectedDate);
      setDialogOpen(false);
    } catch (error) {
      //console.error("Lỗi submit booking:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setSelectedDate(new Date().toISOString());
  }, []);

  useEffect(() => {
    fetchBookings(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, selectedDate]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking?.customerId?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking?.serviceId?.some((service) =>
        service?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      booking?.staffId?.some((staff) =>
        staff?.userId?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) ||
      booking?.branchId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking?.roomId?.some((room) =>
        room?.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || booking?.status === statusFilter;

    const bookingDate = new Date(booking?.dateTime).toISOString().split("T")[0];
    const matchesDate = bookingDate === selectedDate.split("T")[0];

    return matchesSearch && matchesStatus && matchesDate;
  });

  const todayStats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter(
      (b) => b.status === BOOKING_STATUS.CONFIRMED
    ).length,
    pending: filteredBookings.filter((b) => b.status === BOOKING_STATUS.PENDING)
      .length,
    cancelled: filteredBookings.filter(
      (b) => b.status === BOOKING_STATUS.CANCELLED
    ).length,
    completed: filteredBookings.filter(
      (b) => b.status === BOOKING_STATUS.COMPLETED
    ).length,
    noShow: filteredBookings.filter((b) => b.status === BOOKING_STATUS.NO_SHOW)
      .length,
    totalRevenue: filteredBookings.reduce(
      (sum, b) =>
        sum + (b.status === BOOKING_STATUS.COMPLETED ? b?.totalPay : 0),
      0
    ),
    pendingPayments: filteredBookings.reduce(
      (sum, b) =>
        sum +
        (b.status !== BOOKING_STATUS.COMPLETED ||
        b.status !== BOOKING_STATUS.CANCELLED ||
        b.status !== BOOKING_STATUS.NO_SHOW
          ? b?.totalPay
          : 0),
      0
    ),
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="min-h-screen rounded-lg bg-gradient-to-br from-white to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý lịch booking
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              className="hidden bg-transparent"
              variant="outline"
              size="sm"
            >
              <Download className="hidden w-4 h-4 mr-2" />
              Xuất file
            </Button>
            <Button size="sm" onClick={handleCreateBooking}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo booking
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-lg font-bold text-purple-600">
                {todayStats.total}
              </div>
              <div className="text-sm text-gray-600">Tổng</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-lg font-bold text-green-600">
                {todayStats.confirmed}
              </div>
              <div className="text-sm text-gray-600">Đã xác nhận</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-lg font-bold text-yellow-600">
                {todayStats.pending}
              </div>
              <div className="text-sm text-gray-600">Chờ xác nhận</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-lg font-bold text-blue-600">
                {todayStats.completed}
              </div>
              <div className="text-sm text-gray-600">Đã hoàn thành</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-lg font-bold text-gray-600">
                {todayStats.noShow}
              </div>
              <div className="text-sm text-gray-600">Không đến</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(todayStats.totalRevenue)}
              </div>
              <div className="text-sm text-gray-600">Doanh thu</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-lg font-bold text-orange-600">
                {formatCurrency(todayStats.pendingPayments)}
              </div>
              <div className="text-sm text-gray-600">Chờ thanh toán</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên khách hàng, dịch vụ, hoặc nhân viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={0} value="all">
                    Tất cả trạng thái
                  </SelectItem>
                  <SelectItem key={1} value="pending">
                    Chờ xác nhận
                  </SelectItem>
                  <SelectItem key={2} value="confirmed">
                    Đã xác nhận
                  </SelectItem>
                  <SelectItem key={3} value="completed">
                    Đã hoàn thành
                  </SelectItem>
                  <SelectItem key={4} value="cancelled">
                    Đã hủy
                  </SelectItem>
                  <SelectItem key={5} value="no_show">
                    Không đến
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={selectedDate.split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-[180px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {currentBookings.map((booking, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={booking?.customerId?.image || ""} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {booking?.customerId?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {booking?.customerId?.fullName}
                        </h3>
                        {/* Clickable Status Badge with Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="border-none bg-transparent hover:bg-transparent w-fit">
                              <Badge
                                className={`${getStatusColor(
                                  booking?.status
                                )} cursor-pointer hover:opacity-80 transition-opacity`}
                              >
                                {booking?.status.charAt(0).toUpperCase() +
                                  booking?.status.slice(1)}
                              </Badge>
                            </button>
                          </DropdownMenuTrigger>
                          {booking?.status !== BOOKING_STATUS.CANCELLED &&
                            booking?.status !== BOOKING_STATUS.COMPLETED &&
                            booking?.status !== BOOKING_STATUS.NO_SHOW && (
                              <DropdownMenuContent
                                align="start"
                                className="w-48"
                              >
                                <div className="px-2 py-1 text-xs font-medium text-gray-500">
                                  Thay đổi trạng thái
                                </div>
                                <DropdownMenuSeparator />
                                {getStatusActions(booking?.status).map(
                                  (action, index) => (
                                    <DropdownMenuItem
                                      key={index}
                                      disabled={
                                        loadingBookingId === booking?._id
                                      }
                                      onClick={() =>
                                        handleStatusChange(
                                          booking?._id,
                                          action.status
                                        )
                                      }
                                      className={action.color}
                                    >
                                      {loadingBookingId === booking?._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                      ) : null}
                                      {action.label}
                                    </DropdownMenuItem>
                                  )
                                )}
                              </DropdownMenuContent>
                            )}
                        </DropdownMenu>
                        {booking?.couponCode && (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200"
                          >
                            {(() => {
                              try {
                                if (
                                  typeof booking?.couponCode === "object" &&
                                  booking?.couponCode?.code
                                ) {
                                  return booking?.couponCode?.code;
                                } else if (
                                  typeof booking?.couponCode === "string"
                                ) {
                                  return booking?.couponCode;
                                } else {
                                  return "Coupon";
                                }
                              } catch (error) {
                                console.error(
                                  "❌ Error rendering coupon badge:",
                                  error
                                );
                                return "Coupon";
                              }
                            })()}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-medium text-purple-600">
                            {booking?.serviceId?.length < 2
                              ? booking?.serviceId
                                  ?.map((s) => s?.name)
                                  .join(", ")
                              : booking?.serviceId
                                  ?.slice(0, 2)
                                  ?.map((s) => s?.name)
                                  .join(", ") + ",..."}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            {booking?.staffId?.length > 0
                              ? booking?.staffId?.length < 1
                                ? booking?.staffId
                                    ?.map((s) => s?.userId?.fullName)
                                    .join(", ")
                                : booking?.staffId
                                    ?.slice(0, 1)
                                    ?.map((s) => s?.userId?.fullName)
                                    .join(", ") + ",..."
                              : "Chờ gán nhân viên"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking?.dateTime
                              .split("T")[0]
                              .split("-")
                              .reverse()
                              .join("/")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(booking?.startTime)} (
                            {booking?.duration} min)
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking?.branchId?.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {booking?.customerId?.phoneNumber}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {booking?.customerId?.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <WalletMinimal className="w-4 h-4" />
                            {formatCurrency(booking?.totalPay)}
                          </div>
                        </div>
                        {/* Quick Action Buttons */}
                        {getStatusActions(booking?.status).length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500 w-full">
                              Thao tác nhanh:
                            </span>
                            {getStatusActions(booking?.status)
                              .slice(0, 2)
                              .map((action, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusChange(
                                      booking?._id,
                                      action.status
                                    )
                                  }
                                  disabled={loadingBookingId === booking?._id}
                                  className={`h-6 text-xs ${action.color} border-current border-solid`}
                                >
                                  {loadingBookingId === booking?._id &&
                                  loadingAction === action.status ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    action.label
                                  )}
                                </Button>
                              ))}
                          </div>
                        )}
                        {booking?.roomId?.length > 0 && (
                          <div className="text-xs text-purple-600">
                            Phòng:{" "}
                            {booking?.roomId?.length < 3
                              ? booking?.roomId?.map((r) => r?.code).join(", ")
                              : booking?.roomId
                                  .slice(0, 2)
                                  .map((r) => r?.code)
                                  .join(", ") + ",..."}
                          </div>
                        )}
                        {booking?.notes && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
                            <strong>Ghi chú:</strong> {booking?.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 w-fit"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span>Xem chi tiết</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Chi tiết booking</DialogTitle>
                          <DialogDescription>
                            Thông tin chi tiết cho booking của{" "}
                            {booking?.customerId?.fullName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3">
                                Thông tin khách hàng
                              </h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <strong>Tên:</strong>{" "}
                                  {booking?.customerId?.fullName}
                                </p>
                                <p>
                                  <strong>Email:</strong>{" "}
                                  {booking?.customerId?.email}
                                </p>
                                <p>
                                  <strong>Số điện thoại:</strong>{" "}
                                  {booking?.customerId?.phoneNumber}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3">Vị trí</h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <strong>Chi nhánh:</strong>{" "}
                                  {booking?.branchId?.name}
                                </p>
                                <p>
                                  <strong>Địa chỉ:</strong>{" "}
                                  {booking?.branchId?.address}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Dịch vụ</h4>
                            <div className=" text-sm mb-3">
                              {(booking?.serviceId?.length !==
                                booking?.staffId?.length ||
                                booking?.serviceId?.length !==
                                  booking?.roomId?.length) && (
                                <div>
                                  {booking?.serviceId
                                    .map((s) => s?.name)
                                    .join(", ")}
                                  <br />
                                  <strong className="mt-3">
                                    Nhân viên:
                                  </strong>{" "}
                                  <span className="text-gray-500 italic">
                                    Chờ gán nhân viên
                                  </span>
                                </div>
                              )}
                              {booking?.serviceId?.length ===
                                booking?.staffId?.length &&
                                booking?.serviceId?.length ===
                                  booking?.roomId?.length && (
                                  <div>
                                    {booking?.serviceId?.map((s, index) => (
                                      <span key={index}>
                                        {s?.name} -{" "}
                                        {
                                          booking?.staffId[index]?.userId
                                            ?.fullName
                                        }{" "}
                                        - {booking?.roomId[index]?.name}
                                        <br />
                                      </span>
                                    ))}
                                  </div>
                                )}

                              <p>
                                <strong>Thời gian dự kiến:</strong>{" "}
                                {booking?.duration} phút
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">
                              Thông tin booking
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Ngày:</strong>{" "}
                                {booking?.dateTime
                                  .split("T")[0]
                                  .split("-")
                                  .reverse()
                                  .join("/")}
                              </p>
                              <p>
                                <strong>Giờ:</strong>{" "}
                                {formatTime(booking?.startTime)}
                              </p>
                              <div>
                                <strong>Trạng thái:</strong>
                                <Badge
                                  className={`ml-2 ${getStatusColor(
                                    booking?.status
                                  )}`}
                                >
                                  {booking?.status.charAt(0).toUpperCase() +
                                    booking?.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">
                              Thông tin thanh toán
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Tổng tiền dịch vụ:</strong>{" "}
                                <span
                                  className={`text-gray-500 ${
                                    booking?.couponCode ? "line-through" : ""
                                  }`}
                                >
                                  {formatCurrency(booking?.totalPrice)}
                                </span>
                              </p>
                              {booking?.couponCode && (
                                <p>
                                  <strong>Mã giảm giá:</strong>{" "}
                                  <span style={{ color: "#ff424e" }}>
                                    {typeof booking?.couponCode === "object" &&
                                    booking?.couponCode?.code
                                      ? `${booking?.couponCode?.code} (${
                                          booking?.couponCode?.discountType ===
                                          "percentage"
                                            ? booking?.couponCode
                                                ?.discountValue + "%"
                                            : formatCurrency(
                                                booking?.couponCode
                                                  ?.discountValue
                                              )
                                        } off)`
                                      : typeof booking?.couponCode === "string"
                                      ? booking?.couponCode
                                      : "Coupon applied"}
                                  </span>
                                </p>
                              )}
                              <p>
                                <strong>Tổng giảm giá:</strong>{" "}
                                <span style={{ color: "#ff424e" }}>
                                  -{formatCurrency(booking?.totalDiscount)}
                                </span>
                              </p>
                              <p>
                                <strong>Tổng cần thanh toán:</strong>{" "}
                                <span className="font-bold">
                                  {formatCurrency(booking?.totalPay)}
                                </span>
                              </p>

                              {/* <div>
                                <strong>Trạng thái:</strong>
                                <Badge
                                  className={`ml-2 ${
                                    booking?.isPaid
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-red-100 text-red-800 hover:bg-red-100"
                                  }`}
                                >
                                  {booking?.isPaid
                                    ? "Đã thanh toán"
                                    : "Chờ thanh toán"}
                                </Badge>
                              </div> */}
                            </div>
                          </div>
                          {booking?.notes && (
                            <div>
                              <h4 className="font-semibold mb-3">Ghi chú</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                {booking?.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-fit">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            if (
                              booking?.status !== BOOKING_STATUS.PENDING &&
                              booking?.status !== BOOKING_STATUS.CONFIRMED
                            ) {
                              toast.error(
                                "Không thể cập nhật booking có trạng thái là " +
                                  booking?.status
                              );
                              return;
                            }
                            handleEditBooking(booking);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Sửa booking
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Thanh toán
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredBookings.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Hiển thị {indexOfFirstItem + 1} đến{" "}
                  {Math.min(indexOfLastItem, filteredBookings.length)} trên{" "}
                  {filteredBookings.length} booking
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Trang trước
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page, index) => (
                        <Button
                          key={index}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Trang tiếp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <p className="text-gray-500">Đang tải lịch booking...</p>
          </div>
        ) : (
          filteredBookings.length === 0 &&
          !loading && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    Không tìm thấy lịch booking
                  </h3>
                  <p>
                    Không tìm thấy lịch booking phù hợp. Vui lòng thử lại với
                    các tiêu chí khác.
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* Booking Dialog */}
        <BookingDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode={dialogMode}
          bookingData={selectedBooking}
          onSubmit={handleSubmitBooking}
        />
      </div>
    </div>
  );
}
