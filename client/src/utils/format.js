import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import vi from "dayjs/locale/vi";
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale(vi); // dùng tiếng Việt
export const formatPrice = (price) => {
  if (price === undefined || price === null) return "Miễn phí";
  if (price === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatPriceChart = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

export const formatPriceChartTrend = (price) => {
  if (price >= 1_000_000) {
    const million = price / 1_000_000;
    // Làm tròn đến 1 chữ số thập phân nếu cần
    const formatted = Number.isInteger(million) ? million : million.toFixed(1);
    return `${formatted}tr`;
  } else {
    return new Intl.NumberFormat("vi-VN").format(price);
  }
};
export const formatPhoneNumber = (value) => {
  // Nếu chưa có gì thì trả về chuỗi rỗng
  if (!value) return "";

  // Ép kiểu string và chỉ lấy số
  let raw = String(value).replace(/\D/g, "");

  // Nếu chưa bắt đầu bằng 0 thì thêm 0 vào đầu
  if (!raw.startsWith("0")) {
    raw = "0" + raw;
  }

  // Cắt tối đa 10 số
  const sliced = raw.slice(0, 10);

  // Định dạng
  if (sliced.length <= 4) return sliced;
  if (sliced.length <= 7) {
    return `${sliced.slice(0, 4)}.${sliced.slice(4)}`;
  }
  return `${sliced.slice(0, 4)}.${sliced.slice(4, 7)}.${sliced.slice(7)}`;
};

export const formatRawPhoneNumberReplace = (formattedValue) => {
  // Ép giá trị thành string, chỉ lấy số và giới hạn 10
  const raw = String(formattedValue ?? "").replace(/\D/g, "").slice(0, 10);
  return raw;
};

export function normalizeText(text) {
  // Ép giá trị thành string để tránh lỗi
  const str = String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  return str;
}

// dateStr: "25/04"
// timeStr: "14:30"
// Trả về ISO format: "2025-04-25T14:30:00"
export const buildDateTime = (dateStr, timeStr) => {
  const [day, month] = dateStr.split("/").map(Number);
  const year = new Date().getFullYear(); // hoặc lấy từ calendar nếu cần chọn năm

  const formatted = dayjs(`${year}-${month}-${day}T${timeStr}`);
  return formatted.toISOString(); // "2025-04-25T14:30:00.000Z"
};

export const formatTimeUTC = (date) => {
  if (!date) return "";
  const h = date.getUTCHours().toString().padStart(2, "0");
  const m = date.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};
/**
 * Trả về chuỗi thời gian còn lại đến lịch hẹn
 * @param {string} dateTime ISO string từ backend
 * @returns {string} ví dụ: "Còn 3 ngày", "Chỉ còn vài phút", "Đã qua 2 ngày"
 */

export const getBookingCountdownText = (dateTime) => {
  const targetTime = dayjs(dateTime);
  const now = dayjs();
  const diffMinutes = targetTime.diff(now, "minute");

  if (diffMinutes <= 0) {
    return { text: "Lịch hẹn đã qua. SpaConnect sẽ hủy bỏ lịch hẹn của anh nếu anh đến trễ quá 15 phút", isUrgent: false };
  }

  if (diffMinutes <= 5) {
    // Dưới hoặc bằng 5 phút thì hiển thị thông báo "Sắp đến lịch hẹn"
    return { text: "Sắp đến lịch hẹn của bạn", isUrgent: true };
  }

  if (diffMinutes <= 12 * 60) {
    // Dưới 12 tiếng, hiển thị số giờ còn lại
    const hoursLeft = Math.floor(diffMinutes / 60);
    const minutesLeft = diffMinutes % 60;

    if (hoursLeft === 0) {
      return {
        text: `Còn ${minutesLeft} phút nữa sẽ đến lịch hẹn của bạn`,
        isUrgent: true,
      };
    }
    return {
      text: `Còn ${hoursLeft} giờ ${minutesLeft > 0 ? minutesLeft + " phút" : ""} nữa sẽ đến lịch hẹn của bạn`,
      isUrgent: true,
    };
  }

  if (diffMinutes < 24 * 60) {
    // Dưới 1 ngày, hiển thị giờ
    const hoursLeft = Math.floor(diffMinutes / 60);
    return {
      text: `Còn ${hoursLeft} giờ nữa sẽ đến lịch hẹn của bạn`,
      isUrgent: false,
    };
  }

  // Trên hoặc bằng 1 ngày, hiển thị ngày
  const daysLeft = Math.floor(diffMinutes / (60 * 24));
  return {
    text: `Còn ${daysLeft} ngày nữa sẽ đến lịch hẹn của bạn`,
    isUrgent: false,
  };
};

// Utility function to format currency
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "0đ"
  return new Intl.NumberFormat('vi-VN').format(amount) + "đ"
}

// Utility function to format percentage
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return "0%"
  return `${value}%`
}

