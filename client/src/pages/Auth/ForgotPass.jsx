"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "../../services/auth/authService"
import { isValidEmail } from "../../utils/validation";
// Giả sử apiClient và các hàm API được định nghĩa trong một file riêng
// Bạn cần đảm bảo đã import đúng. Ví dụ:
// import apiClient from "@/services/apiClient";

// Bạn có thể định nghĩa hàm này ở đây hoặc trong một file services/api.js

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Xóa lỗi cũ

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    if (isValidEmail(email) === false) {
      setError("Email không hợp lệ");
      setIsLoading(false);
      return
    }
    try {
      // Gọi API thực tế
      const response = await authService.sendEmailResetPassword(email);

      // Kiểm tra phản hồi từ API
      if (response.success) {
        setEmailSent(true);
      } else {
        // Xử lý các trường hợp thất bại khác từ API
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (apiError) {
      console.error("Lỗi khi gửi email:", apiError);
      // Lấy thông báo lỗi từ API, ví dụ: apiError.response.data.message
      const errorMessage = apiError.response?.data?.message || "Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6 text-center">
                <div className="flex flex-col items-center gap-2">
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
                  <h1 className="text-2xl font-bold">Email đã được gửi</h1>
                  <p className="text-balance text-muted-foreground">
                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                  </p>
                </div>
                <Button asChild>
                  <Link to="/dang-nhap">Quay lại đăng nhập</Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Không nhận được email?{" "}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Gửi lại
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Quên mật khẩu?</h1>
                  <p className="text-balance text-muted-foreground">
                    Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
                  </p>
                </div>
                {error && (
                  <p className="text-sm font-medium text-red-500 text-center">{error}</p>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang gửi..." : "Gửi hướng dẫn"}
                </Button>
                <Button variant="ghost" asChild className="w-full">
                  <Link to="/dang-nhap">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại đăng nhập
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}