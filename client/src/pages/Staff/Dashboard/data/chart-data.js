import { format, eachDayOfInterval, startOfDay, endOfDay } from "date-fns";
import { vi } from "date-fns/locale";

export const generateRevenueChartData = (bookings, dateFrom, dateTo) => {
  if (!bookings || bookings.length === 0) {
    return [];
  }

  // Tạo mảng các ngày trong khoảng thời gian
  const days = eachDayOfInterval({
    start: startOfDay(dateFrom),
    end: endOfDay(dateTo),
  });

  // Nhóm booking theo ngày
  const bookingsByDate = {};
  bookings.forEach((booking) => {
    const date = format(new Date(booking.dateTime), "yyyy-MM-dd");
    if (!bookingsByDate[date]) {
      bookingsByDate[date] = [];
    }
    bookingsByDate[date].push(booking);
  });

  // Tạo dữ liệu cho chart
  return days.map((day) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const dayBookings = bookingsByDate[dateKey] || [];
    const revenue = dayBookings
      .filter((booking) => booking.status === "completed")
      .reduce((total, booking) => total + (booking.totalPay || 0), 0);

    return {
      date: format(day, "dd/MM", { locale: vi }),
      revenue: revenue,
    };
  });
};

export const generateStatusChartData = (bookings) => {
  if (!bookings || bookings.length === 0) {
    return [];
  }

  const statusCounts = {
    pending: 0,
    confirmed: 0,
    no_show: 0,
    completed: 0,
    cancelled: 0,
  };
  bookings.forEach((booking) => {
    const status = booking.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const statusLabels = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    no_show: "Không đến",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count,
  }));
};

export const generateServiceRevenueData = (bookings) => {
  if (!bookings || bookings.length === 0) {
    return [];
  }

  const serviceRevenue = {};
  bookings.forEach((booking) => {
    booking.serviceId.forEach((service) => {
      const serviceName = service.name || "Unknown";
      const price = service.basePrice || 0;

      if (!serviceRevenue[serviceName]) {
        serviceRevenue[serviceName] = {
          revenue: 0,
          bookings: 0,
        };
      }

      serviceRevenue[serviceName].revenue += price;
      serviceRevenue[serviceName].bookings += 1;
    });
  });

  return Object.entries(serviceRevenue)
    .map(([service, data]) => ({
      service: service,
      revenue: data.revenue,
      bookings: data.bookings,
    }))
    .sort((a, b) => b.revenue - a.revenue);
};

export const generateHourlyBookingsData = (bookings) => {
  if (!bookings || bookings.length === 0) {
    return [];
  }

  const hourlyCounts = {};
  bookings.forEach((booking) => {
    const hour = booking.startTime?.split(":")[0] || "0";
    hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
  });

  // Tạo dữ liệu cho 24 giờ
  const data = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    data.push({
      hour: `${hour}:00`,
      bookings: hourlyCounts[hour] || 0,
    });
  }

  return data;
};
