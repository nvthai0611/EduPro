import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MDEditor, { commands } from "@uiw/react-md-editor";
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
  const [contentImages, setContentImages] = useState([]); // For batch upload button
  const [editorImages, setEditorImages] = useState(new Map()); // Map: blobUrl -> File
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingContent, setIsUploadingContent] = useState(false);
  
  const coverInputRef = useRef(null);
  const contentInputRef = useRef(null);
  const editorImageInputRef = useRef(null);

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

  // Handle content image selection
  const handleContentImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (contentImages.length + files.length > 5) {
      showErrorDialog("Chỉ được tải lên tối đa 5 ảnh trong nội dung");
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith("image/")) {
        showErrorDialog("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        showErrorDialog("Kích thước ảnh không được vượt quá 3MB");
        return;
      }
    });

    setContentImages(prev => [...prev, ...files]);
  };

  // Handle image selection from editor toolbar
  const handleEditorImageChange = (e) => {
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

    // Check total images limit (editor images + batch images)
    if (editorImages.size + contentImages.length >= 5) {
      showErrorDialog("Chỉ được tải lên tối đa 5 ảnh trong nội dung");
      return;
    }

    // Create blob URL for preview
    const blobUrl = URL.createObjectURL(file);
    
    // Save file reference
    setEditorImages(prev => new Map(prev).set(blobUrl, file));
    
    // Insert markdown with blob URL
    const imageMarkdown = `![${file.name}](${blobUrl})`;
    setContent(prev => prev + `\n\n${imageMarkdown}\n\n`);
    
    // Reset input
    if (editorImageInputRef.current) {
      editorImageInputRef.current.value = "";
    }
  };

  // Upload content images to get URLs (for batch upload button)
  const uploadContentImages = async () => {
    if (contentImages.length === 0) return [];

    const uploadedUrls = [];

    try {
      for (const image of contentImages) {
        // Create blob URL for preview
        const blobUrl = URL.createObjectURL(image);
        uploadedUrls.push(blobUrl);
        
        // Save file reference
        setEditorImages(prev => new Map(prev).set(blobUrl, image));
      }
      return uploadedUrls;
    } catch (error) {
      console.error("Error preparing content images:", error);
      throw new Error("Không thể chuẩn bị ảnh nội dung");
    }
  };

  // Insert image URL into markdown editor
  const insertImageIntoContent = async () => {
    if (contentImages.length === 0) {
      showErrorDialog("Vui lòng chọn ảnh để chèn");
      return;
    }

    // Check total limit
    if (editorImages.size + contentImages.length > 5) {
      showErrorDialog("Chỉ được tải lên tối đa 5 ảnh trong nội dung");
      return;
    }

    setIsUploadingContent(true);
    try {
      const urls = await uploadContentImages();
      
      let imageMarkdown = "\n\n";
      urls.forEach((url, index) => {
        const fileName = contentImages[index]?.name || `Image ${index + 1}`;
        imageMarkdown += `![${fileName}](${url})\n\n`;
      });
      
      setContent(prev => prev + imageMarkdown);
      setContentImages([]);
    } catch (error) {
      showErrorDialog(error.message);
    } finally {
      setIsUploadingContent(false);
    }
  };

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

    // Check total content images (editor + batch)
    const totalContentImages = editorImages.size + contentImages.length;
    if (totalContentImages > 5) {
      newErrors.contentImages = `Chỉ được tải tối đa 5 ảnh trong nội dung (hiện tại: ${totalContentImages})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Custom image command for MDEditor toolbar
  const customImageCommand = {
    name: "image",
    keyCommand: "image",
    buttonProps: { "aria-label": "Thêm ảnh" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 20 20">
        <path fill="currentColor" d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"/>
      </svg>
    ),
    execute: () => {
      editorImageInputRef.current?.click();
    }
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
      const blobUrlPattern = /!\[([^\]]*)\]\((blob:[^\)]+)\)/g;
      let match;
      const blobUrls = [];
      
      while ((match = blobUrlPattern.exec(content)) !== null) {
        blobUrls.push(match[2]);
      }

      // Add all content images (from editor and batch upload)
      const allContentImages = [];
      
      // Add images from editor (blob URLs)
      blobUrls.forEach(blobUrl => {
        const file = editorImages.get(blobUrl);
        if (file) {
          allContentImages.push(file);
        }
      });
      
      // Add images from batch upload
      contentImages.forEach(image => {
        allContentImages.push(image);
      });

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
        editorImages.forEach((file, blobUrl) => {
          URL.revokeObjectURL(blobUrl);
        });
        
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
            <div className="flex justify-between items-center mb-3">
              <label className="block text-lg font-semibold text-gray-900">
                Nội dung
                <span className="text-red-500 ml-1">*</span>
              </label>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => contentInputRef.current?.click()}
                  disabled={editorImages.size + contentImages.length >= 5}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Chọn ảnh ({editorImages.size + contentImages.length}/5)
                </Button>
                
                {contentImages.length > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={insertImageIntoContent}
                    disabled={isUploadingContent}
                  >
                    {isUploadingContent ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      "Chèn ảnh"
                    )}
                  </Button>
                )}
              </div>
            </div>

            <input
              ref={contentInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleContentImageChange}
              className="hidden"
            />

            {/* Hidden input for editor toolbar image upload */}
            <input
              ref={editorImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleEditorImageChange}
              className="hidden"
            />

            <div data-color-mode="light" className="relative">
              {isUploadingContent && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Đang tải ảnh lên...</span>
                  </div>
                </div>
              )}
              <MDEditor
                value={content}
                onChange={setContent}
                height={400}
                preview="edit"
                hideToolbar={false}
                enableScroll={true}
                commands={[
                  commands.bold,
                  commands.italic,
                  commands.strikethrough,
                  commands.hr,
                  commands.title,
                  commands.divider,
                  commands.link,
                  customImageCommand,
                  commands.code,
                  commands.codeBlock,
                  commands.divider,
                  commands.quote,
                  commands.unorderedListCommand,
                  commands.orderedListCommand,
                  commands.checkedListCommand,
                ]}
                textareaProps={{
                  placeholder: "Viết nội dung bài viết của bạn (hỗ trợ Markdown)...\n\nBạn có thể:\n- Định dạng văn bản\n- Thêm code blocks\n- Tạo danh sách\n- Chèn ảnh từ toolbar"
                }}
              />
            </div>

            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {content.trim().length} ký tự (tối thiểu 30)
              </span>
              {errors.content && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.content}
                </p>
              )}
            </div>
            
            {errors.contentImages && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.contentImages}
              </p>
            )}
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
