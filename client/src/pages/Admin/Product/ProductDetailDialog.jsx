import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from '../../../utils/format';

export default function ProductDetailDialog({ product, open, onClose }) {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div><b>Tên sản phẩm:</b> {product.name}</div>
          <div><b>Category:</b> {product.category?.name || <span className="text-gray-400">-</span>}</div>
          <div><b>Giá:</b> {formatPrice(product.price)}</div>
          <div><b>Giá sale:</b> {product.salePrice ? formatPrice(product.salePrice) : <span className="text-gray-400">-</span>}</div>
          <div><b>Stock:</b> {product.stock ?? <span className="text-gray-400">-</span>}</div>
          <div><b>Trạng thái:</b> {product.status ? <Badge className="bg-emerald-100 text-emerald-800">Active</Badge> : <Badge className="bg-red-100 text-red-800">Inactive</Badge>}</div>
          <div><b>Mô tả:</b> {product.description || <span className="text-gray-400">-</span>}</div>
          <div><b>Hình ảnh:</b>
            <div className="flex gap-2 mt-1 flex-wrap">
              {Array.isArray(product.images) && product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <img key={idx} src={img} alt={product.name + idx} className="w-20 h-20 object-cover rounded border" />
                ))
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>
          </div>
          <div><b>New:</b> {product.new ? "Yes" : "No"}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 