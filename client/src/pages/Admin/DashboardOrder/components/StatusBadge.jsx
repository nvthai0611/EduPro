import { Badge } from "@/components/ui/badge"

export function getStatusBadge(status) {
  const variants = {
    pending: "secondary",
    paid: "default",
    completed: "default",
    cancelled: "destructive",
  }

  const labels = {
    pending: "Thanh toán khi nhận hàng",
    paid: "Đã thanh toán",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  }

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

export function getShippingBadge(status) {
  const variants = {
    pending: "secondary",
    shipped: "default",
    delivered: "default",
  }

  const labels = {
    pending: "Chờ giao",
    shipped: "Đang giao",
    delivered: "Đã giao",
  }

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}
