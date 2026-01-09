import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const DeleteDialog = ({ 
  open, 
  onOpenChange, 
  deleteTarget, 
  handleDelete, 
  isLoading 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa {deleteTarget.type === 'section' ? 'chương' : 'bài học'}{' '}
            <span className="font-semibold">{deleteTarget.name}</span>?
            {deleteTarget.type === 'section' && (
              <span className="block mt-2 text-red-600">
                Lưu ý: Tất cả bài học trong chương này cũng sẽ bị xóa.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
