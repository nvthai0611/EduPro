import { useState, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card } from "../../shadcn-ui/components/ui/card";
import { Input } from "../../shadcn-ui/components/ui/input";
import { Button } from "../../shadcn-ui/components/ui/button";
import { Badge } from "../../shadcn-ui/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../shadcn-ui/components/ui/dialog";
import { X, Upload, ImagePlus, Loader2, AlertCircle } from "lucide-react";
import { apiClient } from "../../utils/clientAxios";

const CreateForumPost = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("error");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  
  // Image state
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  
  const coverInputRef = useRef(null);
  const quillRef = useRef(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Handle cover image selection
  const handleCoverImageChange = (e) => {
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
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Image handler for Quill editor - use useCallback to keep it stable
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

      // Create blob URL for preview
      const blobUrl = URL.createObjectURL(file);
      
      // Store file for later upload
      if (!window.quillImages) {
        window.quillImages = new Map();
      }
      window.quillImages.set(blobUrl, file);
      
      // Insert image into editor
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();
        quill.insertEmbed(index, "image", blobUrl);
        quill.setSelection(index + 1);
      }
    };
  }, []);

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

  // Handle tag input
  const handleTagKeyDown = (e) => {
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
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Remove cover image
  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  // Show dialog helper
  const showErrorDialog = (message) => {
    setDialogMessage(message);
    setDialogType("error");
    setShowDialog(true);
  };

  const showSuccessDialog = (message) => {
    setDialogMessage(message);
    setDialogType("success");
    setShowDialog(true);
  };

  // Validate form
  const validateForm = () => {
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

    if (!coverImage) {
      newErrors.coverImage = "Vui lòng chọn ảnh bìa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorDialog("Vui lòng điền đầy đủ thông tin hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Add cover image
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      // Extract blob URLs from content and collect corresponding files
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const images = tempDiv.getElementsByTagName("img");
      const blobUrls = [];
      
      for (let img of images) {
        if (img.src.startsWith("blob:")) {
          blobUrls.push(img.src);
        }
      }

      // Add all content images (from editor blob URLs)
      const allContentImages = [];
      
      // Get files from window.quillImages Map
      if (window.quillImages) {
        blobUrls.forEach(blobUrl => {
          const file = window.quillImages.get(blobUrl);
          if (file) {
            allContentImages.push(file);
          }
        });
      }

      // Add content images to form data
      allContentImages.forEach((image) => {
        formData.append("contentImages", image);
      });

      // Add other form data
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags));

      const response = await apiClient.post("/admin/forum", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        // Cleanup blob URLs
        if (window.quillImages) {
          window.quillImages.forEach((file, blobUrl) => {
            URL.revokeObjectURL(blobUrl);
          });
          window.quillImages.clear();
        }
        
        showSuccessDialog("Tạo bài viết thành công!");
        setTimeout(() => {
          navigate("/forum");
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showErrorDialog(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo bài viết"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tạo bài viết mới</h1>
          <p className="mt-2 text-sm text-gray-600">
            Chia sẻ kiến thức và trải nghiệm của bạn với cộng đồng
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

            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {content.replace(/<[^>]*>/g, "").trim().length} ký tự (tối thiểu 30)
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
                  Đang đăng...
                </>
              ) : (
                "Đăng bài"
              )}
            </Button>
          </div>
        </form>
      </div>

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
    </div>
  );
};

export default CreateForumPost;
