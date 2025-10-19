"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStatusBadge, getShippingBadge } from "./StatusBadge"
import { useEffect, useState } from "react"

export default function OrderDetailModal({
  isDetailModalOpen,
  selectedOrder,
  isEditMode,
  editingOrder,
  formatCurrency,
  handleEditOrder,
  handleSaveOrder,
  handleCancelEdit,
  setIsDetailModalOpen,
  setIsEditMode,
  setEditingOrder, // Added setEditingOrder prop
}) {
  const [localEditingOrder, setLocalEditingOrder] = useState(editingOrder) // Hook 1

  useEffect(() => {
    // The logic inside useEffect can be conditional
    if (editingOrder) {
      setLocalEditingOrder(editingOrder)
    }
  }, [editingOrder]) // Added editingOrder to the dependency array

  // Now, the conditional return comes AFTER all hook calls
  if (!isDetailModalOpen || !selectedOrder) return null



  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Đơn hàng #{selectedOrder?.orderCode}</h2>
              <p className="text-blue-100 mt-1">Đặt lúc {new Date(selectedOrder?.createdAt).toLocaleString("vi-VN")}</p>
            </div>
            <div className="flex gap-3">
              {!isEditMode && (
                <button
                  onClick={() => handleEditOrder(selectedOrder)}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Chỉnh sửa
                </button>
              )}
              <button
                onClick={() => {
                  setIsDetailModalOpen(false)
                  setIsEditMode(false)
                  setLocalEditingOrder(null)
                }}
                className="px-6 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Đóng
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {isEditMode ? (
            <EditMode
              editingOrder={localEditingOrder}
              setEditingOrder={setLocalEditingOrder} // Pass setLocalEditingOrder here
              handleSaveOrder={() => handleSaveOrder(localEditingOrder)} // Pass localEditingOrder to handleSaveOrder
              handleCancelEdit={handleCancelEdit}
            />
          ) : (
            <ViewMode selectedOrder={selectedOrder} formatCurrency={formatCurrency} />
          )}
        </div>
      </div>
    </div>
  )
}

function EditMode({ editingOrder, setEditingOrder, handleSaveOrder, handleCancelEdit }) {
  return (
    <div className="space-y-8">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="font-medium">Chế độ chỉnh sửa</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Trạng thái đơn hàng
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái đơn hàng</label>
                <Select
                  disabled // Keep disabled as this is typically managed by order lifecycle, not direct edit
                  value={editingOrder?.statusOrder}
                  onValueChange={(value) => setEditingOrder({ ...editingOrder, statusOrder: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">🟡 Thanh toán khi nhận hàng</SelectItem>
                    <SelectItem value="paid">🔵 Đã thanh toán</SelectItem>
                    <SelectItem value="completed">🟢 Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">🔴 Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái giao hàng</label>
                <Select
                  // Removed disabled prop
                  value={editingOrder?.statusShipping}
                  onValueChange={(value) => setEditingOrder({ ...editingOrder, statusShipping: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">📦 Chờ giao</SelectItem>
                    <SelectItem value="shipped">🚚 Đang giao</SelectItem>
                    <SelectItem value="delivered">✅ Đã giao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Thời gian giao hàng</label>
                <Select
                  disabled // Keep disabled, typically not editable by admin in this context
                  value={editingOrder?.deliveryTime}
                  onValueChange={(value) => setEditingOrder({ ...editingOrder, deliveryTime: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">🕐 Tiêu chuẩn</SelectItem>
                    <SelectItem value="allday">🕘 Cả ngày</SelectItem>
                    <SelectItem value="fastdelivery">⚡ Giao nhanh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Địa chỉ & Ghi chú
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ giao hàng</label>
                <textarea
                  disabled // Keep disabled, address is usually not changed after order is placed
                  value={editingOrder?.shippingAddress}
                  onChange={(e) => setEditingOrder({ ...editingOrder, shippingAddress: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg h-24 resize-none focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Nhập địa chỉ giao hàng..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  disabled // Keep disabled, notes are usually from customer or internal, not edited here
                  value={editingOrder?.note}
                  onChange={(e) => setEditingOrder({ ...editingOrder, note: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg h-20 resize-none focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Ghi chú thêm..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          onClick={handleCancelEdit}
          className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSaveOrder}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Lưu thay đổi
        </button>
      </div>
    </div >
  )
}

function ViewMode({ selectedOrder, formatCurrency }) {
  return (
    <div className="space-y-8">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Trạng thái đơn</p>
              <div className="mt-1">{getStatusBadge(selectedOrder?.statusOrder)}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Giao hàng</p>
              <div className="mt-1">{getShippingBadge(selectedOrder?.statusShipping)}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Tổng tiền</p>
              <p className="text-lg font-bold text-purple-700">{formatCurrency(selectedOrder?.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Info */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Thông tin khách hàng
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Họ tên</p>
                <p className="font-semibold text-gray-800">{selectedOrder?.UserId?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{selectedOrder?.UserId?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-semibold text-gray-800">{selectedOrder?.UserId?.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Chi tiết đơn hàng
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="font-semibold text-gray-800">#{selectedOrder?.orderCode}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="font-semibold text-gray-800">
                  {new Date(selectedOrder?.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loại giao hàng</p>
                <p className="font-semibold text-gray-800">
                  {selectedOrder?.deliveryTime === "standard"
                    ? "🕐 Tiêu chuẩn"
                    : selectedOrder?.deliveryTime === "allday"
                      ? "🕘 Cả ngày"
                      : "⚡ Giao nhanh"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Sản phẩm đã đặt
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Số lượng</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Đơn giá</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item?.product?.name}</p>
                        <p className="text-sm text-gray-500">Mã: {item?.product?._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold">
                      {item?.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800">{formatCurrency(item?.price)}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">
                    {formatCurrency(item?.price * item?.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Address and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Address */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Địa chỉ giao hàng
          </h3>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-gray-700 leading-relaxed">{selectedOrder?.shippingAddress}</p>
          </div>
          {selectedOrder?.note && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Ghi chú:
              </h4>
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <p className="text-gray-700">{selectedOrder?.note}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Tổng kết đơn hàng
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(selectedOrder?.totalAmount - selectedOrder?.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="font-semibold text-gray-800">{formatCurrency(selectedOrder?.shippingFee)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg border-2 border-purple-600">
              <span className="text-lg font-bold">Tổng cộng:</span>
              <span className="text-2xl font-bold">{formatCurrency(selectedOrder?.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}