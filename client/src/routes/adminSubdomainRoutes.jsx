import { Route, Navigate } from "react-router-dom";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import LayoutAdmin from "../layouts/AdminLayout/Layout";
import LoginPage from "../pages/Auth/Login";
import { TYPE_AUTH } from "../constains/auth";
import LearningPlatformDashboard from "../pages/Admin/LearningDashboard/LearningDashboard";
import PageUserManagement from "../pages/Admin/User/Page";
import CourseManagement from "../pages/Admin/CourseManagement/CourseManagement";
import CourseBuilder from "../pages/Admin/CourseManagement/CourseBuilder";
import StudentProgress from "../pages/Admin/StudentProgress/StudentProgress";
import CourseApprover from "../pages/Admin/CourseManagement/CourseApprover";
import CourseAssign from "../pages/Admin/CourseManagement/AssignCoursePage";
import StudentQuestion from "../pages/Admin/StudentQuestion/QuestionPage";
import AttendanceManage from "../pages/Admin/Attendance/Attendance";
import ReviewPage from "../pages/Admin/Review/ReviewPage";
import PageCouponsManagement from "../pages/Admin/Coupon/Page";
import PageProductManagement from "../pages/Admin/Product/Page";
import OrderDashboard from "../pages/Admin/DashboardOrder/OrderDashboard";
import PagePromotionManagement from "../pages/Admin/Promotion/Page";
import CustomerCare from "../pages/Admin/CustomerCare/Page";
import SettingPage from "../pages/Admin/Setting/SettingsManagement";
import BannerManagement from "../pages/Admin/Banner/BannerManagement";
import AuthCallback from "../pages/Auth/AuthCallback";

// Routes specifically for admin subdomain (serve admin at root)
export const adminSubdomainRoutes = (
  <>
    {/* Login for admin subdomain */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route
      path="/"
      element={
        <AuthMiddleware allowedRoles={[TYPE_AUTH.ADMIN]}>
          <LayoutAdmin />
        </AuthMiddleware>
      }
    >
      <Route index element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<LearningPlatformDashboard />} />
      <Route path="manager-user" element={<PageUserManagement />} />
      <Route path="manager-courses" element={<CourseManagement />} />
      <Route path="courses/:slug/builder" element={<CourseBuilder />} />
      <Route path="student-progress" element={<StudentProgress />} />
      <Route path="approve-courses" element={<CourseApprover />} />
      <Route path="assign-course" element={<CourseAssign />} />
      <Route path="student-question" element={<StudentQuestion />} />
      <Route path="attendance" element={<AttendanceManage />} />
      <Route path="manager-review" element={<ReviewPage />} />
      <Route path="manager-coupons" element={<PageCouponsManagement />} />
      <Route path="manager-product" element={<PageProductManagement />} />
      <Route path="dashboard-orders" element={<OrderDashboard />} />
      <Route path="manager-promotion" element={<PagePromotionManagement />} />
      <Route path="customer-care" element={<CustomerCare />} />
      <Route path="setting" element={<SettingPage />} />
      <Route path="banner" element={<BannerManagement />} />
    </Route>
  </>
);

export default adminSubdomainRoutes;
