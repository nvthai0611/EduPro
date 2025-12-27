import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
// import { useCreateBanner } from '../../../hooks/useBanners';

const BannerFormModal = ({ 
  show, 
  onClose, 
  modalType, 
  formData, 
  setFormData, 
  onSubmit 
}) => {
  if (!show) return null;

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-3xl w-full shadow-2xl border-0 my-8">
        <CardHeader className=" border-b">
          <h3 className="text-2xl font-bold text-gray-800">
            {modalType === 'create' ? 'Tạo banner mới' : 'Chỉnh sửa banner'}
          </h3>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle *</label>
              <input
                type="text"
                // value={formData.subtitle}
                // onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="GIẢM GIÁ ĐẶC BIỆT"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text *</label>
              <input
                type="text"
                // value={formData.buttonText}
                // onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Tìm hiểu ngay"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Giảm đến 50% cho tất cả khóa học"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Áp dụng cho học viên mới đăng ký trong tháng này"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Link *</label>
              <input
                type="text"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                placeholder="/courses"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 inline mr-1" />
                Background Image URL
              </label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
           
           </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Hiển thị banner ngay sau khi tạo</label>
          </div>

          {/* Preview in Modal */}
          {/* <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Xem trước:</label>
            <div
              className="h-48 rounded-lg bg-cover bg-center relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(135deg, ${formData.gradientFrom} 0%, ${formData.gradientTo} 100%), url(${formData.backgroundImage})`,
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="p-6 h-full flex flex-col justify-center" style={{ color: formData.textColor }}>
                <p className="text-xs font-bold tracking-wider mb-1">{formData.subtitle || 'SUBTITLE'}</p>
                <h3 className="text-2xl font-bold mb-2">{formData.title || 'Title'}</h3>
                <p className="text-sm opacity-90 mb-3">{formData.description || 'Description'}</p>
                <div className="text-xs bg-white text-gray-900 px-4 py-1.5 rounded-full inline-block font-semibold w-fit">
                  {formData.buttonText || 'Button'}
                </div>
              </div>
            </div>
          </div> */}

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
            >
              {modalType === 'create' ? 'Tạo banner' : 'Cập nhật'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BannerFormModal;
