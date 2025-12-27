import { Route } from "react-router-dom";
import AdvisoryPage from '../pages/Home/AdvisoryPage';

// Layouts
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";

// Pages
import About from "../pages/About/About";

// Middlewares
import RoleRedirectMiddleware from "../middlewares/RoleRedirectMiddleware";
import CourseList from "../pages/Courses/CourseList";
import CourseDetail from "../pages/Courses/CourseDetail";
// import Home from "../pages/Home/Home";

// Learning Platform

// ========== PUBLIC ROUTES ==========
export const publicRoutes = (
  <>
    {/* Wrapper check role cho toàn bộ public pages */}
    <Route element={<RoleRedirectMiddleware />}>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<CourseList />} />
        <Route path="/about" element={<About />} />
        <Route path="/advisory" element={<AdvisoryPage />} />
        {/* Course Routes */}
        <Route path="/courses">
          <Route index element={<CourseList />} />
          <Route path="category/:categorySlug" element={<CourseList />} />
          <Route path=":slug" element={<CourseDetail />} />
        </Route>
      </Route>
    </Route>
  </>
);
