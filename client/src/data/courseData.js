// client/src/data/courseData.js
export const courseData = [
  {
    id: 1,
    title: "Kiến Thức Nhập Môn IT",
    slug: "kien-thuc-nhap-mon-it",
    updatedAt: "Cập nhật tháng 11 năm 2022",
    sections: [
      {
        title: "1. Khái niệm kỹ thuật cần biết",
        items: [
          // SỬ DỤNG ID MỚI ĐÃ KIỂM TRA
          { id: 1, title: "Mô hình Client - Server là gì?", duration: "1:05", isVideo: true, completed: true, videoId: "zoELAirXMJY" },
          { id: 2, title: "Domain là gì? Tên miền là gì?", duration: "1:04", isVideo: true, completed: false, videoId: "hQ1C-Q8_R4I" }, // ID giả định, cần thay
          { id: 3, title: "Mua tên miền F8 | Đăng ký học Offline", duration: "1:00", isVideo: true, completed: false, videoId: "tF1R9Ff2l8A" }, // ID giả định, cần thay
        ]
      },
      {
        title: "2. Môi trường, con người IT",
        items: [
          { id: 4, title: "Học IT cần tố chất gì? Góc nhìn khác từ chuyên gia định hướng, giáo dục", duration: "24:10", isVideo: true, completed: false, videoId: "0bM7_D6142Y" }, // ID giả định, cần thay
          { id: 5, title: "Sinh viên IT đi thực tập tại doanh nghiệp cần biết những gì?", duration: "24:5", isVideo: true, completed: false, videoId: "12345abcdeF" }, 
          { id: 6, title: "Trải nghiệm thực tế sau 2 tháng làm việc tại doanh nghiệp của học viên F8?", duration: "47:13", isVideo: true, completed: false, videoId: "67890fghijK" },
        ]
      },
      {
        title: "3. Phương pháp, định hướng",
        items: [
          { id: 7, title: "Phương pháp, định hướng (1)", duration: "10:27", isVideo: true, completed: false, videoId: "klmno12345P" },
        ]
      },
      {
        title: "4. Hoàn thành khóa học",
        items: [
          { id: 8, title: "Hướng dẫn hoàn thành khóa học", duration: "13:00", isVideo: true, completed: false, videoId: "qrstu67890V" },
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Lập trình C++ cơ bản, nâng cao",
    slug: "lap-trinh-cpp-co-ban-nang-cao",
    updatedAt: "Cập nhật tháng 10 năm 2023",
    sections: [
      {
        title: "1. Giới thiệu C++",
        items: [
          { id: 1, title: "C++ là gì?", duration: "5:00", isVideo: true, completed: true, videoId: "KJgsymhVp3U" }, // ID giả định, cần thay
          { id: 2, title: "Cài đặt môi trường phát triển", duration: "10:00", isVideo: true, completed: false, videoId: "another_cpp_id_1" },
        ]
      },
      {
        title: "2. Biến và kiểu dữ liệu",
        items: [
          { id: 3, title: "Khai báo và sử dụng biến", duration: "8:00", isVideo: true, completed: false, videoId: "another_cpp_id_2" },
          { id: 4, title: "Các kiểu dữ liệu cơ bản", duration: "7:30", isVideo: true, completed: false, videoId: "another_cpp_id_3" },
        ]
      },
    ]
  },
  {
    id: 3,
    title: "HTML CSS từ Zero đến Hero",
    slug: "html-css-zero-to-hero",
    updatedAt: "Cập nhật tháng 9 năm 2023",
    sections: [
      {
        title: "1. HTML cơ bản",
        items: [
          { id: 1, title: "Cấu trúc một trang HTML", duration: "7:00", isVideo: true, completed: true, videoId: "k_zYhA4KxGg" }, // ID giả định, cần thay
          { id: 2, title: "Các thẻ phổ biến", duration: "12:00", isVideo: true, completed: false, videoId: "html_css_id_1" },
        ]
      },
      {
        title: "2. CSS giới thiệu",
        items: [
          { id: 3, title: "CSS là gì và cách nhúng", duration: "8:30", isVideo: true, completed: false, videoId: "html_css_id_2" },
          { id: 4, title: "Selector cơ bản", duration: "9:15", isVideo: true, completed: false, videoId: "html_css_id_3" },
        ]
      },
    ]
  },
  // ... (Thêm các khóa học còn lại tương tự)
];