const cloudinary = require("cloudinary").v2;

/*
Xóa một danh sách ảnh trên Cloudinary
imageUrls - Danh sách URL ảnh cần xóa
*/
const deleteImagesFromCloudinary = async (imageUrls) => {
    try {
        for (let imageUrl of imageUrls) {
            let publicId = getPublicIdFromUrl(imageUrl);
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        console.error("Lỗi khi xóa ảnh trên Cloudinary:", error);
    }
};

const getPublicIdFromUrl = (url) => {
    let parts = url.split("/"); 
    let filename = parts.pop().split(".")[0]; // Bỏ đuôi file (.png)
    let folder = parts.slice(parts.indexOf("upload") + 1).join("/"); // Lấy thư mục + tên file
    return folder ? `${folder}/${filename}` : filename;
};



module.exports = { deleteImagesFromCloudinary };
