import { Edit2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.fullName} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-3xl">
              {user?.fullName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {user?.fullName}
          </h1>
          <p className="text-gray-500 text-sm">@{user?.username || user?.email?.split('@')[0]}</p>
          {user?.bio && (
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              {user?.bio}
            </p>
          )}
        </div>

        {/* Stats */}
      
        {/* Edit Button */}
        <Button 
          className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-10 font-medium"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Chỉnh sửa trang cá nhân
        </Button>

        {/* Contact Info */}
        {(user?.email || user?.phone) && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            {user?.email && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-gray-400 mr-2">✉️</span>
                {user.email}
              </div>
            )}
            {user?.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-gray-400 mr-2">📱</span>
                {user.phone}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
