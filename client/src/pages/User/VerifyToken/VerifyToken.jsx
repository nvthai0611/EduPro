"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import bookingService from "../../../services/user/verifyBookingService";
import { BOOKING_STATUS } from "../../../constains/booking";
import socketService from "../../../utils/socket";
import { useNavigate } from "react-router-dom";

export default function VerifyToken() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const processBooking = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const action = urlParams.get("action");

        if (!token || !action) {
          setStatus("error");
          setMessage("Liên kết không hợp lệ hoặc đã hết hạn");
          return;
        }

        const data = { token, action };

        const tokenData = await bookingService.verifyToken(data);
        console.log("tokenData", tokenData);

        if (tokenData) {
          setStatus("success");
          if (tokenData.action === BOOKING_STATUS.CONFIRMED) {
            setMessage("Booking của bạn đã được xác nhận thành công!");
          } else if (tokenData.action === BOOKING_STATUS.CANCELLED) {
            setMessage("Booking của bạn đã được hủy thành công!");
          }
          const dateStr = new Date().getHours() + ":" + new Date().getMinutes() + " " + new Date(tokenData.booking.dateTime).toLocaleString("vi-VN").split(" ")[1];
          //Gửi socket thông báo cho Manager
          socketService.emit("sendNotification", {
            room: `branch_${tokenData.booking?.branchId._id.toString().trim()}`,
            message: `Booking của ${tokenData.booking?.customerId?.fullName} vào lúc ${dateStr} đã được khách hàng cập nhật thành ${tokenData.action}`,
            actionKey: "reloadBookingList",
            booking: {...tokenData.booking, branch: tokenData.booking.branchId, service: tokenData.booking.serviceId, customer: tokenData.booking.customerId},
          });
        } else {
          setStatus("error");
          setMessage("Không thể xử lý yêu cầu. Vui lòng thử lại sau.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.message);
      }
    };

    processBooking();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Xác nhận Booking</CardTitle>
          <CardDescription>Đang xử lý yêu cầu của bạn</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {status === "loading" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
              <p className="text-gray-600">
                Đang xử lý yêu cầu của bạn, vui lòng đợi...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-700">
                  Thành công!
                </h3>
                <p className="text-gray-600">{message}</p>
              </div>
              {/* <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Mã đặt chỗ:</span> #BK
                  {Math.floor(Math.random() * 10000)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Thời gian xử lý:</span>{" "}
                  {new Date().toLocaleString("vi-VN")}
                </p>
              </div> */}
              {/* <Button
                onClick={() => toast.success("Đến trang xem booking")}
                className="w-full"
              >
                Xem chi tiết
              </Button> */}
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-700">
                  Xác thực thất bại
                </h3>
                <p className="text-gray-600">{message}</p>
              </div>
            </div>
          )}
          <Button
            className="w-full bg-gray-500 text-white hover:bg-gray-600"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
