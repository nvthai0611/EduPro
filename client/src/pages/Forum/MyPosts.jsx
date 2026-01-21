import { Loader2, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostCard from "./components/PostCard";

import WritePostButton from "./components/WritePostButton";
import SideBar from "../Home/components/SideBar";
import { useMyPosts } from "../../hooks/usePost";
import { useAuth } from "../../hooks/useAuth";

const MyPosts = () => {
    const navigate = useNavigate();
    const { user, isLoading: isAuthLoading } = useAuth();

    const { data: posts = [], isLoading: isPostsLoading } = useMyPosts({
        enabled: !isAuthLoading && !!user,
    });

    const isLoading = isAuthLoading || isPostsLoading;

    // For trending sidebar (we can still show global trending or user trending)
    // Let's just show an empty array or fetch global ones if needed.
    // For now, let's keep it simple.

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Header Spacer */}
            <div className="h-[4rem] mt-4" />
            <div className="hidden lg:block lg:w-30 flex-shrink-0 p-4">
                <SideBar />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[4rem] w-full">
                {/* Back Button and Title */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/forum")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Quay lại Diễn đàn</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Bài viết của tôi</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Quản lý tất cả bài viết bạn đã chia sẻ với cộng đồng
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <main className="lg:col-span-8">
                        <div className="grid p-4 gap-6">
                            {posts.map((post) => (
                                <PostCard key={post.slug} post={post} canEdit={true} />
                            ))}
                        </div>
                        {isLoading && (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                <span className="ml-3 text-gray-600">Đang tải...</span>
                            </div>
                        )}

                        {!isLoading && posts.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Bạn chưa có bài viết nào
                                </h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    Hãy bắt đầu chia sẻ kiến thức của bạn ngay hôm nay!
                                </p>
                                <button
                                    onClick={() => navigate("/forum/create")}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
                                >
                                    Viết bài ngay
                                </button>
                            </div>
                        )}
                    </main>
                    {/* <aside className="lg:col-span-4">
                        <Sidebar trendingPosts={trendingPosts} />
                    </aside> */}
                </div>
            </div>
            <WritePostButton />
        </div>
    );
};

export default MyPosts;