// Utility function to format number with comma
export const formatNumber = (number) => {
  if (number === null || number === undefined) return "0"
  return new Intl.NumberFormat('vi-VN').format(number)
}

// Utility function to format date
export const formatDate = (date) => {
  if (!date) return ""
  return new Date(date).toLocaleDateString('vi-VN')
}

// Utility function to format date time
export const formatDateTime = (date) => {
  if (!date) return ""
  return new Date(date).toLocaleString('vi-VN')
}

// Hàm định dạng giá chỉ với số, không có "VND"
export const formatPriceForInput = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return "";
  }
  return new Intl.NumberFormat("vi-VN").format(price);
};
// Price parse cho shop
export const parsePrice = (formattedPrice) => {
  if (typeof formattedPrice !== 'string' || formattedPrice.trim() === '') {
    return NaN;
  }
  // Loại bỏ tất cả dấu chấm và bất kỳ ký tự không phải số nào (bao gồm " VND")
  // Sử dụng regex để loại bỏ mọi thứ không phải chữ số
  const cleanedPrice = formattedPrice.replace(/[^0-9]/g, '');
  return parseFloat(cleanedPrice);
};

// Format duration from minutes to hours and minutes or H:MM:SS format
export const formatDuration = (minutes, format = 'text') => {
  if (minutes === undefined || minutes === null || minutes === 0) return format === 'text' ? "0 phút" : "0:00";
  
  if (format === 'time') {
    // Format as H:MM:SS or MM:SS for video duration
    // If input is already in seconds, use it directly
    let totalSeconds;
    if (minutes > 1000) {
      // Likely already in seconds
      totalSeconds = Math.floor(minutes);
    } else {
      // Convert minutes to seconds
      totalSeconds = Math.floor(minutes * 60);
    }
    
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }
  
  // Default text format (for course total duration)
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  if (hours > 0) {
    return `${hours} giờ ${mins} phút`;
  }
  return `${mins} phút`;
};
//format color gradient
export const formatGradientColor = () => {
  const gradients = [
    "from-blue-500 via-blue-600 to-blue-700",
  "from-purple-500 via-purple-600 to-purple-700",
  "from-pink-500 via-pink-600 to-pink-700",
  "from-green-500 via-green-600 to-green-700",
  "from-yellow-500 via-yellow-600 to-yellow-700",
  "from-red-500 via-red-600 to-red-700",
  "from-indigo-500 via-indigo-600 to-indigo-700",
  "from-teal-500 via-teal-600 to-teal-700",
  "from-orange-500 via-orange-600 to-orange-700",
  "from-cyan-500 via-cyan-600 to-cyan-700",
  ];

  return gradients;
}

export const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `Đăng ${seconds} giây trước`;
  if (minutes < 60) return `Đăng ${minutes} phút trước`;
  if (hours < 24) return `Đăng ${hours} giờ trước`;
  if (days < 30) return `Đăng ${days} ngày trước`;
  if (months < 12) return `Đăng ${months} tháng trước`;

  return `Đăng ${years} năm trước`;
}