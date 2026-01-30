import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  Reply,
  MoreVertical,
  Flag,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const CommentSection = ({ 
  lessonId, 
  comments = [], 
  onAddComment, 
  onLikeComment,
  onReplyComment,
  onEditComment,
  onDeleteComment,
  currentUser,
  className = "" 
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    onAddComment?.({
      content: newComment.trim(),
      lessonId,
      parentId: replyingTo?.id || null
    });
    
    setNewComment('');
    setReplyingTo(null);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    
    onReplyComment?.({
      content: replyText.trim(),
      lessonId,
      parentId: replyingTo.id
    });
    
    setReplyText('');
    setReplyingTo(null);
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditText(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    
    onEditComment?.(editingComment.id, editText.trim());
    setEditingComment(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      onDeleteComment?.(commentId);
    }
  };

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: vi 
    });
  };

  const renderComment = (comment, isReply = false) => {
    const isOwner = (currentUser?.userId || currentUser?.id || currentUser?._id) === comment.user?._id;
    
    return (
      <div key={comment._id} className={isReply ? "ml-8 mt-3" : ""}>
        <Card className="border-0 shadow-none">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.user?.image} />
                <AvatarFallback>
                  {comment.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.user?.name || 'Người dùng'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                  {comment.isInstructor && (
                    <Badge variant="secondary" className="text-xs">
                      Giảng viên
                    </Badge>
                  )}
                </div>
                
                {editingComment?._id === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[80px]"
                      placeholder="Chỉnh sửa bình luận..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        Lưu
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mb-2">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-500 hover:text-blue-600"
                        onClick={() => onLikeComment?.(comment._id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {comment.likesCount || 0}
                      </Button>
                      
                      {!isReply && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-500 hover:text-blue-600"
                          onClick={() => setReplyingTo(comment)}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          Trả lời
                        </Button>
                      )}
                      
                      {isOwner && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-gray-500">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditComment(comment)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">
          Thảo luận ({comments.length})
        </h3>
      </div>

      {/* Add Comment */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser?.image} />
              <AvatarFallback>
                {currentUser?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Thêm bình luận..."
                className="min-h-[80px] mb-3"
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Gửi bình luận
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {replyingTo && (
        <Card className="mb-4 border-blue-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser?.image} />
                <AvatarFallback>
                  {currentUser?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Trả lời <span className="font-medium">{replyingTo.user?.name}</span>
                </p>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Viết câu trả lời..."
                  className="min-h-[60px] mb-3"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSubmitReply} disabled={!replyText.trim()}>
                    Gửi trả lời
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có bình luận nào. Hãy là người đầu tiên thảo luận!</p>
          </div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default CommentSection;