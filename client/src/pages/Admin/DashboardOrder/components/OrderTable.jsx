"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStatusBadge, getShippingBadge } from "./StatusBadge"

export default function OrderTable({ paginatedOrders, formatCurrency, handleViewDetail }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Giao hàng</TableHead>
            <TableHead>Ngày đặt</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">#{order.orderCode}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.UserId.fullName}</div>
                  <div className="text-sm text-gray-500">{order.UserId.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.product.name} x{item.quantity}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-medium">{formatCurrency(order.totalAmount)}</TableCell>
              <TableCell>{getStatusBadge(order.statusOrder)}</TableCell>
              <TableCell>{getShippingBadge(order.statusShipping)}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleViewDetail(order)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Chi tiết
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
