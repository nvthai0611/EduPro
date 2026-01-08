import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import HeroSection from "./components/HeroSection";
import TabSwitcher from "./components/TabSwitcher";
import PostCard from "./components/PostCard";
import Sidebar from "./components/Sidebar";
import WritePostButton from "./components/WritePostButton";

const ForumHome = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Mock data - Replace with actual API calls
  const generateMockPost = (id) => ({
    _id: id,
    slug: `post-${id}`,
    title: `Đánh giá Dell XPS 14 (2024): Đẹp, mạnh nhưng bạn phải trả giá ${id}`,
    excerpt:
      "Dell XPS 14 (2024) là một trong những laptop cao cấp được chờ đợi nhất của Dell trong năm 2024. Với thiết kế sang trọng và hiệu năng mạnh mẽ...",
    thumbnail: `https://picsum.photos/800/450?random=${id}`,
    author: {
      name: `Nguyễn Văn ${String.fromCharCode(65 + (id % 26))}`,
      avatar: `https://i.pravatar.cc/150?img=${id}`,
    },
    category: ["Review", "Tin tức", "Thảo luận", "Hướng dẫn"][id % 4],
    tags: ["laptop", "dell", "review", "tech"],
    readTime: Math.floor(Math.random() * 10) + 3,
    views: Math.floor(Math.random() * 1000) + 100,
    commentsCount: Math.floor(Math.random() * 50),
    createdAt: `${Math.floor(Math.random() * 7) + 1} ngày trước`,
  });

  // Fetch posts based on active tab
  const fetchPosts = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newPosts = Array.from({ length: 6 }, (_, i) =>
          generateMockPost(pageNum * 6 + i)
        );

        if (pageNum === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        // Simulate end of data
        if (pageNum >= 3) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [activeTab]
  );

  // Fetch featured posts for hero section
  useEffect(() => {
    const featured = Array.from({ length: 4 }, (_, i) =>
      generateMockPost(i + 100)
    );
    setFeaturedPosts(featured);

    const trending = Array.from({ length: 5 }, (_, i) =>
      generateMockPost(i + 200)
    );
    setTrendingPosts(trending);
  }, []);

  // Fetch posts when tab changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [activeTab, fetchPosts]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Load more posts when page changes
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const categories = [
    { name: "Tin tức", slug: "tin-tuc", count: 45 },
    { name: "Review", slug: "review", count: 32 },
    { name: "Thảo luận", slug: "thao-luan", count: 28 },
    { name: "Hỏi đáp", slug: "hoi-dap", count: 19 },
    { name: "Hướng dẫn", slug: "huong-dan", count: 15 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Spacer */}
      <div className="h-[70px]" />

      {/* Tab Switcher - Sticky */}
      <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Bento Grid */}
        <HeroSection featuredPosts={featuredPosts} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Posts Grid - 8 columns */}
          <main className="lg:col-span-8">
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Đang tải...</span>
              </div>
            )}

            {/* End of Content */}
            {!loading && !hasMore && posts.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">
                  Bạn đã xem hết tất cả bài viết
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && posts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có bài viết nào
                </h3>
                <p className="text-gray-500 text-sm">
                  Hãy là người đầu tiên chia sẻ điều gì đó thú vị!
                </p>
              </div>
            )}
          </main>

          {/* Sidebar - 4 columns, Sticky */}
          <aside className="lg:col-span-4">
            <Sidebar trendingPosts={trendingPosts} categories={categories} />
          </aside>
        </div>
      </div>

      {/* Write Post Button - Floating */}
      <WritePostButton />
    </div>
  );
};

export default ForumHome;
