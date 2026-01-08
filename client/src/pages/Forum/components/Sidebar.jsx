import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Calendar, Users, Search } from "lucide-react";
import PostCard from "./PostCard";

const Sidebar = ({ trendingPosts = [], categories = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search
    console.log("Search:", searchQuery);
  };

  return (
    <aside className="space-y-6">
      {/* Search Box */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 sticky top-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </form>
      </div>

      {/* Trending Posts */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 sticky top-24">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Đang thịnh hành</h3>
        </div>
        <div className="space-y-1">
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post, index) => (
              <PostCard key={post._id || index} post={post} variant="compact" />
            ))
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">
              Chưa có bài viết nào
            </p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 sticky top-[420px]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Chủ đề</h3>
        </div>
        <div className="space-y-2">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Link
                key={index}
                to={`/forum/category/${category.slug}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {category.name}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category.count || 0}
                </span>
              </Link>
            ))
          ) : (
            <div className="space-y-2">
              {["Tin tức", "Review", "Thảo luận", "Hỏi đáp", "Hướng dẫn"].map(
                (cat, index) => (
                  <Link
                    key={index}
                    to={`/forum/category/${cat.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {cat}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {Math.floor(Math.random() * 50)}
                    </span>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter/CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white sticky top-[720px]">
        <Calendar className="w-8 h-8 mb-3" />
        <h3 className="text-lg font-bold mb-2">Nhận tin mới nhất</h3>
        <p className="text-sm text-blue-100 mb-4">
          Đăng ký để không bỏ lỡ những bài viết mới nhất từ cộng đồng
        </p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="Email của bạn"
            className="w-full px-4 py-2.5 text-sm text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="w-full bg-white text-blue-600 font-medium py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Đăng ký ngay
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;
