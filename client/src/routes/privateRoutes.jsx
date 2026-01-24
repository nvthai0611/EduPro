import { Route, Navigate } from "react-router-dom";
import Profile from "../pages/User/Profile";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import PageUserManagement from "../pages/Admin/User/Page";
import LayoutAdmin from "../layouts/AdminLayout/Layout";
import PageProductManagement from "../pages/Admin/Product/Page";
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
// Learning Platform Admin Pages
import CourseManagement from "../pages/Admin/CourseManagement/CourseManagement";
import CourseBuilder from "../pages/Admin/CourseManagement/CourseBuilder";
import LearningPlatformDashboard from "../pages/Admin/LearningDashboard/LearningDashboard";
import CourseApprover from "../pages/Admin/CourseManagement/CourseApprover";
import CourseLearnDetail from "../pages/Courses/CourseLearnDetail";
import PaymentPage from "../pages/Cart/CheckOut/PaymentPage";
import CourseAssign from "../pages/Admin/CourseManagement/AssignCoursePage";
import StudentQuestion from "../pages/Admin/StudentQuestion/QuestionPage";
import AttendanceManage from "../pages/Admin/Attendance/Attendance";
// import BannerManagement from "../pages/Admin/Banner/BannerManagement";

// được bảo mật, phải có quyền mới vào được, và phải đăng nhập
export const privateRoutes = (
  <>
    {/* User */}
    <Route
      element={
        <AuthMiddleware allowedRoles={[TYPE_AUTH.ADMIN, TYPE_AUTH.CUSTOMER, TYPE_AUTH.USER]}>
          <DefaultLayout />
        </AuthMiddleware>
      }
    >
      <Route path="/my-learning" element={<MyCourses />} />
      <Route path="/tai-khoan" element={<Profile />} />
      <Route path="/checkout" element={<PaymentPage />} />
    </Route>

    {/* Learning Page - accessible by all authenticated users including staff */}
    <Route
      element={
        <AuthMiddleware allowedRoles={[TYPE_AUTH.CUSTOMER, TYPE_AUTH.USER, TYPE_AUTH.ADMIN, TYPE_AUTH.MANAGER, TYPE_AUTH.STAFF]}>
          <DefaultLayout />
        </AuthMiddleware>
      }
    >
      <Route path="/learn/:slug" element={<CourseLearnDetail />} />
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
      <Route path="courses/:slug/builder" element={<CourseBuilder />} />
      <Route path="manager-review" element={<ReviewPage />} />
      <Route path="manager-coupons" element={<PageCouponsManagement />} />
      <Route path="manager-product" element={<PageProductManagement />} />
      <Route path="dashboard-orders" element={<OrderDashboard />} />
      <Route path="manager-promotion" element={<PagePromotionManagement />} />
      <Route path="customer-care" element={<CustomerCare />} />
      <Route path="setting" element={<SettingPage />} />
      <Route path="approve-courses" element={<CourseApprover />} />
      <Route path="assign-course" element={<CourseAssign />} />
      <Route path="student-question" element={<StudentQuestion/>}/>
      <Route path="attendance" element={<AttendanceManage />}/>
      {/* <Route path="banner" element={<BannerManagement />} /> */}
    </Route>
      
  </>
);
