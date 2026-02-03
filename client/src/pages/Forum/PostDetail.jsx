import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Loader2, ChevronLeft, Bookmark, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePostBySlug, useDeletePost, useCreatePostReaction, useDeletePostReaction } from "../../hooks/usePost";
import PostSidebar from "./components/PostSidebar";
import { formatTimeAgo } from "../../utils/format";
import AnswerList from "../../components/Forum/AnswerList";
import PostComments from "./components/PostComments";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../shadcn-ui/components/ui/dialog";
import { Button } from "../../shadcn-ui/components/ui/button";
import LoginRequiredDialog from "../../components/Auth/LoginRequiredDialog";
import { postService } from "../../services/post/postService";

const PostDetail = () => {


  const navigate = useNavigate();
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.userId || currentUser?._id || currentUser?.id;


  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const deletePostMutation = useDeletePost();

  const { data: post = {}, isLoading } = usePostBySlug(slug, {
    enabled: !!slug,
  });

  const createReactionMutation = useCreatePostReaction();
  const deleteReactionMutation = useDeletePostReaction();

  // Track post view (first-view only)
  useEffect(() => {
    if (post._id) {
      // Track view with localStorage cache to avoid duplicate tracking in same session
      const viewedKey = `post_viewed_${post._id}`;
      const hasViewed = localStorage.getItem(viewedKey);
      
      if (!hasViewed) {
        postService.trackPostView(post._id).then((result) => {
          if (result?.data?.isNewView) {
            // Mark as viewed in localStorage
            localStorage.setItem(viewedKey, Date.now().toString());
          }
        });
      }
    }
  }, [post._id]);

  // Sync state with post data
  useEffect(() => {
    if (post.isLiked !== undefined) setLiked(post.isLiked);
    if (post.isSaved !== undefined) setSaved(post.isSaved);
  }, [post.isLiked, post.isSaved]);

  // Handler functions for PostSidebar
  const handleLike = async (isLiked) => {
    if (!currentUserId) {
      setIsLoginRequiredOpen(true);
      return;
    }

    try {
      if (isLiked) {
        await createReactionMutation.mutateAsync({
          postId: post._id,
          reactionData: { type: "LIKE" }
        });
      } else {
        await deleteReactionMutation.mutateAsync({
          postId: post._id,
          type: "LIKE"
        });
      }
      setLiked(isLiked);
    } catch (error) {
      toast.error("Không thể cập nhật lượt thích");
    }
  };

  const handleSave = async (isSaved) => {
    if (!currentUserId) {
      setIsLoginRequiredOpen(true);
      return;
    }

    try {
      if (isSaved) {
        await createReactionMutation.mutateAsync({
          postId: post._id,
          reactionData: { type: "SAVE" }
        });
      } else {
        await deleteReactionMutation.mutateAsync({
          postId: post._id,
          type: "SAVE"
        });
      }
      setSaved(isSaved);
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái lưu");
    }
  };

  const handleShare = () => {
    // Additional share logic if needed
    console.log("Post shared");
  };

  const handleComment = () => {
    // Scroll to comments section
    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleEdit = () => {
    navigate(`/forum/edit/${slug}`);
  };

  const handleDelete = async () => {
    try {
      await deletePostMutation.mutateAsync(post._id);
      toast.success("Đã xóa bài viết thành công");
      navigate("/forum");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa bài viết");
    } finally {
      setIsDeleteDialogOpen(false);
    }
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

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[2rem] flex gap-8">
        {/* Post Sidebar - Desktop */}
        <div className="hidden lg:block flex-shrink-0 w-16 mt-4">
          <PostSidebar
            post={{ ...post, liked, saved, likesCount: liked ? (post.likesCount || 0) + 1 : (post.likesCount || 0) }}
            onLike={handleLike}
            onSave={handleSave}
            onShare={handleShare}
            onEdit={handleEdit}
            onDelete={() => setIsDeleteDialogOpen(true)}
            isAuthor={currentUserId === post.authorId}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 max-w-full">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Quay lại</span>
          </button>

          <article className="bg-white rounded-lg shadow-sm overflow-hidden">

            {/* Content Wrapper */}
            <div className="p-8 md:p-12">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {post.category}
                </span>
                <span>{formatTimeAgo(post.createdAt)}</span>
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
                  src={post.avatar || "https://i.pravatar.cc/150?img=3"}
                  alt={post.authorName || "Author"}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {post.authorName || "Unknown"}
                  </h3>
                  <p className="text-gray-600 text-sm">{post.email || ""}</p>
                </div>

                {/* Edit/Delete Buttons for Author */}
                {currentUserId === post.authorId && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Sửa</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="w-9 h-9"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Post Stats */}
              <div className="flex gap-6 mb-8 pb-8 border-b border-gray-200 text-gray-600 text-sm">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{post.viewsCount * 23 || "35"}</span>
                  <span>lượt xem</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {post.commentsCount || "0"}
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
                {flattenedTags.map((tag) => (

                  <button
                    key={tag}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition font-bold"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div id="comments-section" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
                {/* Mobile Action Buttons */}
                <div className="flex gap-4 lg:hidden">
                  <button
                    onClick={() => handleLike(!liked)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${liked
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={liked ? "currentColor" : "none"}
                    />
                    <span>{liked ? (post.likesCount || 0) + 1 : (post.likesCount || 0)}</span>
                  </button>
                  <button
                    onClick={handleComment}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.commentsCount || 0}</span>
                  </button>
                  <button
                    onClick={() => handleSave(!saved)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${saved
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <Bookmark
                      className="w-5 h-5"
                      fill={saved ? "currentColor" : "none"}
                    />
                    <span>{saved ? "Đã lưu" : "Lưu"}</span>
                  </button>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden lg:flex gap-4">
                  <button
                    onClick={() => handleLike(!liked)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${liked
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={liked ? "currentColor" : "none"}
                    />
                    <span>{liked ? (post.likesCount || 0) + 1 : (post.likesCount || 0)}</span>
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

            {/* Post Comments (Directly on Post) */}
            <div className="px-8 pb-8 md:px-12 md:pb-12 bg-gray-50 border-t border-gray-100">
              <PostComments 
                postId={post._id} 
                onLoginRequired={() => setIsLoginRequiredOpen(true)}
              />
            </div>

          </article>

          {/* Answers Section */}
          {/* <AnswerList
            postId={post._id}
            postAuthorId={post.authorId}
            currentUserId={currentUserId}
          /> */}
        </div>
      </div>

      {/* Login Required Dialog */}
      <LoginRequiredDialog 
        open={isLoginRequiredOpen} 
        onOpenChange={setIsLoginRequiredOpen}
        message="Bạn cần đăng nhập để thực hiện hành động này"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Xóa bài viết?</DialogTitle>
            <DialogDescription className="py-4">
              Bài viết sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deletePostMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xác nhận xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostDetail;