export const ITEMS_PER_PAGE = 10

export const BOOKING_STATUS = {
    PENDING: "đang chờ xử lý",
    CONFIRMED: "đã xác nhận",
    CANCELLED: "đã huỷ",
    COMPLETED: "đã hoàn thành",
}

export const STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: BOOKING_STATUS.PENDING, label: "Đang chờ xử lý" },
    { value: BOOKING_STATUS.CONFIRMED, label: "Đã xác nhận" },
    { value: BOOKING_STATUS.COMPLETED, label: "Đã hoàn thành" },
    { value: BOOKING_STATUS.CANCELLED, label: "Đã hủy" },
]
