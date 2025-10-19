"use client"

// components/edit-status-modal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

export default function EditStatusModal({ item, isOpen, onClose, onSave, type }) {
  const [currentStatus, setCurrentStatus] = useState(item ? item.status : false)

  useEffect(() => {
    if (item) {
      setCurrentStatus(item.status)
    }
  }, [item])

  const handleSave = () => {
    onSave(item._id, currentStatus)
    onClose()
  }

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-850 text-gray-900 dark:text-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            Chỉnh sửa Trạng thái {type === "review" ? "Đánh giá" : "Đánh giá Dịch vụ"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Chỉ có thể chỉnh sửa trạng thái của đánh giá này.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="status-switch" className="text-gray-700 dark:text-gray-300 text-lg">
              Trạng thái:
            </Label>
            <Switch
              id="status-switch"
              checked={currentStatus}
              onCheckedChange={setCurrentStatus}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
            />
            <span className="ml-2 text-lg font-semibold">{currentStatus ? "Hiển thị" : "Không hiển thị"}</span>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-transparent"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
