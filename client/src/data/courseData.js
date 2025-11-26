// client/src/data/courseData.js
export const courseData = [
  {
    id: 1,
    title: "Kiến Thức Nhập Môn IT",
    slug: "kien-thuc-nhap-mon-it",
    category: "frontend", // <-- Frontend
    label: "Kiến Thức Nền Tảng\n(Kiến thức nhập môn)",
    color: "from-red-500 to-red-800",
    students: 137668,
    lessons: 9,
    duration: "3h12p",
    updatedAt: "Cập nhật tháng 11 năm 2022",
    sections: [
      {
        id: 1,
        title: "1. Khái niệm kỹ thuật cần biết",
        items: [
          {
            id: 1,
            title: "1. Mô hình Client - Server là gì?",
            duration: "1:05",
            completed: true,
            videoId: "zoELAirXMJY",
          },
          {
            id: 2,
            title: "2. Domain là gì? Tên miền là gì?",
            duration: "1:04",
            completed: false,
            videoId: "hQ1C-Q8_R4I",
          },
          {
            id: 3,
            title: "3. Mua tên miền F8 | Đăng ký học Offline",
            duration: "1:00",
            completed: false,
            videoId: "tF1R9Ff2l8A",
          },
        ],
      },
      {
        id: 2,
        title: "2. Môi trường, con người IT",
        items: [
          {
            id: 4,
            title: "1. Học IT cần tố chất gì?",
            duration: "24:10",
            completed: false,
            videoId: "0bM7_D6142Y",
          },
          {
            id: 5,
            title: "2. Sinh viên IT đi thực tập cần biết gì?",
            duration: "24:5",
            completed: false,
            videoId: "12345abcdeF",
          },
        ],
      },
      {
        id: 3,
        title: "3. Hoàn thành khóa học",
        items: [
          {
            id: 6,
            title: "1. Hướng dẫn hoàn thành khóa học",
            duration: "13:00",
            completed: false,
            videoId: "qrstu67890V",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Lập trình C++ cơ bản, nâng cao",
    slug: "lap-trinh-cpp-co-ban-nang-cao",
    category: "backend", // <-- Backend
    label: "C++ cơ bản\nđến nâng cao",
    color: "from-cyan-400 to-teal-400",
    students: 38187,
    lessons: 55,
    duration: "10h18p",
    updatedAt: "Cập nhật tháng 10 năm 2023",
    sections: [
      {
        id: 1,
        title: "1. Giới thiệu C++",
        items: [
          {
            id: 1,
            title: "C++ là gì?",
            duration: "5:00",
            completed: true,
            videoId: "KJgsymhVp3U",
          },
        ],
      },
      {
        id: 2,
        title: "2. Biến và kiểu dữ liệu",
        items: [
          {
            id: 2,
            title: "Khai báo biến",
            duration: "8:00",
            completed: false,
            videoId: "another_cpp_id_2",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "HTML CSS từ Zero đến Hero",
    slug: "html-css-zero-to-hero",
    category: "frontend", // <-- Frontend
    label: "HTML, CSS\ntừ zero đến hero",
    color: "from-blue-500 to-blue-700",
    students: 216557,
    lessons: 117,
    duration: "29h5p",
    updatedAt: "Cập nhật tháng 9 năm 2023",
    sections: [
      {
        id: 1,
        title: "1. HTML cơ bản",
        items: [
          {
            id: 1,
            title: "Cấu trúc HTML",
            duration: "7:00",
            completed: true,
            videoId: "k_zYhA4KxGg",
          },
        ],
      },
      {
        id: 2,
        title: "2. CSS giới thiệu",
        items: [
          {
            id: 2,
            title: "CSS là gì",
            duration: "8:30",
            completed: false,
            videoId: "html_css_id_2",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Responsive Với Grid System",
    slug: "responsive-web-design",
    category: "frontend", // <-- Frontend
    label: "Responsive\n@web design",
    color: "from-purple-500 to-pink-500",
    students: 48159,
    lessons: 6,
    duration: "34h31p",
    updatedAt: "Cập nhật tháng 8 năm 2023",
    sections: [
      {
        id: 1,
        title: "1. Giới thiệu Responsive",
        items: [
          {
            id: 1,
            title: "Responsive là gì?",
            duration: "6:00",
            completed: true,
            videoId: "fgQ78T-88Jg",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Javascript ( Cơ bản)",
    slug: "javascript-co-ban",
    category: "frontend", // <-- Frontend
    label: "JavaScript\n( Cơ bản)",
    color: "from-yellow-400 to-orange-400",
    students: 152626,
    lessons: 112,
    duration: "24h18p",
    updatedAt: "Cập nhật tháng 7 năm 2023",
    sections: [
      {
        id: 1,
        title: "1. Cú pháp cơ bản",
        items: [
          {
            id: 1,
            title: "Biến và hằng",
            duration: "8:00",
            completed: true,
            videoId: "W6NZjfMv5W0",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Node & ExpressJS",
    slug: "node-expressjs",
    category: "backend", // <-- Backend
    label: "Node & ExpressJS",
    color: "from-green-600 to-lime-600",
    students: 45617,
    lessons: 36,
    duration: "12h8p",
    updatedAt: "Cập nhật tháng 3 năm 2023",
    sections: [
      {
        id: 1,
        title: "1. Giới thiệu Node.js",
        items: [
          {
            id: 1,
            title: "Cài đặt Node.js",
            duration: "8:00",
            completed: true,
            videoId: "RVj_mI2eM4c",
          },
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Xây Dựng Website với ReactJS",
    slug: "xay-dung-website-voi-reactjs",
    category: "frontend", // <-- Frontend
    label: "React JS\nLearn once, write anywhere",
    color: "from-indigo-900 to-purple-900",
    students: 79299,
    lessons: 112,
    duration: "27h32p",
    updatedAt: "Cập nhật tháng 4 năm 2023",
    sections: [
      {
        id: 1,
        title: "1. Giới thiệu React",
        items: [
          {
            id: 1,
            title: "Component là gì?",
            duration: "10:00",
            completed: true,
            videoId: "S2C_mJ5L-v0",
          },
        ],
      },
    ],
  },
  {
    id: 8,
    title: "Linux cơ bản",
    slug: "linux-co-ban",
    category: "devops", // <-- DevOps
    label: "Linux\nCơ bản",
    color: "from-gray-700 to-black",
    students: 15000,
    lessons: 10,
    duration: "2h30p",
    updatedAt: "Cập nhật tháng 12 năm 2022",
    sections: [
      {
        id: 1,
        title: "1. Lệnh cơ bản Linux",
        items: [
          {
            id: 1,
            title: "ls, cd, mkdir",
            duration: "9:00",
            completed: true,
            videoId: "bN5M80yJpY8",
          },
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Assistant 3D AI",
    slug: "ai-agent-3d",
    category: "mobile", // <-- Mobile
    label: "AI Agent\n3D",
    color: "from-sky-400 to-blue-500",
    students: 5000,
    lessons: 5,
    duration: "1h00p",
    updatedAt: "Cập nhật tháng 1 năm 2023",
    sections: [
      {
        id: 1,
        title: "1. Giới thiệu AI 3D",
        items: [
          {
            id: 1,
            title: "AI 3D làm được gì?",
            duration: "6:00",
            completed: true,
            videoId: "J_tN-Vd9tVw",
          },
        ],
      },
    ],
  },
  {
    id: 10,
    title: "Lập Trình JavaScript Nâng Cao",
    slug: "javascript-nang-cao",
    category: "frontend", // <-- Frontend
    label: "JavaScript\n( Nâng cao)",
    color: "from-orange-500 to-red-500",
    students: 41928,
    lessons: 19,
    duration: "8h41p",
    updatedAt: "Cập nhật tháng 6 năm 2023",
    sections: [
      {
        id: 1,
        title: "1. ES6 trở lên",
        items: [
          {
            id: 1,
            title: "Arrow Functions",
            duration: "7:00",
            completed: true,
            videoId: "ncQx1b87K0g",
          },
        ],
      },
    ],
  },
];
