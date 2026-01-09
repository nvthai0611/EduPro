import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export const AddSectionDialog = ({ 
  open, 
  onOpenChange, 
  sectionForm, 
  setSectionForm, 
  handleAddSection, 
  isLoading 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm chương mới</DialogTitle>
          <DialogDescription>
            Tạo chương mới cho khóa học của bạn
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="section-title">Tiêu đề chương *</Label>
            <Input
              id="section-title"
              placeholder="VD: Giới thiệu về React"
              value={sectionForm.title}
              onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-description">Mô tả</Label>
            <Textarea
              id="section-description"
              placeholder="Mô tả ngắn về nội dung chương này..."
              rows={3}
              value={sectionForm.description}
              onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleAddSection}
            disabled={!sectionForm.title || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang thêm...
              </>
            ) : (
              'Thêm chương'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const EditSectionDialog = ({ 
  open, 
  onOpenChange, 
  sectionForm, 
  setSectionForm, 
  handleUpdateSection, 
  isLoading 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa chương</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-section-title">Tiêu đề chương *</Label>
            <Input
              id="edit-section-title"
              value={sectionForm.title}
              onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-section-description">Mô tả</Label>
            <Textarea
              id="edit-section-description"
              rows={3}
              value={sectionForm.description}
              onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleUpdateSection}
            disabled={!sectionForm.title || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
