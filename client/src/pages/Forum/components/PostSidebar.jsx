import { Heart, Bookmark, Share2, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";

const PostSidebar = ({ post, onLike, onSave, onShare }) => {
  const liked = post?.liked || false;
  const saved = post?.saved || false;
  const likesCount = post?.likes || 0;

  const handleLike = () => {
    const newLiked = !liked;
    if (onLike) {
      onLike(newLiked);
    }
    toast.success(newLiked ? "Đã thích bài viết!" : "Đã bỏ thích bài viết!");
  };

  const handleSave = () => {
    const newSaved = !saved;
    if (onSave) {
      onSave(newSaved);
    }
    toast.success(newSaved ? "Đã lưu bài viết!" : "Đã bỏ lưu bài viết!");
  };

  const handleShare = () => {
    const url = window.location.href;

    if (navigator.share) {
      // Use Web Share API if available
      navigator.share({
        title: post?.title || "Bài viết thú vị",
        text: "Hãy xem bài viết này!",
        url: url,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url).then(() => {
        toast.success("Đã sao chép liên kết!");
      }).catch(() => {
        toast.error("Không thể sao chép liên kết!");
      });
    }

    if (onShare) {
      onShare();
    }
  };

  const handleComment = () => {
    // Scroll to comments section
    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-24 self-start">
      <div className="bg-white p-2 flex flex-col gap-2">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`group relative p-3 rounded-full transition-all duration-200 ${
            liked
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "text-gray-600 hover:bg-gray-100 hover:text-red-600"
          }`}
          title={liked ? "Bỏ thích" : "Thích bài viết"}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              liked ? "fill-current scale-110" : "group-hover:scale-110"
            }`}
          />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {liked ? "Bỏ thích" : "Thích"}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={handleComment}
          className="group relative p-3 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
          title="Bình luận"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Bình luận
          </span>
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`group relative p-3 rounded-full transition-all duration-200 ${
            saved
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
              : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          }`}
          title={saved ? "Bỏ lưu" : "Lưu bài viết"}
        >
          <Bookmark
            className={`w-5 h-5 transition-all duration-200 ${
              saved ? "fill-current scale-110" : "group-hover:scale-110"
            }`}
          />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {saved ? "Bỏ lưu" : "Lưu"}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="group relative p-3 rounded-full text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-all duration-200"
          title="Chia sẻ"
        >
          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Chia sẻ
          </span>
        </button>
      </div>

      {/* Like Count */}
      <div className="mt-4 text-center">
        <div className="bg-white rounded-lg  px-3 py-2">
          <div className="text-sm font-semibold text-gray-900">{likesCount}</div>
          <div className="text-xs text-gray-500">lượt thích</div>
        </div>
      </div>
    </div>
  );
};

export default PostSidebar;