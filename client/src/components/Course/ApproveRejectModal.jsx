import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';

const ApproveRejectModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  courseTitle,
  action, // 'approve' or 'reject'
  submittedMessage // The instructor's approval message
}) => {
  const [adminNote, setAdminNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const MIN_MESSAGE_LENGTH = 10;
  const charCount = adminNote.trim().length;
  const isValid = charCount >= MIN_MESSAGE_LENGTH;

  const isApprove = action === 'approve';
  const title = isApprove ? 'Duyệt khóa học' : 'Từ chối khóa học';
  const description = isApprove 
    ? 'Vui lòng nhập lý do phê duyệt khóa học này.'
    : 'Vui lòng nhập lý do từ chối khóa học này.';

  const handleSubmit = async () => {
    if (!isValid) {
      setError(`Admin note must be at least ${MIN_MESSAGE_LENGTH} characters`);
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      await onConfirm(adminNote.trim());
      // Reset form
      setAdminNote('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} course`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAdminNote('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Course Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Khóa học
            </Label>
            <p className="text-sm font-semibold text-gray-900">
              {courseTitle}
            </p>
          </div>

          {/* Instructor's Submission Message */}
          {submittedMessage && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Lý do giảng viên gửi
              </Label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {submittedMessage}
                </p>
              </div>
            </div>
          )}

          {/* Admin Note */}
          <div className="space-y-2">
            <Label htmlFor="adminNote" className="text-sm font-medium text-gray-700">
              Ghi chú của Admin <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="adminNote"
              placeholder={isApprove ? "Khóa học đạt tiêu chuẩn..." : "Khóa học cần chỉnh sửa..."}
              value={adminNote}
              onChange={(e) => {
                setAdminNote(e.target.value);
                setError('');
              }}
              rows={5}
              disabled={isSubmitting}
              className={`resize-none ${error && !isValid ? 'border-red-500' : ''}`}
            />
            
            {/* Character Counter */}
            <div className="flex items-center justify-between text-xs">
              <span className={`${charCount < MIN_MESSAGE_LENGTH ? 'text-red-500' : 'text-green-600'}`}>
                {charCount} / {MIN_MESSAGE_LENGTH} ký tự tối thiểu
              </span>
              {charCount > 0 && !isValid && (
                <span className="text-red-500">
                  Còn thiếu {MIN_MESSAGE_LENGTH - charCount} ký tự
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              isApprove ? 'Phê duyệt' : 'Từ chối'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveRejectModal;
