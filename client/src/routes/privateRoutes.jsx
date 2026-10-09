import { Route } from "react-router-dom";
import Profile from "../pages/User/Profile";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import { TYPE_AUTH } from "../constains/auth";
// Learning Platform Pages
import MyCourses from "../pages/User/MyCourses";
import CourseLearnDetail from "../pages/Courses/CourseLearnDetail";
import PaymentPage from "../pages/Cart/CheckOut/PaymentPage";
import CodeEditorPage from "../pages/Judge/CodeEditorPage";
import ProblemListPage from "../pages/Judge/ProblemListPage";
import HeaderOnlyLayout from "../layouts/DefaultLayout/HeaderOnlyLayout";

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
      <Route path="/problems" element={<ProblemListPage />} />
    </Route>

    <Route
      element={
        <AuthMiddleware allowedRoles={[TYPE_AUTH.ADMIN, TYPE_AUTH.CUSTOMER, TYPE_AUTH.USER]}>
          <HeaderOnlyLayout />
        </AuthMiddleware>
      }
    >
      <Route path="/problems/:slug" element={<CodeEditorPage />} />
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
  </>
);
