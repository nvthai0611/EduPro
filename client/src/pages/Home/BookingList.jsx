"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { initAOS } from "../../lib/aos-init";
import { Calendar, Trash2 } from "lucide-react";
import {
  formatRawPhoneNumberReplace,
  getBookingCountdownText,
} from "../../utils/format";
import dayjs from "dayjs";

// shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cancelBooking } from "../../services/home/bookingService";
import { toast, ToastContainer } from "react-toastify";
import { useBookingStore } from "../../stores/zustand/bookingStore";
import { isValidPhone } from "../../utils/validation";
import { generateDateOptions } from "../../utils/dateOptions";

// Booking Action Dialog Component
function BookingActionDialog({
  isOpen,
  onClose,
  booking,
  onReschedule,
  onCancel,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quản lý lịch hẹn</DialogTitle>
          <DialogDescription>
            Bạn chỉ có thể ĐỔI LỊCH HẸN hoặc HỦY LỊCH HẸN trước ít nhất 5 tiếng
          </DialogDescription>
        </DialogHeader>

        {/* Booking Info */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Dịch vụ:</span>{" "}
                {booking?.serviceId?.map((s) => s.name).join(", ")}
              </div>
              <div>
                <span className="font-medium">Thời gian:</span>{" "}
                {dayjs(booking?.dateTime).format("HH:mm DD/MM/YYYY")}
              </div>
              <div>
                <span className="font-medium">Chi nhánh:</span>{" "}
                {booking?.branchId?.name}
              </div>
              <div>
                <span className="font-medium">Nhân viên:</span>{" "}
                {booking?.stylist?.name || "Spa sẽ chọn giúp bạn"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => onReschedule(booking)}
            className="w-full"
            variant="default"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Đổi lịch hẹn
          </Button>

          <Button
            onClick={() => onCancel(booking)}
            className="w-full"
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hủy lịch hẹn
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full bg-transparent"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BookingList({ bookings = [] }) {
  const setTypeBooking = useBookingStore((state) => state.setTypeBooking);
  const phone = useBookingStore((state) => state.phone);
  const setOriginalBookingTime = useBookingStore(
    (state) => state.setOriginalBookingTime
  );
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const setSelectedTime = useBookingStore((state) => state.setSelectedTime);
  const setSelectedBranch = useBookingStore((state) => state.setSelectedBranch);
  const setSelectedServices = useBookingStore(
    (state) => state.setSelectedServices
  );
  const setTotalPrice = useBookingStore((state) => state.setTotalPrice);
  const totalPay = useBookingStore((state) => state.totalPay);
  const setTotalPay = useBookingStore((state) => state.setTotalPay);
  const setSelectedDiscount = useBookingStore(
    (state) => state.setSelectedDiscount
  );
  // eslint-disable-next-line no-unused-vars
  const [sliderRef, slider] = useKeenSlider({
    loop: false,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 24 },
      },
    },
  });

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    type: null,
    booking: null,
  });

  useEffect(() => {
    initAOS();
  }, []);

  console.log("bookings ", bookings);
  
  // Handle opening booking action dialog
  const handleBookingAction = (booking) => {
    setSelectedBooking(booking);
    console.log(selectedBooking);

    setIsDialogOpen(true);
  };

  // Handle reschedule booking
  const handleReschedule = (booking) => {
    setIsDialogOpen(false);
    setAlertDialog({
      isOpen: true,
      type: "reschedule",
      booking,
    });
  };

  // Handle cancel booking
  const handleCancel = (booking) => {
    setIsDialogOpen(false);
    setAlertDialog({
      isOpen: true,
      type: "cancel",
      booking,
    });
  };


  // Handle confirm action
  // Handle confirm action
