export const AVAILABLE_SERVICES = [
  { id: 1, name: "Cắt xả", price: 90000 },
  { id: 2, name: "Gội đầu thư giãn", price: 70000 },
  { id: 3, name: "Nhuộm thời trang", price: 250000 },
  { id: 4, name: "Uốn xoăn Hàn Quốc", price: 300000 },
];
export const DAY_MAP = {
      T2: "monday",
      T3: "tuesday",
      T4: "wednesday",
      T5: "thursday",
      T6: "friday",
      T7: "saturday",
      CN: "sunday",
    };
export const TIME_SLOTS = [
  ["15h00", "16h00", "17h00", "18h00", "19h00", "20h00"],
  ["15h20", "16h20", "17h20", "18h20", "19h20", "20h20"],
  ["15h40", "16h40", "17h40", "18h40", "19h40", "20h40"],
];
export const UNAVAILABLE_TIMES = ["15h00", "15h20", "15h40", "16h00", "16h20"];
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};
export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: "Chờ xác nhận",
  [BOOKING_STATUS.CONFIRMED]: "Đã xác nhận",
  [BOOKING_STATUS.COMPLETED]: "Hoàn thành",
  [BOOKING_STATUS.CANCELLED]: "Hủy lịch",
  [BOOKING_STATUS.NO_SHOW]: "Khách hàng không đến",
};
export const BOOKING_STEPS = {
  BRANCH: 0,
  SERVICE: 1,
  STYLIST: 2,
  DATE_TIME: 3,
  CONFIRM: 4,
};

export const HELP_SERVICE = [
  {
    _id: "682dae6cc5ad8aabc97a9f1e",
    name: "SpaConnect sẽ chọn giúp bạn. Hãy qua cửa hàng và tận hưởng dịch vụ nhé!",
    basePrice: 0,
  },
];

export const EXTRA_SERVICES = [
  {
    id: 1,
    name: "Massage vai cổ gáy",
    imageUrl: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    name: "Đắp mặt nạ dưỡng da",
    imageUrl: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    name: "Phục vụ trà gừng ấm miễn phí",
    imageUrl: "https://picsum.photos/200/300",
  },
];
