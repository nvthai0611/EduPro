import { Card } from '@/components/ui/card';
import { useState } from 'react'
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import BannerFormModal from './components/BannerFormModal';
import { useAdminBanners } from '../../../hooks/useBanners';

const BannerManagement = () => {
  // Fetch banners using TanStack Query
  const { data: banners = [], isLoading, isError, error } = useAdminBanners();
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedBanner, setSelectedBanner] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    backgroundImage: '',
    isActive: true
  });

  const handleCreate = () => {
    setModalType('create');
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      backgroundImage: '',
      gradientFrom: '#FF6B35',
      gradientTo: '#F7931E',
      textColor: '#FFFFFF',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (banner) => {
    setModalType('edit');
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      backgroundImage: banner.backgroundImage,
      gradientFrom: banner.gradientFrom,
      gradientTo: banner.gradientTo,
      textColor: banner.textColor,
      isActive: banner.isActive
    });
    setShowModal(true);
  };

  const handleDelete = (banner) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa banner "${banner.title}"?`)) {
      // TODO: Implement delete mutation
      toast.success('Đã xóa banner thành công!');
    }
  };

  const toggleActive = (banner) => {
    // TODO: Implement update mutation
    toast.success(`Đã ${!banner.isActive ? 'kích hoạt' : 'ẩn'} banner!`);
  };

  const handleSubmit = () => {
    if (modalType === 'create') {
      // TODO: Implement create mutation
      toast.success('Tạo banner mới thành công!');
    } else {
      // TODO: Implement update mutation
      toast.success('Cập nhật banner thành công!');
    }
    setShowModal(false);
  };

  const activeBanners = banners.filter(b => b.isActive);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu banner...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="text-red-600 mb-2">Lỗi tải dữ liệu</div>
          <p className="text-gray-700">{error?.message || 'Không thể tải dữ liệu banner'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Banner
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý banner quảng cáo hiển thị trên trang chủ
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg shadow-sm px-6 py-3 border border-gray-200 flex flex-col items-center">
            <div className="text-sm text-black-500 indent-50">Tổng banner</div>
            <div className=" text-black-600">{banners.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm px-6 py-3 border border-gray-200 flex flex-col items-center">
            <div className="text-sm text-black-500">Đang hoạt động: </div>
            <div className="text-green-600">{activeBanners.length}</div>
          </div>
          <Button 
            onClick={handleCreate}
            className="text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo banner mới
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {banners.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">Chưa có banner nào</p>
          <Button onClick={handleCreate}>
            <Plus className="w-5 h-5 mr-2" />
            Tạo banner đầu tiên
          </Button>
        </div>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <Card key={banner._id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
            <div className="flex">
              {/* Preview Thumbnail */}
              <div className="w-96 h-48 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: ` url(${banner.imageUrl})`,
                    backgroundBlendMode: 'overlay'
                  }}
                >
                  {/* <div className="p-6 h-full flex flex-col justify-center" style={{ color: banner.textColor }}>
                    <p className="text-xs font-bold tracking-wider mb-1">{banner.subtitle}</p>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{banner.title}</h3>
                    <p className="text-sm opacity-90 line-clamp-2 mb-3">{banner.description}</p>
                    <div className="text-xs bg-white text-gray-900 px-4 py-1.5 rounded-full inline-block font-semibold w-fit">
                      {banner.buttonText} */}
                    {/* </div> */}
                  {/* </div> */}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{banner.title}</h3>
                      <Badge className={banner.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}>
                        {banner.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{banner.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ background: `linear-gradient(135deg, ${banner.gradientFrom}, ${banner.gradientTo})` }}></div>
                        <span className="text-gray-500">Gradient</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Button:</span>
                        <span className="font-medium text-gray-700">{banner.buttonText}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Link:</span>
                        <span className="font-medium text-gray-900">{banner.buttonLink}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(banner)}
                      className={banner.isActive ? 'text-gray-600 border-gray-300' : 'text-green-600 border-green-300'}
                    >
                      {banner.isActive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      {banner.isActive ? 'Ẩn' : 'Hiển thị'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(banner)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <BannerFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        modalType={modalType}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default BannerManagement