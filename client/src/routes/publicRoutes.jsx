import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Login from "../pages/Auth/Login";
import { Route } from "react-router-dom";
import GuestMiddleware from "../middlewares/GuestMiddleware";
import EmailVerifiedSuccess from "../pages/Admin/User/VerifyPage";
import LoginUserForm from "../components/AuthForm/login-user-form";
import RoleRedirectMiddleware from "../middlewares/RoleRedirectMiddleware";
import Assistant3D from "../pages/AI_Agent/Assistant3D";
import RegisterPage from "../pages/Auth/Register";
import ForgotPasswordPage from "../pages/Auth/ForgotPass";
import ConfirmEmailResetPasswordSuccess from "../pages/Auth/ConfirmEmail";
// Learning Platform Pages
import CourseList from "../pages/Home/Courses/CourseList";
import CourseDetail from "../pages/Home/Courses/CourseDetail";
// choi phép người dùng được phép truy cập ngay cả khi chưa đăng nhập
export const publicRoutes = (
  <>
    {/* Bọc toàn bộ các trang public vào middleware kiểm tra role */}
    <Route element={<RoleRedirectMiddleware />}>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ai-agent" element={<Assistant3D />} />

        {/* Learning Platform Routes */}
        <Route path="/courses">
          <Route path="" element={<CourseList />} />
          <Route path=":slug" element={<CourseDetail />} />
        </Route>
      </Route>
    </Route>

    {/* Các route cho đăng nhập/đăng ký, chỉ cho guest vào */}
    <Route element={<AuthLayout />}>
      <Route element={<GuestMiddleware />}>
        <Route path="/dang-nhap" element={<LoginUserForm />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/manager/dang-nhap" element={<Login />} />
        <Route path="/forget-password" element={<ForgotPasswordPage />} />
      </Route>
    </Route>

    {/* Verify email */}
    <Route path="verify-account/:id" element={<EmailVerifiedSuccess />} />

    {/* Confirm reset password */}
    <Route path="/confirm-temp-password" element={<ConfirmEmailResetPasswordSuccess />} />
  </>
);
