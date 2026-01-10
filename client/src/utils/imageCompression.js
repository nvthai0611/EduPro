import imageCompression from 'browser-image-compression';

/**
 * Nén và tối ưu ảnh trước khi upload
 * @param {File} imageFile - File ảnh gốc
 * @param {Object} options - Tùy chọn nén
 * @returns {Promise<File>} - File ảnh đã nén
 */
export const compressImage = async (imageFile, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 0.5, // Giảm xuống 500KB
    maxWidthOrHeight: 1920, // HD resolution
    useWebWorker: true, // Dùng Web Worker để không block UI
    fileType: 'image/jpeg', // Convert sang JPEG để file nhỏ hơn
    initialQuality: 0.85, // Chất lượng 85%
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    console.log(`[ImageCompression] Original file size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    const compressedFile = await imageCompression(imageFile, compressionOptions);
    
    console.log(`[ImageCompression] Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[ImageCompression] Reduction: ${(((imageFile.size - compressedFile.size) / imageFile.size) * 100).toFixed(2)}%`);
    
    return compressedFile;
  } catch (error) {
    console.error('[ImageCompression] Error:', error);
    // Nếu nén lỗi, trả về file gốc
    return imageFile;
  }
};

/**
 * Tạo preview URL tối ưu
 * @param {File} file - File ảnh
 * @returns {string} - Object URL
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke preview URL để giải phóng memory
 * @param {string} url - Object URL cần revoke
 */
export const revokeImagePreview = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Validate file ảnh
 * @param {File} file - File cần validate
 * @param {Object} constraints - Ràng buộc
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateImageFile = (file, constraints = {}) => {
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  } = constraints;

  if (!file) {
    return { valid: false, error: 'Không có file được chọn' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Chỉ chấp nhận các định dạng: ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}` };
  }

  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > maxSizeMB) {
    return { valid: false, error: `Kích thước file không được vượt quá ${maxSizeMB}MB (hiện tại: ${fileSizeMB.toFixed(2)}MB)` };
  }

  return { valid: true };
};
