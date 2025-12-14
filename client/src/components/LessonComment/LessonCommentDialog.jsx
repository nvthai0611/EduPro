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
import { MessageCircle } from "lucide-react";
import { toast } from "react-toastify";

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
}) => {
  const [commentText, setCommentText] = useState(myComment?.content || "");
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <Sheet open={open} onOpenChange={handleDialogChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nhận xét bài học</SheetTitle>
          <SheetDescription>
            {lessonTitle ? `Gửi nhận xét của bạn cho bài học: ${lessonTitle}` : 'Gửi nhận xét của bạn cho giảng viên'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
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
                Nhận xét từ học viên khác ({allComments.length})
              </h3>
              <ScrollArea className="max-h-[400px] pr-2">
                <div className="space-y-4">
                  {allComments.map((comment) => (
                    <div key={comment._id} className="rounded-lg border bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <img 
                          src={comment.studentId?.avatar || "https://www.gravatar.com/avatar?d=mp&s=40"} 
                          alt={comment.studentId?.fullName || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-700">
                              {comment.studentId?.fullName || "Người dùng"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-800 whitespace-pre-wrap">{comment.content}</p>
                          
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
                  ))}
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
