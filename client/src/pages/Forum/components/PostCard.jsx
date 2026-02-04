import { useNavigate, Link } from "react-router-dom";
import { Clock, Eye, MessageCircle, Share2, Bookmark, Pencil } from "lucide-react";
import { useState } from "react";
import { formatTimeAgo } from "../../../utils/format";

const PostCard = ({ post, variant = "default", canEdit = false }) => {
  const navigate = useNavigate();
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

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/forum/edit/${post.slug || post._id}`);
  };
  const modifyTag = (tag) => {
    try {
      const parsed = JSON.parse(tag);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      // If not JSON, return as is
    }
    return [tag];
  };
  const flattenedTags = post.tags?.flatMap(tag => modifyTag(tag)) || [];


  if (variant === "compact") {
    const postPath = post.slug || post._id;
    return (
      <Link
        to={`/posts/${postPath}`}
        className="group flex  p-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <img
          src={post.coverImageUrl || "https://via.placeholder.com/120x80"}
          alt={post.title}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0 ml-2">
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
    <article className="group bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
      <Link to={`/posts/${post.slug || post._id}`} className="block">
        {/* Thumbnail */}
        <div className="float-left w-24 mr-3 mb-2 relative overflow-hidden bg-gray-200 rounded-md">
          <img
            src={post.coverImageUrl || "https://via.placeholder.com/800x450"}
            alt={post.title}
            className="w-full h-24 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {post.category && (
            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 text-[10px] font-medium bg-blue-600 text-white rounded-full">
              {post.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {flattenedTags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
            
                    <img
                      src={post.author?.image || "https://static.vecteezy.com/system/resources/previews/024/766/958/non_2x/default-male-avatar-profile-icon-social-media-user-free-vector.jpg"}
                      alt={post.authorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
              <div>
                <p className="text-xs font-medium text-gray-900">
                  {post.authorName || "Anonymous"}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span>{formatTimeAgo(post.createdAt) || "1 ngày trước"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {post.readTime || "5"} phút
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-full transition-colors"
                  title="Chỉnh sửa bài viết"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleBookmark}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Bookmark"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${isBookmarked ? "fill-blue-600 text-blue-600" : "text-gray-400"
                    }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
            <span className="flex items-center gap-0.5">
              <Eye className="w-3 h-3" />
              {post.views || 0}
            </span>
            <span className="flex items-center gap-0.5">
              <MessageCircle className="w-3 h-3" />
              {post.commentsCount || 0}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
