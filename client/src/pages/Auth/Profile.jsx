import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Save, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    image: '',
    createdAt: ''
  });

  const [displayName, setDisplayName] = useState(''); // Tên hiển thị ở header

  // Fetch dữ liệu khi load
  useEffect(() => {
    fetchProfile();
  }, []);

  // Lưu vào localStorage mỗi khi profileData thay đổi
  useEffect(() => {
    if (profileData.name || profileData.email || profileData.phone || profileData.bio) {
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      console.log('✅ Đã lưu vào localStorage:', profileData);
    }
  }, [profileData]);

  // Lưu displayName vào localStorage
  useEffect(() => {
    if (displayName) {
      localStorage.setItem('displayName', displayName);
      console.log('✅ Đã lưu displayName:', displayName);
    }
  }, [displayName]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Thử load từ localStorage trước
      const savedProfile = localStorage.getItem('userProfile');
      const savedDisplayName = localStorage.getItem('displayName');
      
      console.log('📂 Đọc từ localStorage:', { savedProfile, savedDisplayName });
      
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileData(parsed);
        setDisplayName(savedDisplayName || parsed.name || '');
        console.log('✅ Đã load dữ liệu từ localStorage');
      }
      
      const res = await fetch("/api/auth/profile", {
        credentials: "include",
      });
      
      console.log("Status:", res.status);
      console.log("Content-Type:", res.headers.get('content-type'));
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn("API chưa sẵn sàng, sử dụng dữ liệu đã lưu");
        // Không hiển thị lỗi, chỉ log
        return;
      }
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Lỗi không xác định' }));
        throw new Error(data.message || `Lỗi ${res.status}`);
      }
      
      const data = await res.json();
      const newProfile = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        image: data.image || '',
        createdAt: data.createdAt || ''
      };
      setProfileData(newProfile);
      setDisplayName(data.name || '');
      
      // Lưu vào localStorage
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      localStorage.setItem('displayName', data.name || '');
    } catch (err) {
      console.error("Fetch Error:", err);
      // Không hiển thị lỗi khi load lần đầu
    } finally {
      setLoading(false);
    }
  };

  // Hàm format ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'Thành viên';
    const date = new Date(dateString);
    return `Thành viên từ ${date.toLocaleDateString('vi-VN')}`;
  };

  // Hàm upload avatar (lưu local, không cần backend)
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.type.startsWith('image/')) {
      setError("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setUploadingAvatar(true);
    setError(null);

    try {
      // Đọc file và chuyển thành base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setProfileData(prev => ({
          ...prev,
          image: imageUrl
        }));
        setUploadingAvatar(false);
      };
      reader.onerror = () => {
        setError("Không thể đọc file ảnh");
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Avatar upload error:", err);
      setError(err.message);
      setUploadingAvatar(false);
    }
  };

  const validateProfile = () => {
    if (!profileData.name?.trim()) {
      setError("Vui lòng nhập họ tên");
      return false;
    }
    if (!profileData.email?.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(profileData.email)) {
      setError("Email không hợp lệ. Vui lòng nhập đúng định dạng (vd: user@example.com)");
      return false;
    }
    
    // Validate phone (nếu có nhập)
    if (profileData.phone?.trim()) {
      // Chấp nhận: +84xxxxxxxxx, 84xxxxxxxxx, 0xxxxxxxxx (9-11 số)
      const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
      if (!phoneRegex.test(profileData.phone.replace(/\s/g, ''))) {
        setError("Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam (vd: 0987654321 hoặc +84987654321)");
        return false;
      }
    }
    
    if (profileData.bio.length > 500) {
      setError("Giới thiệu không được vượt quá 500 ký tự");
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    setSaving(true);
    setError(null);
    try {
      console.log("Saving profile:", profileData);
      
      // Lưu vào localStorage ngay lập tức
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      localStorage.setItem('displayName', profileData.name);
      
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      console.log("Save status:", res.status);

      // Kiểm tra content-type
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Nếu không có backend, vẫn cập nhật UI
        console.warn("API chưa sẵn sàng, đã lưu vào localStorage");
        setDisplayName(profileData.name); // Cập nhật tên hiển thị
        alert("Thông tin đã được lưu thành công!");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Lỗi không xác định' }));
        throw new Error(data.message || `Cập nhật thất bại (${res.status})`);
      }
      
      setDisplayName(profileData.name); // Cập nhật tên hiển thị
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Save error:", err);
      // Nếu lỗi kết nối, vẫn cho phép cập nhật UI
      if (err.message.includes('Failed to fetch')) {
        setDisplayName(profileData.name); // Cập nhật tên hiển thị
        alert("Thông tin đã được lưu thành công!");
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleProfileChange = (field, value) => {
    const newData = {
      ...profileData,
      [field]: value
    };
    setProfileData(newData);
    
    // Lưu ngay vào localStorage khi thay đổi
    localStorage.setItem('userProfile', JSON.stringify(newData));
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center text-gray-800">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Đang tải...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Profile */}
        <div className="flex items-center gap-6 mb-8 animate-fade-in">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <AvatarImage src={profileData.image || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                {displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0 bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-600 hover:to-orange-700 transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center">
              {uploadingAvatar ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {displayName || 'Người dùng'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{formatDate(profileData.createdAt)}</p>
          </div>
        </div>

        {/* Card Profile */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thông tin cá nhân
              </h3>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-in fade-in duration-300">
                <strong>❌ Lỗi:</strong> {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-xs underline hover:font-bold transition-all"
                >
                  Đóng
                </button>
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Họ và Tên
                </Label>
                <Input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-sm"
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Email */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-green-500" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-200 rounded-lg text-sm"
                  placeholder="user@example.com"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Định dạng: user@example.com
                </p>
              </div>

              {/* Phone */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-purple-500" />
                  Số Điện Thoại
                </Label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 rounded-lg text-sm"
                  placeholder="0987654321"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Định dạng: 0987654321 hoặc +84987654321
                </p>
              </div>

              {/* Bio */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Giới Thiệu</Label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-sm resize-none"
                  placeholder="Viết về bản thân bạn..."
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {profileData.bio.length}/500 ký tự
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-medium transition-all duration-300 rounded-lg text-sm h-10"
                >
                  {saving ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang lưu...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu Thay Đổi
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;