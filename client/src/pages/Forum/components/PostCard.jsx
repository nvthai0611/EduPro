import { Link } from "react-router-dom";
import { Clock, Eye, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useState } from "react";

const PostCard = ({ post, variant = "default" }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    // TODO: Implement share functionality
    console.log("Share post:", post._id);
  };

  if (variant === "compact") {
    const postPath = post.slug || post._id;
    return (
      <Link
        to={`/posts/${postPath}`}
        className="group flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <img
          src={post.coverImageUrl || "https://via.placeholder.com/120x80"}
          alt={post.title}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
            {post.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{post.authorName || "Anonymous"}</span>
            <span>•</span>
            <span>{post.readTime || "5"} phút</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="group bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
      <Link to={`/posts/${post.slug || post._id}`} className="block">
        {/* Thumbnail */}
        <div className="float-left w-48 mr-4 mb-2 relative overflow-hidden bg-gray-200 rounded-lg">
          <img
            src={post.coverImageUrl || "https://via.placeholder.com/800x450"}
            alt={post.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {post.category && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
              {post.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar || "https://i.pravatar.cc/40"}
                alt={post.authorName}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.authorName || "Anonymous"}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{post.createdAt || "1 ngày trước"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime || "5"} phút
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Bookmark"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isBookmarked ? "fill-blue-600 text-blue-600" : "text-gray-400"
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.commentsCount || 0}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
