  import { addDays, differenceInDays, format, isAfter } from "date-fns";
  import vi from "date-fns/locale/vi";

  // Hàm tạo ra danh sách các tùy chọn ngày để hiển thị, ví dụ trong form đặt lịch
  // Tham số `days` mặc định là 7 - nghĩa là tạo danh sách cho 7 ngày tiếp theo kể từ hôm nay
  export const generateDateOptions = (days = 7) => {
    const options = []; // Mảng chứa các tùy chọn ngày

    // Lặp qua từng ngày, từ 0 đến days - 1
    for (let i = 0; i < days; i++) {
      const date = addDays(new Date(), i); // Tính ngày i kể từ hôm nay

      const weekday = format(date, "EEE", { locale: vi }); // Định dạng tên thứ ngắn (vd: T2, T3) theo tiếng Việt

      // Tạo nhãn hiển thị cho từng ngày:
      // - Nếu là hôm nay thì hiển thị "Hôm nay, T2 (22/05)"
      // - Nếu là ngày mai thì hiển thị "Ngày mai, T3 (23/05)"
      // - Ngày khác thì hiển thị "Tư (24/05)"
      const label =
        i === 0
          ? `Hôm nay, ${weekday} (${format(date, "dd/MM")})`
          : i === 1
          ? `Ngày mai, ${weekday} (${format(date, "dd/MM")})`
          : `${weekday} (${format(date, "dd/MM")})`;
      // Thêm đối tượng vào mảng options
      options.push({
        id: i, // Dùng chỉ số làm ID (có thể thay bằng timestamp nếu cần duy nhất)
        label, // Nhãn đã định dạng để hiển thị
        date: format(date, "dd/MM"), // Ngày định dạng đơn giản (vd: 22/05)
        isWeekend: [0, 6].includes(date.getDay()), // Kiểm tra có phải cuối tuần không (Chủ nhật: 0, Thứ Bảy: 6)
      });
    }

    return options; // Trả về mảng các lựa chọn ngày
  };

  // Hàm tạo danh sách khung giờ
  export const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  /**
   * Hàm tính trạng thái hết hạn của chương trình khuyến mãi
   */
  export const getPromotionExpiryText = (endDateString) => {
    if (!endDateString) return "Không rõ ngày hết hạn";
    const endDate = new Date(endDateString);
    if (isNaN(endDate.getTime())) return "Không rõ ngày hết hạn";
    const now = new Date();
    if (isAfter(now, endDate)) {
      return "Đã hết hạn";
    }
    const daysLeft = differenceInDays(endDate, now);
    const formattedDate = format(endDate, "dd/MM/yyyy", { locale: vi });
    return `Hết hạn: ${formattedDate} (${daysLeft} ngày nữa)`;
  };