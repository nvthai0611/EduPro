import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PostCard from "./components/PostCard";
import Sidebar from "./components/Sidebar";
import WritePostButton from "./components/WritePostButton";
import SideBar from "../Home/components/SideBar";
import FeedTabs from "./components/FeedTabs";
import { FeedType } from "../../utils/constants";
import { useFeaturedPosts, useGetAllPosts, useTrendingPosts } from "../../hooks/usePost";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

const ForumHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentFeed = searchParams.get("feed") || FeedType.LATEST;
  const pageSize = 5; // Posts per page

  // Fetch posts with pagination
  const { data, isLoading, isFetching } = useGetAllPosts({
    page: currentPage,
    limit: pageSize,
    feed: currentFeed,
    sortBy: "createdAt", // Fallback, ignored by backend if feed is specific
    sortOrder: "desc"
  });

  const posts = useMemo(() => data?.posts || [], [data?.posts]);
  const pagination = useMemo(() => data?.pagination || {}, [data?.pagination]);
  const { data: featuredPosts = [], isLoading: isFeaturedLoading } = useFeaturedPosts({ limit: 4 });
 
  // Fetch trending posts (for sidebar)
  const { data: trendingPosts = [], isLoading: isTrendingLoading } = useTrendingPosts({
    limit: 5,
    timeRange: 7 // Last 7 days
  });
  // Handle feed tab change
  const handleFeedChange = (feed) => {
    setSearchParams({ feed, page: "1" });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setSearchParams({ feed: currentFeed, page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const totalPages = pagination.totalPages || 1;
    const current = currentPage;
    const delta = 2; // Number of pages to show on each side
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Header Spacer */}
      <div className="h-[4rem] mt-4" />
      <div className="hidden lg:block lg:w-30 flex-shrink-0 p-4">
        <SideBar />
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[4rem]">
        {/* Featured Posts Carousel */}
        <div className="bg-white rounded-lg mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Bài viết nổi bật trong tháng
            </h2>
            <Link
              to="/posts/featured"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem thêm →
            </Link>
          </div>

          {isFeaturedLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {featuredPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/posts/${post.slug || post._id}`}
                    className="flex-shrink-0 w-64 bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img
                      src={post.coverImageUrl || "https://via.placeholder.com/256x144"}
                      alt={post.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-3 mb-2 min-h-[3rem] leading-tight">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author?.image || "https://static.vecteezy.com/system/resources/previews/024/766/958/non_2x/default-male-avatar-profile-icon-social-media-user-free-vector.jpg"}
                             alt={post.authorName}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-gray-600">
                          {post.authorName || "Anonymous"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <main className="lg:col-span-8">
            <FeedTabs active={currentFeed} onChange={handleFeedChange} />
            <div className="grid p-4 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Loading State */}
            {(isLoading || isFetching) && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Đang tải...</span>
              </div>
            )}

            {/* Empty State */}
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

            {/* Pagination */}
            {!isLoading && posts.length > 0 && pagination.totalPages >= 1 && (
              <div className="mt-8 mb-6">
                <Pagination>
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className={!pagination.hasPrevPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {pageNumbers.map((pageNum, idx) => (
                      <PaginationItem key={idx}>
                        {pageNum === "..." ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className={!pagination.hasNextPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                {/* Pagination Info */}

              </div>
            )}
          </main>
          <aside className="lg:col-span-4">
            <Sidebar
              trendingPosts={trendingPosts}
              isLoading={isTrendingLoading}
            />
          </aside>
        </div>
      </div>
      <WritePostButton />
    </div>
  );
};
export default ForumHome;
