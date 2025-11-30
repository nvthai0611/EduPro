import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "../../../../hooks/useAuth";
import * as orderService from "../../../../services/user/orderService";
import { useLocation } from "react-router-dom";
import { courseService } from "../../../../services/courseService";
import SocketService from "../../../../utils/socket"

export const useQuery = () => new URLSearchParams(useLocation().search);

const PaymentPage = () => {
    const [paymentStatus, setPaymentStatus] = useState("Chờ thanh toán...");
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [order, setOrder] = useState(null);
    const [qr, setQr] = useState(`${import.meta.env.VITE_QRCODE_IMAGE}`);

    const query = useQuery();
    const courseId = query.get("course");

    const bankInfo = {
        bankName: "MBBank",
        accountName: "NGUYEN QUANG THUAN",
        accountNumber: "0961378056",
    };

    // Lấy thông tin khóa học
    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const response = await courseService.getCourseById(courseId);
                setCourse(response.data);
            } catch (error) {
                console.error("Error fetching course detail:", error);
            }
        };

        if (courseId) fetchCourseDetail();
    }, [courseId]);

    useEffect(() => {
        setPaymentStatus("Đang xác nhận...")

        // Kết nối với socket server
        SocketService.connect();

        // Lắng nghe sự kiện từ server
        SocketService.on("payment-webhook", (data) => {
            if (data.status === "completed") {
                setPaymentStatus("Thanh toán thành công!");
            }
        });

        // Cleanup khi component unmount
        return () => {
            SocketService.off("payment-webhook", () => { });
            SocketService.disconnect();
        };
    }, []);

    useEffect(() => {
        if (paymentStatus === "Đang xác nhận..." && course && user) {
            const createOrder = async () => {
                try {
                    const data = {
                        userId: user.userId,
                        courseId: course._id,
                        courseTitle: course.title,
                        price: course.salePrice,
                        paymentMethod: "sepay"
                    };

                    const newOrder = await orderService.createOrder(data);
                    setOrder(newOrder.order);
                    const encodedContent = encodeURIComponent(newOrder.order?._id);
                    setQr(`${import.meta.env.VITE_QRCODE_IMAGE}&amount=${course.salePrice}&des=${encodedContent}`);

                } catch (error) {
                    console.error("Error creating order:", error);
                }
            };

            createOrder();
        }
        if (paymentStatus === "Thanh toán thành công!" && course && user) {
            const markAsPaid = async () => {
                try {

                    await orderService.markAsPaid(`${order?._id}`);

                    window.location.href = `/courses/${course.slug}`;
                } catch (error) {
                    console.error("Error markAsPaid:", error);
                }
            };

            markAsPaid();
        }
    }, [paymentStatus, course, user]);

    console.log(qr);

    if (!course) return <p>Đang tải thông tin khóa học...</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Thanh toán khóa học</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Thông tin khóa học */}
                    <div className="flex flex-col md:flex-row bg-gray-50 rounded-lg p-4 items-center md:items-start">
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full md:w-48 h-32 md:h-40 object-cover rounded-lg mr-4 mb-4 md:mb-0"
                        />

                        <div className="flex-1 space-y-2">
                            <h2 className="text-xl font-semibold">{course.title}</h2>
                            <p className="text-blue-600">{course.description}</p>
                            <p className="text-lg text-gray-500 line-through">
                                {course.price.toLocaleString()} VND
                            </p>
                            <p className="text-3xl font-bold text-red-500">
                                {course.salePrice.toLocaleString()} VND
                            </p>
                        </div>
                    </div>

                    {/* Thông tin chuyển khoản */}
                    <div className="bg-white p-6 rounded-lg space-y-4">
                        <h3 className="font-semibold text-gray-700 text-lg">Thông tin chuyển khoản</h3>

                        <div className="space-y-1">
                            <p><span className="font-medium">Ngân hàng:</span> {bankInfo.bankName}</p>
                            <p><span className="font-medium">Chủ tài khoản:</span> {bankInfo.accountName}</p>
                            <p><span className="font-medium">Số tài khoản:</span> {bankInfo.accountNumber}</p>
                            <p>
                                Vui lòng chuyển đúng số tiền:
                                <span className="font-bold"> {course.salePrice.toLocaleString()} VND</span>
                            </p>
                            <p>
                                Ghi rõ nội dung: <span className="font-bold">{`${order?._id}`}</span>
                            </p>
                        </div>

                        <div className="my-10 p-6 bg-white flex flex-col md:flex-row items-center">
                            {/* Bên trái: QR Code */}
                            <div className="flex flex-col items-center justify-cente p-6">
                                <h2 className="text-xl font-semibold mb-4 text-center">Quét mã QR để thanh toán</h2>

                                <img
                                    src={qr}
                                    alt="QR Code"
                                    className="w-64 h-64 object-contain"
                                />

                                <p className="text-gray-600 mb-4 text-center">
                                    Sử dụng ứng dụng ngân hàng của bạn để quét mã QR này
                                </p>
                            </div>

                            {/* Bên phải: Chi tiết thanh toán */}
                            <div className="flex-1 bg-white rounded-lg p-6 max-w-[800px] mx-auto items-center">
                                <h2 className="text-lg font-semibold mb-4">Chi tiết thanh toán</h2>

                                {/* Header ngân hàng */}
                                <div className="flex items-center mb-4">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png" alt="{bankInfo.bankName}" className="w-10 h-10 mr-3 object-contain" />
                                    <div>
                                        <p className="font-medium">{bankInfo.bankName}</p>
                                        <p className="text-sm text-gray-500">Chuyển khoản ngân hàng</p>
                                    </div>
                                </div>

                                {/* Nội dung chi tiết */}
                                <div className="space-y-2 text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Chủ tài khoản :</span>
                                        <span>{bankInfo.accountName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Số tài khoản :</span>
                                        <span>{bankInfo.accountNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Số tiền :</span>
                                        <span>{course.salePrice.toLocaleString()} VND</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Nội dung chuyển khoản :</span>
                                        <span className="break-all">{`${order?._id}`}</span>
                                    </div>
                                </div>

                            </div>

                        </div>


                        {/* Hướng dẫn + trạng thái */}
                        <div className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm space-y-2">
                            <p>Hướng dẫn:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Chuyển khoản đúng số tiền và nội dung.</li>
                                <li>Chờ xác nhận thanh toán từ hệ thống.</li>
                            </ol>

                            <p className="text-blue-600 font-semibold mt-2">
                                Trạng thái thanh toán: {paymentStatus}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentPage;