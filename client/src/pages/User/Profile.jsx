import { User, Mail, Phone, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile } from '../../services/user/userService';
import { useQuery } from '@tanstack/react-query';

const Profile = () => {
  const { user } = useAuth();

  const { data: infoUser } = useQuery({
    queryKey: ["user-profile", user?.userId],
    queryFn: async () => {
      const res = await getUserProfile(user?.userId || null);
      return res.data;
    },
    enabled: !!user,
  });

  // Hàm format ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'Thành viên';
    const date = new Date(dateString);
    return `Thành viên từ ${date.toLocaleDateString('vi-VN')}`;
  };

  return (
    <div className="min-h-screen bg-white from-slate-50 via-white to-blue-50 p-6 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Profile */}
        <div className="flex items-center gap-6 mb-8 animate-fade-in">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <AvatarImage src={infoUser?.image || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                {infoUser?.fullName}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {infoUser?.fullName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{formatDate(infoUser?.createdAt)}</p>
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

            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Họ và Tên
                </Label>
                <Input
                  type="text"
                  value={infoUser?.fullName ?? ""}
                  disabled
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
                  value={infoUser?.email ?? ""}
                  disabled
                  className="border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-200 rounded-lg text-sm"
                  placeholder="user@example.com"
                />
                <p className="text-xs text-gray-400 mt-1">
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
                  value={infoUser?.phone ?? ""}
                  disabled
                  placeholder="Chưa có số điện thoại"
                  className="border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 rounded-lg text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-medium transition-all duration-300 rounded-lg text-sm h-10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Thay Đổi
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