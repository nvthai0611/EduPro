import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Reply } from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { TYPE_AUTH, AUTH_TOKEN } from "../../constains/auth";

const formatTimeAgo = (date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: vi,
  });
};

const LessonCommentDialog = ({
  open,
  onOpenChange,
  lessonId,
  lessonTitle,
  myComment = null,
  allComments = [],
  onCreateComment,
  onUpdateComment,
  onTeacherReply,
}) => {
  const [commentText, setCommentText] = useState(myComment?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // commentId being replied to
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Check if current user is admin/manager
  const token = Cookies.get(AUTH_TOKEN.ACCESS_TOKEN);
  let userInfo = null;
  let isStaff = false;
  
  try {
    if (token) {
      userInfo = jwtDecode(token);
      isStaff = userInfo && [TYPE_AUTH.ADMIN, TYPE_AUTH.MANAGER, TYPE_AUTH.STAFF].includes(userInfo.role);
      // console.log(isStaff);
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }

  // keep commentText in sync when prop changes
  React.useEffect(() => {
    setCommentText(myComment?.content || "");
  }, [myComment]);

  const handleDialogChange = (value) => {
    onOpenChange?.(value);
  };

  const handleSave = async () => {
    if (!commentText.trim() || isSaving) return;
    if (!lessonId) {
      toast.error('Không có ID bài học');
      return;
    }

    setIsSaving(true);
    try {
      if (myComment && myComment._id) {
        await onUpdateComment?.({ lessonId, payload: { content: commentText } });
      } else {
        await onCreateComment?.({ lessonId, payload: { content: commentText } });
      }
    } catch (error) {
      console.error('Error saving comment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim() || isSubmittingReply) return;
    
    setIsSubmittingReply(true);
    try {
      await onTeacherReply?.({ commentId, payload: { content: replyText } });
      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      console.error('Error replying to comment:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const toggleReply = (commentId) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setReplyingTo(commentId);
      setReplyText("");
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleDialogChange}>
      <SheetContent side="left" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nhận xét bài học</SheetTitle>
          <SheetDescription>
            {lessonTitle ? `Gửi nhận xét của bạn cho bài học: ${lessonTitle}` : 'Gửi nhận xét của bạn cho giảng viên'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-2">
          <div className="">
            <Label htmlFor="lesson-comment">
              Nhận xét của bạn (bạn chỉ có thể tạo 1 nhận xét, nhưng có thể sửa)
              
            </Label>
            <Textarea
              id="lesson-comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Viết nhận xét của bạn về bài học này..."
              className="min-h-[120px]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => { setCommentText(myComment?.content || ""); }}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !commentText.trim()}
            >
              {isSaving ? 'Đang lưu...' : (myComment ? 'Lưu thay đổi' : 'Gửi nhận xét')}
            </Button>
          </div>

          {/* Display all comments from other users */}
          {allComments && allComments.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold mb-3">
                Bình luận từ học viên khác ({allComments.length})
              </h3>
              <ScrollArea className="h-[500px] w-full pr-2">
                <div className="space-y-4 pr-4">
                  {(() => {
                    // Sort comments: teacher comments first, then student comments
                    const sortedComments = [...allComments].sort((a, b) => {
                      const aIsTeacher = [TYPE_AUTH.ADMIN, TYPE_AUTH.MANAGER, TYPE_AUTH.STAFF].includes(a.studentId?.role);
                      const bIsTeacher = [TYPE_AUTH.ADMIN, TYPE_AUTH.MANAGER, TYPE_AUTH.STAFF].includes(b.studentId?.role);
                      
                      if (aIsTeacher && !bIsTeacher) return -1;
                      if (!aIsTeacher && bIsTeacher) return 1;
                      return 0;
                    });
                    
                    return sortedComments.map((comment) => {
                      const isTeacher = [TYPE_AUTH.ADMIN, TYPE_AUTH.MANAGER, TYPE_AUTH.STAFF].includes(comment.studentId?.role);
                    return (
                      <div key={comment._id} className="rounded-lg border bg-slate-50 p-4">
                        <div className="flex items-start gap-3">
                          <img 
                            src={comment.studentId?.avatar || "https://www.gravatar.com/avatar?d=mp&s=40"} 
                            alt={comment.studentId?.fullName || "User"}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span 
                                  className={`text-sm font-semibold ${isTeacher ? 'text-green-600' : 'text-slate-700'}`}
                                >
                                  {comment.studentId?.fullName || "Người dùng"}
                                </span>
                                {isTeacher && (
                                  <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full">
                                    Giáo viên
                                  </span>
                                )}
                                <span className="text-xs text-slate-500">
                                  {formatTimeAgo(comment.createdAt)}
                                </span>
                              </div>
                              {isStaff && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleReply(comment._id)}
                                  className="h-7 text-xs gap-1"
                                >
                                  <Reply className="h-3 w-3" />
                                  Phản hồi
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-slate-800 whitespace-pre-wrap">{comment.content}</p>
                            {comment.isEdited && <span className="text-xs text-slate-500">(Đã chỉnh sửa)</span>}

                            {/* Reply form */}
                            {isStaff && replyingTo === comment._id && (
                              <div className="mt-3 space-y-2">
                                <Textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Viết phản hồi của bạn..."
                                  className="min-h-[80px] text-sm"
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleReply(null)}
                                    disabled={isSubmittingReply}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleReply(comment._id)}
                                    disabled={isSubmittingReply || !replyText.trim()}
                                  >
                                    {isSubmittingReply ? 'Đang gửi...' : 'Gửi phản hồi'}
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Teacher replies */}
                            {comment.teacherReplies && comment.teacherReplies.length > 0 && (
                              <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-200">
                                <p className="text-xs font-semibold text-blue-600">Phản hồi từ giảng viên:</p>
                                {comment.teacherReplies.map((reply, idx) => (
                                  <div key={idx} className="bg-white rounded p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <img 
                                        src={reply.teacherId?.avatar || "https://www.gravatar.com/avatar?d=mp&s=24"} 
                                        alt={reply.teacherId?.fullName || "Teacher"}
                                        className="w-6 h-6 rounded-full"
                                      />
                                      <span className="text-xs font-medium text-slate-700">
                                        {reply.teacherId?.fullName || "Giảng viên"}
                                      </span>
                                      <span className="text-xs text-slate-500">
                                        {formatTimeAgo(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-700">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                    });
                  })()}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LessonCommentDialog;
