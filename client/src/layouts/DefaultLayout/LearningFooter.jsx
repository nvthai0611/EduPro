import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Mail, Phone, MapPin, Facebook, Youtube, Instagram, Github, BookOpen, Users, Award, Code } from 'lucide-react';
import LearningPlatformLogo from '../../components/Logo/LearningPlatformLogo';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <LearningPlatformLogo size="lg" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Nền tảng học lập trình hàng đầu Việt Nam. Chúng tôi cung cấp các khóa học chất lượng cao 
              từ cơ bản đến nâng cao, giúp bạn phát triển kỹ năng lập trình và thăng tiến trong sự nghiệp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tất cả khóa học
                </Link>
              </li>
              <li>
                <Link to="/courses?price=free" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Khóa học miễn phí
                </Link>
              </li>
              <li>
                <Link to="/courses?level=beginner" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Khóa học cơ bản
                </Link>
              </li>
              <li>
                <Link to="/courses?level=advanced" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Khóa học nâng cao
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Paths */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lộ trình học</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/learning-paths/frontend" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Frontend Developer
                </Link>
              </li>
              <li>
                <Link to="/learning-paths/backend" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Backend Developer
                </Link>
              </li>
              <li>
                <Link to="/learning-paths/fullstack" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Fullstack Developer
                </Link>
              </li>
              <li>
                <Link to="/learning-paths/mobile" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Mobile Developer
                </Link>
              </li>
              <li>
                <Link to="/learning-paths/devops" className="text-gray-300 hover:text-white transition-colors text-sm">
                  DevOps Engineer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">contact@hoanganit.edu.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">+84 123 456 789</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  Trường Đại Học FPT<br />
                  Khu Công Nghệ Cao Hòa Lạc<br />
                  Km29 Đại Lộ Thăng Long
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm text-gray-400">Khóa học</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-400">Học viên</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">5K+</div>
              <div className="text-sm text-gray-400">Chứng chỉ</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Code className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-gray-400">Giờ học</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024  EduPro Learning Platform. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link to="/refund" className="text-gray-400 hover:text-white transition-colors">
                Chính sách hoàn tiền
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        title="Lên đầu trang"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
