import { Route } from "react-router-dom";
import AdvisoryPage from '../pages/AdvisoryPage';

// Layouts
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

// Pages
import About from "../pages/About/About";
import Login from "../pages/Auth/Login";
import LoginUserForm from "../components/AuthForm/login-user-form";
import RegisterPage from "../pages/Auth/Register";
import ForgotPasswordPage from "../pages/Auth/ForgotPass";
import ConfirmEmailResetPasswordSuccess from "../pages/Auth/ConfirmEmail";
import EmailVerifiedSuccess from "../pages/Admin/User/VerifyPage";
import Assistant3D from "../pages/AI_Agent/Assistant3D";

// Middlewares
import GuestMiddleware from "../middlewares/GuestMiddleware";
import RoleRedirectMiddleware from "../middlewares/RoleRedirectMiddleware";
import CourseList from "../pages/Home/Courses/CourseList";
import CourseDetail from "../pages/Home/Courses/CourseDetail";
import CourseLearnDetail from "../pages/Courses/CourseLearnDetail";
import Profile from "../pages/Auth/Profile";

// Learning Platform

// ========== PUBLIC ROUTES ==========
export const publicRoutes = (
  <>
    {/* Wrapper check role cho toàn bộ public pages */}
    <Route element={<RoleRedirectMiddleware />}>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<CourseList />} />
        <Route path="/about" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/tai-khoan" element={<Profile />} />
        <Route path="/advisory" element={<AdvisoryPage />} />
        {/* Course Routes */}
        <Route path="/courses">
          <Route index element={<CourseList />} />
          <Route path="category/:categorySlug" element={<CourseList />} />
          <Route path="learn/:slug" element={<CourseLearnDetail />} />
          <Route path=":slug" element={<CourseDetail />} />
        </Route>
      </Route>
    </Route>

    {/* Auth Pages – chỉ cho guest vào */}
    <Route element={<AuthLayout />}>
      <Route element={<GuestMiddleware />}>
        <Route path="/dang-nhap" element={<LoginUserForm />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/manager/dang-nhap" element={<Login />} />
        <Route path="/forget-password" element={<ForgotPasswordPage />} />
      </Route>
    </Route>

    {/* Verify email */}
    <Route path="/verify-account/:id" element={<EmailVerifiedSuccess />} />

    {/* Confirm reset password */}
    <Route
      path="/confirm-temp-password"
      element={<ConfirmEmailResetPasswordSuccess />}
    />
  </>
);
