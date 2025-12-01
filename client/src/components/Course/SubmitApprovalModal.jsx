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
import { AlertCircle, Loader2 } from 'lucide-react';

const SubmitApprovalModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  courseTitle 
}) => {
  const [approvalMessage, setApprovalMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const MIN_MESSAGE_LENGTH = 10;
  const charCount = approvalMessage.trim().length;
  const isValid = charCount >= MIN_MESSAGE_LENGTH;

  const handleSubmit = async () => {
    if (!isValid) {
      setError(`Approval message must be at least ${MIN_MESSAGE_LENGTH} characters`);
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      await onSubmit(approvalMessage.trim());
      // Reset form
      setApprovalMessage('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit course for approval');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setApprovalMessage('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Submit Course for Approval</DialogTitle>
          <DialogDescription>
            Explain why this course should be approved. This message will be visible to the course approver.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Course Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Course
            </Label>
            <p className="text-sm font-semibold text-gray-900">
              {courseTitle}
            </p>
          </div>

          {/* Approval Message */}
          <div className="space-y-2">
            <Label htmlFor="approvalMessage" className="text-sm font-medium text-gray-700">
              Approval Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="approvalMessage"
              placeholder="Please review this course because..."
              value={approvalMessage}
              onChange={(e) => {
                setApprovalMessage(e.target.value);
                setError('');
              }}
              rows={5}
              disabled={isSubmitting}
              className={`resize-none ${error && !isValid ? 'border-red-500' : ''}`}
            />
            
            {/* Character Counter */}
            <div className="flex items-center justify-between text-xs">
              <span className={`${charCount < MIN_MESSAGE_LENGTH ? 'text-red-500' : 'text-green-600'}`}>
                {charCount} / {MIN_MESSAGE_LENGTH} characters minimum
              </span>
              {charCount > 0 && !isValid && (
                <span className="text-red-500">
                  {MIN_MESSAGE_LENGTH - charCount} more needed
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
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitApprovalModal;
