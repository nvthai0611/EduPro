import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminNoteModal = ({ 
  isOpen, 
  onClose, 
  courseTitle,
  status, 
  adminNote,
  approvalMessage,
  reviewedAt
}) => {
  const isApproved = status === 'approved';
  const title = isApproved ? 'Khóa học đã được duyệt' : 'Khóa học bị từ chối';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApproved ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>
            Chi tiết phản hồi từ admin về khóa học của bạn
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

          {/* Status Badge */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Trạng thái
            </Label>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-md ${
              isApproved ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {isApproved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Đã phê duyệt</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Bị từ chối</span>
                </>
              )}
            </div>
          </div>

          {/* Your Submission Message */}
          {approvalMessage && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Lý do bạn gửi
              </Label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {approvalMessage}
                </p>
              </div>
            </div>
          )}

          {/* Admin Note */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Phản hồi từ Admin
            </Label>
            <div className={`p-4 rounded-md border-2 ${
              isApproved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {adminNote || 'Không có ghi chú'}
              </p>
            </div>
          </div>

          {/* Review Date */}
          {reviewedAt && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Ngày xét duyệt
              </Label>
              <p className="text-sm text-gray-600">
                {new Date(reviewedAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

          {/* Action Info */}
          {!isApproved && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Hành động tiếp theo:</p>
                <p>Vui lòng chỉnh sửa khóa học theo phản hồi của admin và gửi lại để xét duyệt.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminNoteModal;
