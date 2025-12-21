"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/auth/authService";
import { toast, ToastContainer } from "react-toastify";

export default function LoginUserForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // // Xử lý OAuth redirect
  // useEffect(() => {
  //   const encodedAuth = searchParams.get("auth");
  //   const error = searchParams.get("error");

  //   if (error) {
  //     toast.error("Đăng nhập thất bại: " + error);
  //     navigate("/dang-nhap", { replace: true });
  //     return;
  //   }

  //     try {
  //       // Giải mã từ Base64
        
  //       // Lưu vào cookie
  //       const isProduction = import.meta.env.VITE_PROD === "production";
  //       const cookieOptions = `path=/; max-age=86400; ${
  //         isProduction ? "secure; samesite=none" : "samesite=lax"
  //       }`;
  //       document.cookie = `render_id=${encodedAuth}; ${cookieOptions}`;
        
  //       toast.success("Đăng nhập thành công!");
  //       setTimeout(() => {
  //         window.location.href = "/";
  //       }, 500);
  //     } catch (err) {
  //       console.error("Decode error:", err);
  //       toast.error("Đăng nhập thất bại");
  //     }
  // }, [searchParams, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const res = await authService.login({ email, password });
      setIsLoading(false);
      if (res.success) {
        toast.success("Đăng nhập thành công");
        window.location.href = "/courses";
        return;
      }
      toast.error(res.message.email || res.message.password || res.message || "Đăng nhập thất bại");
    } catch (error) {
      console.log("error", error);
      toast.error(error.message || "Đăng nhập thất bại");
    }
  };

  return (
    <>
      <ToastContainer autoClose={1000}/>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className="flex flex-col gap-6">
            <Card className="overflow-hidden">
              <CardContent className="grid p-0 md:grid-cols-2">
                <form className="p-6 md:p-8" onSubmit={handleLogin}>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Chào mừng trở lại</h1>
                      <p className="text-balance text-muted-foreground">
                        Đăng nhập vào tài khoản EduPro của bạn
                      </p>
                    </div>

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

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Link
                          to="/forget-password"
                          className="text-sm underline underline-offset-4 hover:text-primary"
                        >
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Nhập mật khẩu"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          </span>
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>

                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Hoặc tiếp tục với
                      </span>
                    </div>
                    {/* href={import.meta.env.VITE_SERVER_API_V1 + "/auth/google"} */}
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() =>
                        (window.location.href =
                          import.meta.env.VITE_SERVER_API_V1 + "/auth/google")
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="mr-2 h-4 w-4"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Đăng nhập với Google
                    </Button>

                    <div className="text-center text-sm">
                      Chưa có tài khoản?{" "}
                      <Link
                        to="/dang-ky"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Đăng ký ngay (Bạn có thể đăng nhập với google để tự động đăng ký)
                      </Link>
                    </div>
                  </div>
                </form>

                <div className="relative hidden bg-muted md:block">
                  <img
                    src="https://img.freepik.com/free-vector/student-graduation-cap-using-computer-desk_1262-21421.jpg?t=st=1764509112~exp=1764512712~hmac=c3a2315bfbc55fc5492c3e8f963355e23d3d3177e3699e3a8727f2a1d3900e84&w=1480"
                    alt="EduPro"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              Bằng cách tiếp tục, bạn đồng ý với{" "}
              <a href="#">Điều khoản dịch vụ</a> và{" "}
              <a href="#">Chính sách bảo mật</a> của chúng tôi.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
