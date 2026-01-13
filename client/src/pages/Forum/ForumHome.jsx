import { useState } from "react";
import { Loader2 } from "lucide-react";
import PostCard from "./components/PostCard";
import Sidebar from "./components/Sidebar";
import WritePostButton from "./components/WritePostButton";
import SideBar from "../Home/components/SideBar";
import { useGetAll } from "../../hooks/useForum";

const ForumHome = () => {
  const [page, setPage] = useState(1);
  const { data: posts = [], isLoading } = useGetAll();

  // const categories = [
  //   { name: "Tin tức", slug: "tin-tuc", count: 45 },
  //   { name: "Review", slug: "review", count: 32 },
  //   { name: "Thảo luận", slug: "thao-luan", count: 28 },
  //   { name: "Hỏi đáp", slug: "hoi-dap", count: 19 },
  //   { name: "Hướng dẫn", slug: "huong-dan", count: 15 },
  // ];

  // Get trending posts (top 5)
  const trendingPosts = posts.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Header Spacer */}
      <div className="h-[4rem] mt-4" />
      <div className="hidden lg:block lg:w-30 flex-shrink-0 p-4">
        <SideBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[4rem] w-full">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Đang tải...</span>
              </div>
            )}

            {!isLoading && posts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có bài viết nào
                </h3>
                <p className="text-gray-500 text-sm">
                  Hãy là người đầu tiên chia sẻ điều gì đó thú vị!
                </p>
              </div>
            )}
          </main>
          <aside className="lg:col-span-4">
            <Sidebar trendingPosts={trendingPosts} />
          </aside>
        </div>
      </div>
      <WritePostButton />
    </div>
  );
};
export default ForumHome;
