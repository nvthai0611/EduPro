import { Eye, MessageCircle, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PostCard = ({ 
  post = {
    id: 1,
    title: '',
    description: '',
    thumbnail: '',
    author: {},
    views: 0,
    comments: 0,
    publishedAt: '',
    readTime: 5
  },
}) => {

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden">
            <img 
              src={post.thumbnail} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>

          {/* Description */}
          {post.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.author?.image || '../../../public/avatar.png'} alt={post.author?.name} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                  {post.author?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.author?.authorName || 'Người dùng'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              {post.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} phút đọc</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
