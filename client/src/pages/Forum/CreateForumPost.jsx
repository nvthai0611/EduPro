import { useState, useRef, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { Card } from "../../shadcn-ui/components/ui/card";
import { Input } from "../../shadcn-ui/components/ui/input";
import { Button } from "../../shadcn-ui/components/ui/button";
import { Badge } from "../../shadcn-ui/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../shadcn-ui/components/ui/dialog";
import { X, Upload, ImagePlus, Loader2, AlertCircle, ChevronLeft } from "lucide-react";
import { apiClient } from "../../utils/clientAxios";
import { toast } from "react-toastify";
import { usePostBySlug, useCreatePost, useUpdatePost } from "../../hooks/usePost";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Lazy load ReactQuill for better performance
const ReactQuill = lazy(() => import("react-quill"));

const CreateForumPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const isEdit = location.pathname.includes("/edit/");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("error");
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Image state
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const coverInputRef = useRef(null);
  const quillRef = useRef(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  // React Query hooks
  const { data: post, isLoading: isPostLoading } = usePostBySlug(slug, {
    enabled: isEdit && !!slug,
  });

  const { user: currentUser, isLoading: isAuthLoading } = useAuth();


  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  // Check authentication
  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      setShowLoginDialog(true);
    }
  }, [isAuthLoading, currentUser]);

  // Authorization check for edit mode
  useEffect(() => {
    // Wait for both post and auth to be ready
    if (isEdit && post && !isPostLoading && !isAuthLoading) {
      if (!currentUser) {
        toast.error("Vui lòng đăng nhập để chỉnh sửa bài viết");
        navigate("/auth/login");
        return;
      }

      // Handle different ID formats (string, object with _id, etc.)
      const authorId = post.authorId?._id ? post.authorId._id.toString() : post.authorId?.toString();
      const userId = (currentUser?._id || currentUser?.id || currentUser?.userId)?.toString();



      if (!authorId || !userId || authorId !== userId) {
        console.warn("Frontend Auth Check Failed", { authorId, userId });
        // Don't redirect, just warn. Backend will enforce 403 if really unauthorized.
        // This prevents false positives due to ID format/timing issues.
        // toast.warning("Lưu ý: Bạn có thể không có quyền sửa bài này.");
      }
    }
  }, [isEdit, post, isPostLoading, isAuthLoading, currentUser, navigate]);

  // Cleanup effect for file readers
  useEffect(() => {
    if (isEdit && post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      if (post.tags) {
        try {
          // Flatten tags if they are nested/JSON strings
          const flattened = post.tags.flatMap(tag => {
            try {
              const parsed = JSON.parse(tag);
              return Array.isArray(parsed) ? parsed : [tag];
            } catch (e) {
              return [tag];
            }
          });
          setTags(flattened);
        } catch (e) {
          setTags(post.tags);
        }
      }
      if (post.coverImageUrl) {
        setCoverImagePreview(post.coverImageUrl);
      }
    }
  }, [isEdit, post]);

  // Special effect for Quill content update
  useEffect(() => {
    if (isEdit && post?.content && quillRef.current) {
      const editor = quillRef.current.getEditor();
      // Only set if content is different to avoid cursor jumping
      if (editor.root.innerHTML !== post.content) {
        editor.clipboard.dangerouslyPasteHTML(post.content);
      }
    }
  }, [isEdit, post?.content]); // Removed quillRef.current as dependency

  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  // Show dialog helper - memoized
  const showErrorDialog = useCallback((message) => {
    setDialogMessage(message);
    setDialogType("error");
    setShowDialog(true);
  }, []);

  const showSuccessDialog = useCallback((message) => {
    setDialogMessage(message);
    setDialogType("success");
    setShowDialog(true);
  }, []);

  // Handle cover image selection - optimized with useCallback
  const handleCoverImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showErrorDialog("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showErrorDialog("Kích thước ảnh không được vượt quá 3MB");
      return;
    }

    setCoverImage(file);

    // Use URL.createObjectURL for better performance
    const objectUrl = URL.createObjectURL(file);
    setCoverImagePreview(objectUrl);
  }, [showErrorDialog]);

  // Image handler for Quill editor - upload immediately to Cloudinary
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showErrorDialog("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        showErrorDialog("Kích thước ảnh không được vượt quá 3MB");
        return;
      }

      // Get editor instance
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      // Save cursor position
      const range = quill.getSelection(true);
      const cursorPosition = range ? range.index : quill.getLength();

      try {
        // Show loading placeholder
        quill.insertEmbed(cursorPosition, "image", "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3EUploading...%3C/text%3E%3C/svg%3E");
        quill.setSelection(cursorPosition + 1);

        // Upload to Cloudinary via backend
        const formData = new FormData();
        formData.append("image", file);

        const response = await apiClient.post("/posts/upload-image", formData);

        const imageUrl = response.data?.url || response.url || response.data?.data?.url;

        if (imageUrl) {
          // Remove loading placeholder
          quill.deleteText(cursorPosition, 1);

          // Insert image
          quill.insertEmbed(cursorPosition, "image", imageUrl);
          quill.setSelection(cursorPosition + 1);
        } else {
          // Remove placeholder on error
          quill.deleteText(cursorPosition, 1);
          showErrorDialog("Upload ảnh thất bại");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        // Remove placeholder on error
        const quill = quillRef.current?.getEditor();
        if (quill) {
          quill.deleteText(cursorPosition, 1);
        }
        showErrorDialog(
          error.response?.data?.message || error.response?.data?.error || "Có lỗi xảy ra khi upload ảnh"
        );
      }
    };
  }, [showErrorDialog]);

  // Quill modules configuration - use useMemo to prevent recreation
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), [imageHandler]);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
  ];

  // Handle tag input - memoized
  const handleTagKeyDown = useCallback((e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();

      if (tags.length >= 5) {
        showErrorDialog("Chỉ được thêm tối đa 5 thẻ");
        return;
      }

      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  }, [tagInput, tags, showErrorDialog]);

  // Remove tag - memoized
  const removeTag = useCallback((tagToRemove) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  }, []);

  // Remove cover image - memoized
  const removeCoverImage = useCallback(() => {
    if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImage(null);
    setCoverImagePreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  }, [coverImagePreview]);

  // Validate form - memoized
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    } else if (title.length > 150) {
      newErrors.title = "Tiêu đề không được vượt quá 150 ký tự";
    }

    if (!content.trim()) {
      newErrors.content = "Nội dung không được để trống";
    } else if (content.trim().length < 30) {
      newErrors.content = "Nội dung phải có ít nhất 30 ký tự";
    }

    if (tags.length === 0) {
      newErrors.tags = "Vui lòng thêm ít nhất 1 thẻ";
    }

    if (!isEdit && !coverImage) {
      newErrors.coverImage = "Vui lòng chọn ảnh bìa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, content, tags, coverImage, isEdit]);

  // Helper to process and upload images from content
  const processContentImages = useCallback(async (htmlContent) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const images = div.querySelectorAll('img');
    let hasChanged = false;

    for (const img of images) {
      const src = img.getAttribute('src');
      if (src && src.startsWith('blob:')) {
        try {
          const blob = await fetch(src).then(r => r.blob());
          const formData = new FormData();
          formData.append("image", blob);

          const response = await apiClient.post("/posts/upload-image", formData);

          const imageUrl = response.data?.url || response.url || response.data?.data?.url;
          if (imageUrl) {
            img.setAttribute('src', imageUrl);
            hasChanged = true;
          }
        } catch (error) {
          console.error("Error uploading pasted image:", error);
        }
      }
    }

    return hasChanged ? div.innerHTML : htmlContent;
  }, []);

  // Submit form - memoized
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorDialog("Vui lòng điền đầy đủ thông tin hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      // Process images in content first (for pasted images)
      const processedContent = await processContentImages(content);

      const formData = new FormData();

      // Add cover image if newly selected
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      // Add other form data
      formData.append("title", title);
      formData.append("content", processedContent);
      formData.append("tags", JSON.stringify(tags));

      let response;
      if (isEdit) {
        // useUpdatePost mutation
        response = await updatePostMutation.mutateAsync({
          postId: post._id,
          postData: formData
        });
      } else {
        // useCreatePost mutation
        response = await createPostMutation.mutateAsync(formData);
      }

      if (response.success || response.data?.success) {
        toast.success(isEdit ? "Cập nhật bài viết thành công!" : "Tạo bài viết thành công!");
        showSuccessDialog(isEdit ? "Cập nhật bài viết thành công!" : "Tạo bài viết thành công!");
        setTimeout(() => {
          if (isEdit) {
            navigate(`/posts/${response.data?.slug || post.slug}`);
          } else {
            window.location.href = "/forum";
          }
        }, 1500);
      }
    } catch (error) {
      toast.error(isEdit ? "Có lỗi xảy ra khi cập nhật bài viết" : "Có lỗi xảy ra khi tạo bài viết");
      console.error("Error submitting post:", error);
      showErrorDialog(
        error.response?.data?.message || "Có lỗi xảy ra khi xử lý bài viết"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isEdit, post, title, content, tags, coverImage, validateForm, navigate, showErrorDialog, showSuccessDialog, processContentImages, createPostMutation, updatePostMutation]);

  // Memoized character count
  const contentCharCount = useMemo(() => {
    return content.replace(/<[^>]*>/g, "").trim().length;
  }, [content]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-20">
      {(isEdit && isPostLoading) ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Quay lại</span>
          </button>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {isEdit
                ? "Cập nhật bài viết của bạn để chia sẻ thông tin mới nhất"
                : "Chia sẻ kiến thức và trải nghiệm của bạn với cộng đồng"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image Section */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImagePlus className="w-5 h-5" />
                Ảnh bìa
                <span className="text-red-500">*</span>
              </h2>

              {coverImagePreview ? (
                <div className="relative">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Nhấp để chọn ảnh bìa (tối đa 3MB)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WEBP, GIF
                  </p>
                </div>
              )}

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />

              {errors.coverImage && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.coverImage}
                </p>
              )}
            </Card>

            {/* Title Section */}
            <Card className="p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Tiêu đề
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                maxLength={150}
                className="text-base"
              />
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {title.length}/150 ký tự
                </span>
                {errors.title && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>
            </Card>

            {/* Content Section */}
            <Card className="p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Nội dung
                <span className="text-red-500 ml-1">*</span>
              </label>

              <Suspense fallback={
                <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              }>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Viết nội dung bài viết của bạn..."
                  className="bg-white"
                  style={{ height: "400px", marginBottom: "50px" }}
                />
              </Suspense>

              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {contentCharCount} ký tự (tối thiểu 30)
                </span>
                {errors.content && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.content}
                  </p>
                )}
              </div>
            </Card>

            {/* Tags Section */}
            <Card className="p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Thẻ
                <span className="text-red-500 ml-1">*</span>
              </label>

              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Nhập thẻ và nhấn Enter (tối đa 5 thẻ)"
                disabled={tags.length >= 5}
              />

              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {errors.tags && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.tags}
                </p>
              )}
            </Card>

            {/* Submit Section */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/forum")}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEdit ? "Đang lưu..." : "Đang đăng..."}
                  </>
                ) : (
                  isEdit ? "Cập nhật" : "Đăng bài"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "error" ? "Lỗi" : "Thành công"}
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowDialog(false)}>Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cần đăng nhập</DialogTitle>
            <DialogDescription className="text-base pt-4">
              Bạn cần đăng nhập để tạo hoặc chỉnh sửa bài viết.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Hủy
            </Button>
            <Button onClick={() => window.location.href = `${import.meta.env.VITE_SERVER_API_V1}/auth/google?redirect=${encodeURIComponent(location.pathname)}`}>
              Đăng nhập với Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForumPost;
