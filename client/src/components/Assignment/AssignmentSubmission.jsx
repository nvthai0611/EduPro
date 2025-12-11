import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Circle, Clock, Link as LinkIcon, Send } from "lucide-react";

const defaultSubmissions = [];

const formatTimeAgo = (date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: vi,
  });
};

const AssignmentSubmission = ({
  open,
  onOpenChange,
  onSubmit,
  submissions = defaultSubmissions,
  lessonTitle,
}) => {
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setLink("");
    setNote("");
  };

  const handleDialogChange = (value) => {
    if (!value) {
      resetForm();
    }
    onOpenChange?.(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!link.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        link: link.trim(),
        note: note.trim(),
      });
      resetForm();
      onOpenChange?.(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatus = (status) => {
    const normalized = (status || "pending").toLowerCase();

    if (normalized === "approved") {
      return <Badge className="bg-emerald-500/10 text-emerald-600">Đã chấm</Badge>;
    }

    if (normalized === "rejected") {
      return <Badge className="bg-red-500/10 text-red-600">Cần nộp lại</Badge>;
    }

    return <Badge variant="secondary">Đang chờ</Badge>;
  };

  return (
    <Sheet open={open} onOpenChange={handleDialogChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nộp bài tập</SheetTitle>
        </SheetHeader>
        {/* avatar user
<Circle className="h-10 w-10 text-gray-400" >
  <image href="{}"  className="w-10 h-10 rounded-lg"/>
  </Circle>   */}
        <div className="mt-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
          
            <div className="space-y-2">
              <Label htmlFor="assignment-note">Ghi chú cho giảng viên (tùy chọn)</Label>
              <Textarea
                id="assignment-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ví dụ: Thầy/cô xem giúp em commit cuối cùng, em có đính kèm hướng dẫn build trong README."
                className="min-h-[60px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={isSubmitting}
              >
                Đóng
              </Button>
              <Button type="submit" disabled={!link.trim() || isSubmitting}>
                {isSubmitting ? "Đang gửi..." : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Nộp bài
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="space-y-3 rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Clock className="h-4 w-4" />
                Lịch sử nộp bài
              </div>
              <span className="text-xs text-slate-500">{submissions.length} bài nộp</span>
            </div>

            {submissions.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Chưa có liên kết nào. Hãy gửi link bài làm đầu tiên của bạn!
              </div>
            ) : (
              <ScrollArea className="max-h-60 pr-2">
                <div className="space-y-3">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id || submission.submittedAt}
                      className="rounded-md border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3 text-sm font-medium text-slate-800">
                        <a
                          href={submission.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 break-all text-blue-600 hover:underline"
                        >
                          {submission.link}
                        </a>
                        {renderStatus(submission.status)}
                      </div>
                      {submission.note && (
                        <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                          {submission.note}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>{formatTimeAgo(submission.submittedAt)}</span>
                        {submission.reviewer && (
                          <span>
                            Giảng viên: <span className="font-medium text-slate-600">{submission.reviewer}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AssignmentSubmission;
