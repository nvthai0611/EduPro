import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../../services/auth/authService"

export default function ConfirmEmailResetPasswordSuccess() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const response = await authService.confirmEmailResetPassword(token);
                    if (response.success) {
                        setStatus("success");
                        setMessage(
                            "Xác nhận email thành công! Bạn có thể tiếp tục đặt lại mật khẩu."
                        );
                    } else {
                        setStatus("error");
                        setMessage(
                            response.message ||
                            "Email hoặc token không hợp lệ, xác minh thất bại."
                        );
                    }
                } else {
                    setStatus("error");
                    setMessage("Thiếu token xác minh.");
                }
            } catch (error) {
                setStatus("error");
                setMessage(
                    error?.response?.data?.message ||
                    "Email hoặc token không hợp lệ, xác minh thất bại."
                );
            }
        };
        fetchData();
    }, [token]);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col gap-6 text-center">
                            <div className="flex flex-col items-center gap-2">
                                {status === "loading" && (
                                    <h1 className="text-2xl font-bold">Đang xác minh...</h1>
                                )}
                                {status === "success" && (
                                    <>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                            <svg
                                                className="h-6 w-6 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <h1 className="text-2xl font-bold">Thành công!</h1>
                                    </>
                                )}
                                {status === "error" && (
                                    <>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                            <svg
                                                className="h-6 w-6 text-red-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div>
                                        <h1 className="text-2xl font-bold">Xác minh thất bại!</h1>
                                    </>
                                )}
                                <p className="text-balance text-muted-foreground">{message}</p>
                            </div>
                            {status === "success" && (
                                <Button asChild>
                                    <Link to="/dat-lai-mat-khau">Đặt lại mật khẩu</Link>
                                </Button>
                            )}
                            <Button variant="ghost" asChild>
                                <Link to="/dang-nhap">Quay lại đăng nhập</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}