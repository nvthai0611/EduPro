import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { UploadCloud, Clock, Paperclip } from "lucide-react";

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
  const [note, setNote] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setAttachment(file ?? null);
  };

  const resetForm = () => {
    setNote("");
    setAttachment(null);
  };

  const handleDialogChange = (value) => {
    if (!value) {
      resetForm();
    }
    onOpenChange?.(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!attachment || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        note: note.trim(),
        attachment,
      });
      resetForm();
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
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-2xl space-y-6">
        <DialogHeader>
          <DialogTitle>Nộp bài tập</DialogTitle>
          <DialogDescription>
            {lessonTitle
              ? `Gửi bài làm cho bài học "${lessonTitle}". Giảng viên sẽ phản hồi sau khi chấm bài.`
              : "Gửi bài làm của bạn để giảng viên xem xét."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
            <UploadCloud className="mx-auto mb-3 h-10 w-10 text-slate-500" />
            <p className="text-sm text-slate-600">
              Kéo thả tệp bài tập vào đây hoặc chọn tệp từ thiết bị của bạn.
            </p>
            <div className="mt-4 flex justify-center">
              <Label
                htmlFor="assignment-file"
                className="cursor-pointer rounded-full bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Chọn tệp
                <Input
                  id="assignment-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,image/*,video/*"
                />
              </Label>
            </div>
            {attachment && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                  <Paperclip className="h-4 w-4" />
                  <span className="font-medium">{attachment.name}</span>
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setAttachment(null)}
                  className="text-slate-500 hover:text-red-500"
                >
                  Xóa tệp
                </Button>
              </div>
            )}
            <p className="mt-3 text-xs text-slate-500">
              Hỗ trợ định dạng PDF, DOCX, PPTX, ZIP và tệp media. Dung lượng tối đa 200MB.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignment-note">Ghi chú cho giảng viên (tùy chọn)</Label>
            <Textarea
              id="assignment-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Nếu cần, hãy mô tả ngắn gọn về bài làm hoặc câu hỏi kèm theo..."
              className="min-h-[120px]"
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
            <Button type="submit" disabled={!attachment || isSubmitting}>
              {isSubmitting ? "Đang nộp..." : "Nộp bài ngay"}
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
              Chưa có bài nộp nào. Hãy gửi bài làm đầu tiên của bạn!
            </div>
          ) : (
            <ScrollArea className="max-h-60 pr-2">
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div
                    key={submission.id || submission.submittedAt}
                    className="rounded-md border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-800">
                      <span className="line-clamp-1">{submission.fileName}</span>
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
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentSubmission;
