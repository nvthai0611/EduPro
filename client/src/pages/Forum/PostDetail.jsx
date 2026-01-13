
import { useState } from "react";
import { Heart, MessageCircle, Share2, Loader2, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useForumBySlug } from "../../hooks/useForum";

const PostDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);

  const { data: post = {}, isLoading } = useForumBySlug(slug, {
    enabled: !!slug,
  });
 
 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy bài viết
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 mt-4"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Spacer */}
      <div className="h-[4rem] mt-4" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[2rem]">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        {/* Main Content */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-96 overflow-hidden bg-gray-200">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>

          {/* Content Wrapper */}
          <div className="p-8 md:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                {post.category}
              </span>
              <span>{post.createdAt}</span>
              <span>•</span>
              <span>{post.readTime} phút đọc</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200 mb-8">
              <img
                src={post.author?.avatar || "https://i.pravatar.cc/150?img=3"}
                alt={post.author?.authorName || "Author"}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {post.author?.name || "Unknown"}
                </h3>
                <p className="text-gray-600 text-sm">{post.author?.bio || ""}</p>
              </div>
            </div>

            {/* Post Stats */}
            <div className="flex gap-6 mb-8 pb-8 border-b border-gray-200 text-gray-600 text-sm">
              <span className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{post.views}</span>
                <span>lượt xem</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {post.commentsCount}
                </span>
                <span>bình luận</span>
              </span>
            </div>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div
                className="text-gray-700 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200">
              {post.tags?.map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition"
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                    liked
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={liked ? "currentColor" : "none"}
                  />
                  <span>{liked ? (post.likes || 0) + 1 : (post.likes || 0)}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.commentsCount || 0}</span>
                </button>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                <Share2 className="w-5 h-5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;