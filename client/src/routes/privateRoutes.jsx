import { Route, Navigate } from "react-router-dom";
import Profile from "../pages/Auth/Profile";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import PageUserManagement from "../pages/Admin/User/Page";
import LayoutAdmin from "../layouts/AdminLayout/Layout";
import PageProductManagement from "../pages/Admin/Product/Page";
import AdminDashboard from "../pages/Admin/Dasboard/revenue-dashboard";
import PageCouponsManagement from "../pages/Admin/Coupon/Page";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import { TYPE_AUTH } from "../constains/auth";
import OrderDashboard from "../pages/Admin/DashboardOrder/OrderDashboard";
import ReviewPage from "../pages/Admin/Review/ReviewPage";
import PagePromotionManagement from "../pages/Admin/Promotion/Page";
import CustomerCare from "../pages/Admin/CustomerCare/Page";
import SettingPage from "../pages/Admin/Setting/SettingsManagement";
// Learning Platform Pages
import MyCourses from "../pages/User/MyCourses";
import LearningPage from "../pages/Learning/LearningPage";
// Learning Platform Admin Pages
import CourseManagement from "../pages/Admin/CourseManagement/CourseManagement";
import StudentProgress from "../pages/Admin/StudentProgress/StudentProgress";
import LearningPlatformDashboard from "../pages/Admin/LearningDashboard/LearningDashboard";

// được bảo mật, phải có quyền mới vào được, và phải đăng nhập
export const privateRoutes = (
  <>
    {/* User */}
    <Route
      element={
        <AuthMiddleware allowedRoles={[TYPE_AUTH.CUSTOMER, TYPE_AUTH.USER]}>
          <DefaultLayout />
        </AuthMiddleware>
      }
    >
      <Route path="/my-learning" element={<MyCourses />} />
      <Route path="/learn/:courseId/:lessonId" element={<LearningPage />} />
      <Route path="/tai-khoan" element={<Profile />} />
    </Route>

    {/* Admin */}
    <Route
      path="/admin"
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
      <Route path="student-progress" element={<StudentProgress />} />
      <Route path="manager-review" element={<ReviewPage />} />
      <Route path="manager-coupons" element={<PageCouponsManagement />} />
      <Route path="manager-product" element={<PageProductManagement />} />
      <Route path="dashboard-orders" element={<OrderDashboard />} />
      <Route path="manager-promotion" element={<PagePromotionManagement />} />
      <Route path="customer-care" element={<CustomerCare />} />
      <Route path="setting" element={<SettingPage />} />
    </Route>
      
  </>
);
