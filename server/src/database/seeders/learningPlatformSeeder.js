const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Category = require("../../models/category.model");
const Course = require("../../models/course.model");
const Module = require("../../models/module.model");
const Lesson = require("../../models/lesson.model");
const Bundle = require("../../models/bundle.model");
const LearningPath = require("../../models/learning_path.model");
const User = require("../../models/user.model");
const Coupon = require("../../models/coupon.model");

const seedData = async () => {
  try {
    console.log("🌱 Starting seed data...");

    // 1. Create Categories
    console.log("📁 Creating categories...");
    const categories = await Category.insertMany([
      {
        name: "Frontend",
        slug: "frontend",
        description: "Khóa học về phát triển giao diện người dùng",
        isActive: true,
      },
      {
        name: "Backend",
        slug: "backend",
        description: "Khóa học về phát triển server và API",
        isActive: true,
      },
      {
        name: "Fullstack",
        slug: "fullstack",
        description: "Khóa học toàn diện về phát triển web",
        isActive: true,
      },
      {
        name: "DevOps",
        slug: "devops",
        description: "Khóa học về triển khai và vận hành hệ thống",
        isActive: true,
      },
    ]);

    // 2. Create Admin User
    console.log("👤 Creating admin user...");
    const adminUser = new User({
      fullName: "Hoàng An IT",
      email: "admin@hoanganit.com",
      password: "admin123",
      role: "admin",
      confirmEmail: true,
      isActive: true,
      status: true,
    });
    await adminUser.save();

    // 3. Create Sample Courses
    console.log("📚 Creating sample courses...");
    
    // Frontend Course
    const frontendCourse = new Course({
      title: "HTML, CSS, JavaScript từ Zero đến Hero",
      slug: "html-css-javascript-tu-zero-den-hero",
      description: "Khóa học toàn diện về HTML, CSS và JavaScript từ cơ bản đến nâng cao. Bạn sẽ học cách xây dựng website responsive và tương tác.",
      thumbnail: "https://via.placeholder.com/400x300/007bff/ffffff?text=HTML+CSS+JS",
      category: categories[0]._id,
      level: "beginner",
      price: 299000,
      salePrice: 199000,
      isPublished: true,
      isFeatured: true,
      whatYouWillLearn: [
        "HTML5 semantic elements và best practices",
        "CSS3 advanced features và responsive design",
        "JavaScript ES6+ và modern development",
        "DOM manipulation và event handling",
        "AJAX và API integration",
        "Web performance optimization",
      ],
      requirements: [
        "Không cần kinh nghiệm lập trình",
        "Máy tính có kết nối internet",
        "Tinh thần học tập tích cực",
      ],
      targetAudience: [
        "Người mới bắt đầu học lập trình",
        "Sinh viên IT muốn củng cố kiến thức",
        "Người muốn chuyển sang nghề lập trình",
      ],
    });
    await frontendCourse.save();

    // React Course
    const reactCourse = new Course({
      title: "ReactJS từ Zero đến Hero",
      slug: "reactjs-tu-zero-den-hero",
      description: "Khóa học ReactJS toàn diện từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hiện đại với React, Redux và các công nghệ liên quan.",
      thumbnail: "https://via.placeholder.com/400x300/61dafb/ffffff?text=React+JS",
      category: categories[0]._id,
      level: "intermediate",
      price: 499000,
      salePrice: 399000,
      isPublished: true,
      isFeatured: true,
      whatYouWillLearn: [
        "React components và JSX",
        "State management với Redux",
        "React Hooks và functional components",
        "Routing với React Router",
        "API integration và data fetching",
        "Testing React applications",
      ],
      requirements: [
        "Kiến thức cơ bản về HTML, CSS, JavaScript",
        "Hiểu biết về ES6+",
        "Máy tính có kết nối internet",
      ],
      targetAudience: [
        "Frontend developers muốn học React",
        "Sinh viên IT có kiến thức cơ bản",
        "Developers muốn nâng cao kỹ năng",
      ],
    });
    await reactCourse.save();

    // Node.js Course
    const nodeCourse = new Course({
      title: "Node.js và Express.js từ Zero đến Hero",
      slug: "nodejs-expressjs-tu-zero-den-hero",
      description: "Khóa học Node.js và Express.js toàn diện. Học cách xây dựng RESTful API, authentication, database integration và deployment.",
      thumbnail: "https://via.placeholder.com/400x300/339933/ffffff?text=Node.js",
      category: categories[1]._id,
      level: "intermediate",
      price: 599000,
      salePrice: 499000,
      isPublished: true,
      isFeatured: true,
      whatYouWillLearn: [
        "Node.js fundamentals và event loop",
        "Express.js framework và middleware",
        "RESTful API design và development",
        "Authentication và authorization",
        "Database integration (MongoDB, MySQL)",
        "Testing và deployment",
      ],
      requirements: [
        "Kiến thức JavaScript cơ bản",
        "Hiểu biết về HTTP và web development",
        "Máy tính có kết nối internet",
      ],
      targetAudience: [
        "Backend developers muốn học Node.js",
        "Fullstack developers",
        "Developers muốn học server-side JavaScript",
      ],
    });
    await nodeCourse.save();

    // Next.js Course
    const nextCourse = new Course({
      title: "Next.js - The Complete Guide",
      slug: "nextjs-the-complete-guide",
      description: "Khóa học Next.js toàn diện từ cơ bản đến nâng cao. Học SSR, SSG, API routes, authentication và deployment với Vercel.",
      thumbnail: "https://via.placeholder.com/400x300/000000/ffffff?text=Next.js",
      category: categories[0]._id,
      level: "advanced",
      price: 699000,
      salePrice: 599000,
      isPublished: true,
      isFeatured: false,
      whatYouWillLearn: [
        "Next.js fundamentals và file-based routing",
        "Server-side rendering (SSR) và static generation (SSG)",
        "API routes và middleware",
        "Authentication với NextAuth.js",
        "Database integration và ORM",
        "Deployment và optimization",
      ],
      requirements: [
        "Kiến thức React cơ bản",
        "Hiểu biết về JavaScript ES6+",
        "Kinh nghiệm với npm/yarn",
      ],
      targetAudience: [
        "React developers muốn học Next.js",
        "Fullstack developers",
        "Developers muốn học modern React framework",
      ],
    });
    await nextCourse.save();

    // 4. Create Modules and Lessons
    console.log("📖 Creating modules and lessons...");

    // Frontend Course Modules
    const frontendModules = await Module.insertMany([
      {
        courseId: frontendCourse._id,
        title: "Module 1: HTML Cơ bản",
        description: "Học HTML từ cơ bản đến nâng cao",
        order: 1,
      },
      {
        courseId: frontendCourse._id,
        title: "Module 2: CSS Styling",
        description: "CSS cơ bản và responsive design",
        order: 2,
      },
      {
        courseId: frontendCourse._id,
        title: "Module 3: JavaScript Fundamentals",
        description: "JavaScript từ cơ bản đến ES6+",
        order: 3,
      },
    ]);

    // Create lessons for frontend course
    const frontendLessons = await Lesson.insertMany([
      // Module 1 lessons
      {
        moduleId: frontendModules[0]._id,
        courseId: frontendCourse._id,
        title: "Giới thiệu về HTML",
        description: "Tìm hiểu HTML là gì và cách sử dụng",
        order: 1,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoDuration: 600, // 10 minutes
        isFree: true,
      },
      {
        moduleId: frontendModules[0]._id,
        courseId: frontendCourse._id,
        title: "HTML Elements và Tags",
        description: "Học các HTML elements cơ bản",
        order: 2,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoDuration: 900, // 15 minutes
        isFree: true,
      },
      {
        moduleId: frontendModules[0]._id,
        courseId: frontendCourse._id,
        title: "HTML Forms",
        description: "Tạo form với HTML",
        order: 3,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoDuration: 1200, // 20 minutes
        isFree: true,
      },
      // Module 2 lessons
      {
        moduleId: frontendModules[1]._id,
        courseId: frontendCourse._id,
        title: "CSS Selectors",
        description: "Học CSS selectors cơ bản",
        order: 1,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoDuration: 800, // 13 minutes
        isFree: false,
      },
      {
        moduleId: frontendModules[1]._id,
        courseId: frontendCourse._id,
        title: "CSS Layout với Flexbox",
        description: "Sử dụng Flexbox để layout",
        order: 2,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoDuration: 1000, // 16 minutes
        isFree: false,
      },
    ]);

    // Update modules with lessons
    frontendModules[0].lessons = [frontendLessons[0]._id, frontendLessons[1]._id, frontendLessons[2]._id];
    frontendModules[1].lessons = [frontendLessons[3]._id, frontendLessons[4]._id];
    await Promise.all(frontendModules.map(module => module.save()));

    // Update course with modules
    frontendCourse.modules = frontendModules.map(module => module._id);
    frontendCourse.previewLessons = [frontendLessons[0]._id, frontendLessons[1]._id, frontendLessons[2]._id];
    await frontendCourse.save();

    // 5. Create Bundles
    console.log("📦 Creating bundles...");
    const frontendBundle = new Bundle({
      title: "Combo Frontend Master",
      slug: "combo-frontend-master",
      description: "Combo gồm HTML/CSS/JS + React + Next.js - Trở thành Frontend Developer chuyên nghiệp",
      thumbnail: "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Frontend+Master",
      courses: [frontendCourse._id, reactCourse._id, nextCourse._id],
      originalPrice: 1497000, // 299 + 499 + 699
      bundlePrice: 999000,
      discount: 33,
      isActive: true,
    });
    await frontendBundle.save();

    const fullstackBundle = new Bundle({
      title: "Combo Fullstack Developer",
      slug: "combo-fullstack-developer",
      description: "Combo toàn diện Frontend + Backend - Trở thành Fullstack Developer",
      thumbnail: "https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Fullstack+Dev",
      courses: [frontendCourse._id, reactCourse._id, nodeCourse._id],
      originalPrice: 1397000, // 299 + 499 + 599
      bundlePrice: 899000,
      discount: 36,
      isActive: true,
    });
    await fullstackBundle.save();

    // 6. Create Learning Paths
    console.log("🛤️ Creating learning paths...");
    const frontendPath = new LearningPath({
      title: "Lộ trình Frontend Developer",
      slug: "lo-trinh-frontend-developer",
      description: "Lộ trình học Frontend từ cơ bản đến nâng cao, trở thành Frontend Developer chuyên nghiệp",
      thumbnail: "https://via.placeholder.com/400x300/ff9ff3/ffffff?text=Frontend+Path",
      courses: [
        { courseId: frontendCourse._id, order: 1, isRequired: true },
        { courseId: reactCourse._id, order: 2, isRequired: true },
        { courseId: nextCourse._id, order: 3, isRequired: false },
      ],
      estimatedDuration: "6 tháng",
      level: "beginner",
      isPublished: true,
    });
    await frontendPath.save();

    const fullstackPath = new LearningPath({
      title: "Lộ trình Fullstack Developer",
      slug: "lo-trinh-fullstack-developer",
      description: "Lộ trình học Fullstack từ Frontend đến Backend, trở thành Fullstack Developer",
      thumbnail: "https://via.placeholder.com/400x300/54a0ff/ffffff?text=Fullstack+Path",
      courses: [
        { courseId: frontendCourse._id, order: 1, isRequired: true },
        { courseId: reactCourse._id, order: 2, isRequired: true },
        { courseId: nodeCourse._id, order: 3, isRequired: true },
      ],
      estimatedDuration: "8 tháng",
      level: "beginner",
      isPublished: true,
    });
    await fullstackPath.save();

    // 7. Create Coupons
    console.log("🎫 Creating coupons...");
    await Coupon.insertMany([
      {
        code: "WELCOME10",
        discountType: "percentage",
        discountValue: 10,
        applicableToAll: true,
        maxUses: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        description: "Giảm 10% cho khách hàng mới",
      },
      {
        code: "FRONTEND20",
        discountType: "percentage",
        discountValue: 20,
        applicableToAll: false,
        applicableCourses: [frontendCourse._id, reactCourse._id, nextCourse._id],
        maxUses: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        description: "Giảm 20% cho các khóa Frontend",
      },
      {
        code: "SAVE50K",
        discountType: "fixed",
        discountValue: 50000,
        applicableToAll: true,
        minOrderAmount: 200000,
        maxUses: 200,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        description: "Giảm 50k cho đơn hàng từ 200k",
      },
    ]);

    console.log("✅ Seed data completed successfully!");
    console.log(`📊 Created:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - 1 admin user`);
    console.log(`   - 4 courses`);
    console.log(`   - ${frontendModules.length} modules`);
    console.log(`   - ${frontendLessons.length} lessons`);
    console.log(`   - 2 bundles`);
    console.log(`   - 2 learning paths`);
    console.log(`   - 3 coupons`);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
};

module.exports = seedData;