const handleConfirmAction = async () => {
  if (!alertDialog.booking) return;
  console.log("Xác nhận hành động:", alertDialog.type, alertDialog.booking);

  try {
    const now = new Date();
    const bookingTime = new Date(alertDialog.booking.dateTime);
    const diffInMs = bookingTime.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    console.log("bookingTime ", bookingTime);
    console.log("diffInHours ", diffInHours);
    
    // 👉 Kiểm tra nếu chưa đủ 2 tiếng thì chặn đổi/hủy
    if (diffInHours < 2) {
      toast.error("Bạn chỉ có thể thay đổi hoặc hủy lịch trước ít nhất 2 tiếng.");
      return;
    }

    if (alertDialog.type === "reschedule") {
      // Logic đổi lịch
      if (!phone) {
        toast.error("Vui lòng nhập số điện thoại trước khi đổi lịch!");
        return;
      }
      if (!isValidPhone(phone)) {
        toast.error("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
        return;
      }

      const originalTime = alertDialog.booking.dateTime;
      setOriginalBookingTime(originalTime);
      useBookingStore.getState().setOriginalBookingDetails(alertDialog.booking);

      const originalDate = new Date(originalTime);
      const DATE_OPTIONS = generateDateOptions();
      const matchingDate = DATE_OPTIONS.find((option) => {
        const [day, month] = option.date.split("/");
        const currentYear = new Date().getFullYear();
        const optionDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
        return (
          optionDate.getDate() === originalDate.getDate() &&
          optionDate.getMonth() === originalDate.getMonth() &&
          optionDate.getFullYear() === originalDate.getFullYear()
        );
      });

      if (matchingDate) {
        setSelectedDate(matchingDate);
        localStorage.setItem("originalBookingDate", JSON.stringify(matchingDate));
      } else {
        localStorage.setItem(
          "originalBookingInfo",
          JSON.stringify({
            dateTime: originalTime,
            date: originalDate.toISOString(),
          })
        );
      }

      setTimeout(() => {
        console.log("selectedDate after set:", useBookingStore.getState().selectedDate);
      }, 0);

      setTypeBooking({
        isBooking: false,
        bookingId: alertDialog.booking._id,
      });

      setSelectedBranch(alertDialog?.booking.branchId);
      setSelectedServices(alertDialog?.booking.serviceId);
      setTotalPrice(alertDialog?.booking?.totalPrice);
      setTotalPay(alertDialog?.booking?.totalPay);

      setTimeout(() => {
        setSelectedDiscount(null);
      }, 0);

      toast("Đang chuyển hướng đến trang đổi lịch...");
      window.location.href = `/booking?phone=${formatRawPhoneNumberReplace(phone)}&step=0`;

    } else if (alertDialog.type === "cancel") {
      console.log("Hủy lịch cho booking:", alertDialog.booking);
      await cancelBooking(alertDialog?.booking?._id);
      toast("Lịch hẹn đã được hủy thành công!");
      window.location.reload();
    }

  } catch (error) {
    console.error("Lỗi khi xử lý:", error);
    toast(`Có lỗi xảy ra: ${error.message}`, {
      type: "error",
    });
  }

  setAlertDialog({ isOpen: false, type: null, booking: null });
};

  const closeAlertDialog = () => {
    setAlertDialog({ isOpen: false, type: null, booking: null });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section className="max-w-6xl mx-auto px-4 py-12 relative">
        <h2
          data-aos="fade-up"
          data-aos-offset="100"
          data-aos-delay="200"
          data-aos-duration="500"
          data-aos-once="true"
          className="text-2xl font-bold text-blue-900 mb-8 border-l-4 border-blue-600 pl-3"
        >
          LỊCH HẸN CỦA BẠN
        </h2>

        {/* Carousel dịch vụ */}
        {bookings?.length === 0 ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <img
                src="https://tse4.mm.bing.net/th/id/OIP.DJJ1FUpCF-R9zJHc0Kty7AHaGE?pid=Api&P=0&h=180"
                alt="Buồn quá, chưa có lịch hẹn"
                className="w-48 h-48 object-contain mb-4"
              />
              <p className="text-muted-foreground text-lg font-medium text-center">
                Buồn quá 😢 Bạn chưa có lịch hẹn nào, hãy đặt dịch vụ ngay nhé!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            ref={sliderRef}
            className="keen-slider"
            data-aos="fade-up"
            data-aos-offset="200"
            data-aos-delay="300"
            data-aos-duration="300"
            data-aos-once="true"
          >
            {bookings?.map((book, index) => {
              const { text, isUrgent } = getBookingCountdownText(book.dateTime);
              return (
                <div key={index} className="keen-slider__slide">
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                      <div className="flex-grow space-y-3">
                        {/* Tiêu đề + thông tin */}
                        <h3 className="text-lg font-semibold text-blue-900 break-words">
                          {book?.service?.map((s) => s.name).join(", ")}
                        </h3>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Chi nhánh:</span>{" "}
                            {book?.branchId?.name || "Chưa cập nhật"}
                          </div>

                          <div>
                            <span className="font-medium">Địa chỉ:</span>{" "}
                            {book?.branchId?.address || "Chưa cập nhật"}
                          </div>

                          <div>
                            <span className="font-medium">Dịch vụ:</span>{" "}
                            {book?.serviceId?.map((s) => s.name).join(", ") ||
                              "Spa sẽ chọn giúp bạn"}
                          </div>

                          <div>
                            <span className="font-medium">Thời gian:</span>{" "}
                            {dayjs(book?.dateTime).format(
                              "HH:mm DD/MM/YYYY (dddd)"
                            )}
                          </div>
                        </div>

                        {/* Đếm ngược lịch hẹn */}
                        <Badge
                          variant={isUrgent ? "destructive" : "secondary"}
                          className="w-fit"
                        >
                          {text}
                        </Badge>
                      </div>

                      {/* Nút chức năng */}
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleBookingAction(book)}
                          className="flex-1"
                        >
                          Đổi/Hủy lịch
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            window.open(
                              `https://www.google.com/maps/search/?api=1&query=${book?.branch?.location?.coordinates[1]},${book?.branch?.location?.coordinates[0]}`,
                              "_blank"
                            );
                          }}
                          className="flex-1"
                        >
                          Chỉ đường spa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Booking Action Dialog */}
      <BookingActionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        booking={selectedBooking}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />

      {/* Reschedule Confirmation Alert Dialog */}
      <AlertDialog
        open={alertDialog.isOpen && alertDialog.type === "reschedule"}
        onOpenChange={closeAlertDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đổi lịch</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đổi lịch hẹn này không? Nếu bạn đã sử dụng
              mã khuyến mại trước đó số tiền khuyến mãi sẽ được giữ nếu dịch vụ
              được khuyến mãi vẫn được chọn
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Đổi lịch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Alert Dialog */}
      <AlertDialog
        open={alertDialog.isOpen && alertDialog.type === "cancel"}
        onOpenChange={closeAlertDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy lịch</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hủy lịch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default BookingList;
