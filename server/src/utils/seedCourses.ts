import mongoose from 'mongoose';
import CourseModel from '../modules/course/course.model';

// Dữ liệu seed từ courseData.js
const coursesData = [
  {
    title: "Kiến Thức Nhập Môn IT",
    slug: "kien-thuc-nhap-mon-it",
    description: "Khóa học cơ bản giúp bạn hiểu về các khái niệm nền tảng trong lĩnh vực IT",
    category: "frontend",
    price: 0,
    salePrice: 0,
    level: "beginner",
    rating: 4.8,
    reviewCount: 1500,
    totalStudents: 137668,
    totalDuration: 192, // 3h12p = 192 phút
    thumbnail: "https://via.placeholder.com/600x400?text=Kien+Thuc+Nhap+Mon+IT",
    whatYouWillLearn: [
      "Hiểu được mô hình Client-Server",
      "Nắm vững khái niệm Domain và cách hoạt động",
      "Biết cách đăng ký tên miền",
      "Hiểu môi trường làm việc IT"
    ],
    requirements: [
      "Không cần kiến thức gì trước đó",
      "Máy tính có kết nối internet",
      "Đam mê học hỏi"
    ],
    targetAudience: [
      "Người mới bắt đầu học IT",
      "Sinh viên IT năm nhất",
      "Người muốn chuyển ngành sang IT"
    ],
    modules: [
      {
        title: "1. Khái niệm kỹ thuật cần biết",
        lessons: [
          {
            title: "1. Mô hình Client - Server là gì?",
            videoDuration: 65,
            isFree: true
          },
          {
            title: "2. Domain là gì? Tên miền là gì?",
            videoDuration: 64,
            isFree: true
          },
          {
            title: "3. Mua tên miền F8 | Đăng ký học Offline",
            videoDuration: 60,
            isFree: false
          }
        ]
      },
      {
        title: "2. Môi trường, con người IT",
        lessons: [
          {
            title: "1. Học IT cần tố chất gì?",
            videoDuration: 1450,
            isFree: false
          },
          {
            title: "2. Sinh viên IT đi thực tập cần biết gì?",
            videoDuration: 1445,
            isFree: false
          }
        ]
      }
    ]
  },
  {
    title: "Lập trình C++ cơ bản, nâng cao",
    slug: "lap-trinh-cpp-co-ban-nang-cao",
    description: "Khóa học C++ từ cơ bản đến nâng cao, phù hợp cho người mới bắt đầu",
    category: "backend",
    price: 0,
    salePrice: 0,
    level: "intermediate",
    rating: 4.7,
    reviewCount: 800,
    totalStudents: 38187,
    totalDuration: 618, // 10h18p
    thumbnail: "https://via.placeholder.com/600x400?text=C++",
    whatYouWillLearn: [
      "Nắm vững cú pháp C++",
      "Hiểu về OOP trong C++",
      "Làm việc với con trỏ và bộ nhớ",
      "Xây dựng ứng dụng thực tế"
    ],
    requirements: [
      "Kiến thức cơ bản về lập trình",
      "Máy tính cài đặt được compiler C++"
    ],
    targetAudience: [
      "Sinh viên ngành CNTT",
      "Người muốn học lập trình hệ thống",
      "Lập trình viên muốn nâng cao kỹ năng"
    ],
    modules: [
      {
        title: "1. Giới thiệu C++",
        lessons: [
          {
            title: "C++ là gì?",
            videoDuration: 300,
            isFree: true
          }
        ]
      }
    ]
  },
  {
    title: "HTML CSS từ Zero đến Hero",
    slug: "html-css-zero-to-hero",
    description: "Khóa học HTML CSS toàn diện từ cơ bản đến nâng cao",
    category: "frontend",
    price: 0,
    salePrice: 0,
    level: "beginner",
    rating: 4.9,
    reviewCount: 2500,
    totalStudents: 216557,
    totalDuration: 1745, // 29h5p
    thumbnail: "https://via.placeholder.com/600x400?text=HTML+CSS",
    whatYouWillLearn: [
      "Hiểu cấu trúc HTML",
      "Styling với CSS",
      "Responsive Design",
      "Xây dựng website hoàn chỉnh"
    ],
    requirements: [
      "Không cần kiến thức trước",
      "Máy tính có trình duyệt web"
    ],
    targetAudience: [
      "Người mới bắt đầu học web",
      "Designer muốn học code",
      "Người muốn xây dựng website"
    ],
    modules: [
      {
        title: "1. HTML cơ bản",
        lessons: [
          {
            title: "Cấu trúc HTML",
            videoDuration: 420,
            isFree: true
          }
        ]
      }
    ]
  },
  {
    title: "Responsive Với Grid System",
    slug: "responsive-web-design",
    description: "Học cách xây dựng website responsive với Grid System",
    category: "frontend",
    price: 0,
    salePrice: 0,
    level: "intermediate",
    rating: 4.6,
    reviewCount: 600,
    totalStudents: 48159,
    totalDuration: 2071, // 34h31p
    thumbnail: "https://via.placeholder.com/600x400?text=Responsive",
    whatYouWillLearn: [
      "Hiểu về Responsive Design",
      "Sử dụng Grid System",
      "Media Queries",
      "Mobile First Design"
    ],
    requirements: [
      "Biết HTML CSS cơ bản"
    ],
    targetAudience: [
      "Web Developer",
      "Front-end Developer"
    ],
    modules: [
      {
        title: "1. Giới thiệu Responsive",
        lessons: [
          {
            title: "Responsive là gì?",
            videoDuration: 360,
            isFree: true
          }
        ]
      }
    ]
  },
  {
    title: "Javascript ( Cơ bản)",
    slug: "javascript-co-ban",
    description: "Khóa học JavaScript cơ bản toàn diện",
    category: "frontend",
    price: 0,
    salePrice: 0,
    level: "beginner",
    rating: 4.8,
    reviewCount: 3000,
    totalStudents: 152626,
    totalDuration: 1458, // 24h18p
    thumbnail: "https://via.placeholder.com/600x400?text=JavaScript",
    whatYouWillLearn: [
      "Cú pháp JavaScript",
      "DOM Manipulation",
      "Event Handling",
      "ES6+ Features"
    ],
    requirements: [
      "Biết HTML CSS cơ bản"
    ],
    targetAudience: [
      "Người mới học lập trình web",
      "Front-end Developer"
    ],
    modules: [
      {
        title: "1. Cú pháp cơ bản",
        lessons: [
          {
            title: "Biến và hằng",
            videoDuration: 480,
            isFree: true
          }
        ]
      }
    ]
  },
  {
    title: "Node & ExpressJS",
    slug: "node-expressjs",
    description: "Học Node.js và ExpressJS để xây dựng Backend",
    category: "backend",
    price: 0,
    salePrice: 0,
    level: "intermediate",
    rating: 4.7,
    reviewCount: 900,
    totalStudents: 45617,
    totalDuration: 728, // 12h8p
    thumbnail: "https://via.placeholder.com/600x400?text=Node+Express",
    whatYouWillLearn: [
      "Node.js cơ bản",
      "ExpressJS Framework",
      "RESTful API",
      "Database Integration"
    ],
    requirements: [
      "Biết JavaScript cơ bản"
    ],
    targetAudience: [
      "Back-end Developer",
      "Full-stack Developer"
    ],
    modules: [
      {
        title: "1. Giới thiệu Node.js",
        lessons: [
          {
            title: "Cài đặt Node.js",
            videoDuration: 480,
            isFree: true
          }
        ]
      }
    ]
  },
  {
    title: "Xây Dựng Website với ReactJS",
    slug: "xay-dung-website-voi-reactjs",
    description: "Khóa học ReactJS toàn diện",
    category: "frontend",
    price: 0,
    salePrice: 0,
    level: "intermediate",
    rating: 4.9,
    reviewCount: 1800,
    totalStudents: 79299,
    totalDuration: 1652, // 27h32p
    thumbnail: "https://via.placeholder.com/600x400?text=ReactJS",
    whatYouWillLearn: [
      "React Components",
      "State Management",
      "React Hooks",
      "React Router"
    ],
    requirements: [
      "Biết JavaScript cơ bản"
    ],
    targetAudience: [
      "Front-end Developer",
      "Web Developer"
    ],
    modules: [
      {
        title: "1. Giới thiệu React",
        lessons: [
          {
            title: "Component là gì?",
            videoDuration: 600,
            isFree: true
          }
        ]
      }
    ]
  },
  {
    title: "Linux cơ bản",
    slug: "linux-co-ban",
    description: "Học Linux từ cơ bản",
    category: "devops",
    price: 0,
    salePrice: 0,
    level: "beginner",
    rating: 4.5,
    reviewCount: 400,
    totalStudents: 15000,
    totalDuration: 150, // 2h30p
    thumbnail: "https://via.placeholder.com/600x400?text=Linux",
    whatYouWillLearn: [
      "Lệnh Linux cơ bản",
      "File System",
      "User Management",
      "Bash Scripting"
    ],
    requirements: [
      "Không cần kiến thức trước"
    ],
    targetAudience: [
      "DevOps Engineer",
      "System Administrator"
    ],
    modules: [
      {
        title: "1. Lệnh cơ bản Linux",
        lessons: [
          {
            title: "ls, cd, mkdir",
            videoDuration: 540,
            isFree: true
          }
        ]
      }
    ]
  },
  {
    title: "Assistant 3D AI",
    slug: "ai-agent-3d",
    description: "Xây dựng AI Agent 3D",
    category: "mobile",
    price: 0,
    salePrice: 0,
    level: "advanced",
    rating: 4.8,
    reviewCount: 200,
    totalStudents: 5000,
    totalDuration: 60, // 1h00p
    thumbnail: "https://via.placeholder.com/600x400?text=AI+3D",
    whatYouWillLearn: [
      "AI cơ bản",
      "3D Graphics",
      "Voice Assistant",
      "Mobile Integration"
    ],
    requirements: [
      "Biết lập trình cơ bản"
    ],
    targetAudience: [
      "AI Developer",
      "Mobile Developer"
    ],
    modules: [
      {
        title: "1. Giới thiệu AI 3D",
        lessons: [
          {
            title: "AI 3D làm được gì?",
            videoDuration: 360,
            isFree: true
          }
        ]
      }
    ]
  },
  {
    title: "Lập Trình JavaScript Nâng Cao",
    slug: "javascript-nang-cao",
    description: "JavaScript nâng cao cho developer",
    category: "frontend",
    price: 0,
    salePrice: 0,
    level: "advanced",
    rating: 4.7,
    reviewCount: 700,
    totalStudents: 41928,
    totalDuration: 521, // 8h41p
    thumbnail: "https://via.placeholder.com/600x400?text=JS+Advanced",
    whatYouWillLearn: [
      "ES6+ Features",
      "Async Programming",
      "Design Patterns",
      "Performance Optimization"
    ],
    requirements: [
      "Biết JavaScript cơ bản"
    ],
    targetAudience: [
      "Experienced Developer",
      "Senior Developer"
    ],
    modules: [
      {
        title: "1. ES6 trở lên",
        lessons: [
          {
            title: "Arrow Functions",
            videoDuration: 420,
            isFree: true
          }
        ]
      }
    ]
  }
];

export async function seedCourses() {
  try {
    // Delete existing courses (optional - bỏ comment nếu muốn xóa data cũ)
    // await CourseModel.deleteMany({});
    
    // Insert courses with default manager_id (update with actual manager ID)
    const defaultManagerId = new mongoose.Types.ObjectId('6924fceeb66f9b47480a96a0');
    
    const coursesWithManager = coursesData.map(course => ({
      ...course,
      manager_id: defaultManagerId,
      status: 'published'
    }));
    
    const result = await CourseModel.insertMany(coursesWithManager);
    console.log(`✅ Seeded ${result.length} courses successfully!`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    throw error;
  }
}

// Uncomment để chạy script độc lập
// seedCourses().then(() => process.exit(0));
