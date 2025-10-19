"use client";

import { useState, useEffect } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Icons
import {
  Calendar,
  Clock,
  User,
  Scissors,
  Tag,
  FileText,
  CreditCard,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  DiamondPercent,
  Phone,
} from "lucide-react";


// Services
import {
  checkStaffAvailability,
  getServices,
  getAllStaff,
  getAllRooms,
  getCoupons,
} from "../../../services/staff/bookingService";
import { BOOKING_STATUS } from "../../../constains/booking";
import { toast } from "react-toastify";

// Component hiển thị lỗi chung
const ErrorMessage = ({ error }) =>
  error ? (
    <div className="text-sm text-red-600 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {error}
    </div>
  ) : null;

export default function BookingDialog({
  open,
  onOpenChange,
  mode = "create", // "create" or "edit"
  bookingData = null, // Data for edit mode
  onSubmit,
}) {
  // ===== FORM DATA STATE =====
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    services: [],
    dateTime: "",
    startTime: "08:00",
    couponCode: null,
    notes: "",
    type: "online",
    totalPrice: 0,
    duration: 0,
    totalPay: 0,
  });

  // ===== CALCULATED DATA STATE =====
  const [calculatedData, setCalculatedData] = useState({
    totalDuration: 0,
    totalPrice: 0,
    discountAmount: 0,
    finalPrice: 0,
  });

  // ===== API DATA STATE =====
  const [services, setServices] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  // ===== UI STATE =====
  const [expandedServices, setExpandedServices] = useState({});
  const [staffAvailability, setStaffAvailability] = useState({});
  const [unavailableStaffMessage, setUnavailableStaffMessage] = useState("");

  // ===== LOADING & ERROR STATE =====
  const [loading, setLoading] = useState({
    services: false,
    staff: false,
    rooms: false,
  });
  const [error, setError] = useState({
    services: null,
    staff: null,
    rooms: null,
  });

  // ===== VALIDATION STATE =====
  const [validationErrors, setValidationErrors] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    dateTime: "",
    startTime: "",
    services: "",
  });

  // ===== USE EFFECTS =====

  // Initialize form data when dialog opens or bookingData changes
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [hasUserChanged, setHasUserChanged] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && bookingData) {
        setFormData({
          _id: bookingData?._id || "",
          customerId: bookingData?.customerId || "",
          customerName: bookingData?.customerName || "",
          customerPhone: bookingData?.customerPhone || "",
          customerEmail: bookingData?.customerEmail || "",
          services: bookingData?.serviceDetails || [],
          dateTime: bookingData?.dateTime
            ? new Date(bookingData?.dateTime).toISOString().split("T")[0]
            : "",
          startTime: bookingData?.startTime || "08:00",
          couponCode: bookingData?.couponCode || null,
          notes: bookingData?.notes || "",
          type: bookingData?.type || "online",
        });
        // Expand all services in edit mode
        const expanded = {};
        if (bookingData?.serviceDetails) {
          bookingData?.serviceDetails?.forEach((_, index) => {
            expanded[index] = true;
          });
        }
        setExpandedServices(expanded);
      } else {
        // Reset form for create mode
        setFormData({
          customerId: "",
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          services: [],
          dateTime: "",
          startTime: "08:00",
          couponCode: null,
          notes: "",
          type: "online",
        });
        setExpandedServices({});
      }
      // Fetch data khi dialog mở
      fetchInitialData();
      // Luôn auto-calculate khi mở dialog
      setTimeout(() => {
        handleTimeChange();
      }, 0);
    } else {
      setValidationErrors({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        dateTime: "",
        startTime: "",
      });
    }
  }, [open, mode, bookingData]);

  useEffect(() => {
    handleTimeChange();
  }, [
    formData.dateTime,
    formData.startTime,
    formData.couponCode?._id,
    formData.services,
    services,
  ]);

  // Filter staff based on selected services
  useEffect(() => {
    if (formData.services.length > 0 && allStaff.length > 0) {
      const filtered = allStaff.filter((staff) =>
        formData.services.some(
          (service) => staff.skills && staff.skills.includes(service.serviceId)
        )
      );
      setFilteredStaff(filtered);
    } else {
      setFilteredStaff([]);
    }
  }, [formData.services, allStaff]);

  // Filter rooms - show all rooms since no branch filter needed
  useEffect(() => {
    if (allRooms.length > 0) {
      setFilteredRooms(allRooms);
    }
  }, [allRooms]);

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      const couponsResponse = await getCoupons();
      setCoupons(couponsResponse.data || []);
    };
    fetchCoupons();
  }, []);

  // ===== DATA FETCHING FUNCTIONS =====

  // Function để fetch data ban đầu
  const fetchInitialData = async () => {
    try {
      setLoading({ services: true, staff: true, rooms: true });
      setError({ services: null, staff: null, rooms: null });

      // Fetch services
      try {
        const servicesResponse = await getServices();
        setServices(servicesResponse.data || []);
      } catch (error) {
        console.error("Lỗi fetch services:", error);
        setError((prev) => ({
          ...prev,
          services: "Không thể tải danh sách dịch vụ",
        }));
        setServices([]);
      }

      // Fetch staff
      try {
        const staffResponse = await getAllStaff();
        setAllStaff(staffResponse.data || []);
      } catch (error) {
        console.error("Lỗi fetch staff:", error);
        setError((prev) => ({
          ...prev,
          staff: "Không thể tải danh sách nhân viên",
        }));
        setAllStaff([]);
      }

      // Fetch rooms
      try {
        const roomsResponse = await getAllRooms();
        setAllRooms(roomsResponse.data || []);
      } catch (error) {
        console.error("Lỗi fetch rooms:", error);
        setError((prev) => ({
          ...prev,
          rooms: "Không thể tải danh sách phòng",
        }));
        setAllRooms([]);
      }

      // Fetch coupons
      const fetchCoupons = async () => {
        try {
          const couponsResponse = await getCoupons();
          setCoupons(couponsResponse.data || []);
        } catch (error) {
          console.error("Lỗi fetch coupons:", error);
        }
      };
      fetchCoupons();
    } catch (error) {
      console.error("Lỗi fetch data:", error);
    } finally {
      setLoading({ services: false, staff: false, rooms: false });
    }
  };

  // ===== FORM HANDLER FUNCTIONS =====

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setError({
        dateTime: "Không thể để trống ngày",
      });
      return;
    }

    if (new Date(value) < new Date()) {
      setError({
        dateTime: "Không thể chọn ngày trong quá khứ",
      });
      return;
    }

    handleInputChange("dateTime", value);
  };

  const handleStaffToggle = (index, bookingId, staffId) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, staffId } : service
      ),
    }));

    // Check staff availability
    if (staffId && staffId !== "none") {
      checkStaffAvailabilityForService(bookingId, staffId, index);
    } else {
      // Clear availability check
      setStaffAvailability((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }

    // Validate services khi chọn staff
    setTimeout(() => {
      const updatedServices = formData.services.map((service, i) =>
        i === index ? { ...service, staffId } : service
      );

      const servicesError = validateServices(updatedServices);
      setValidationErrors((prev) => ({
        ...prev,
        services: servicesError,
      }));
    }, 100);
  };

  const handleRoomToggle = (index, roomId) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, roomId } : service
      ),
    }));

    // Validate services khi chọn room
    setTimeout(() => {
      const updatedServices = formData.services.map((service, i) =>
        i === index ? { ...service, roomId } : service
      );

      const servicesError = validateServices(updatedServices);
      setValidationErrors((prev) => ({
        ...prev,
        services: servicesError,
      }));
    }, 100);
  };

  const handleServiceChange = (index, field, value) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        services: prev.services.map((service, i) =>
          i === index
            ? {
                ...service,
                [field]: value,
                // Reset staff and room when service changes
                ...(field === "serviceId" ? { staffId: "", roomId: "" } : {}),
              }
            : service
        ),
      };

      // Tính lại discount ngay lập tức nếu thay đổi serviceId
      if (field === "serviceId") {
        setTimeout(() => {
          // Tính toán với dữ liệu mới
          const updatedServices = newFormData.services;
          let totalDuration = 0;
          let totalPrice = 0;

          updatedServices.forEach((serviceItem) => {
            const service = services.find(
              (s) => s._id === serviceItem.serviceId
            );
            if (service) {
              totalDuration += service.duration || 0;
              totalPrice += service.basePrice || 0;
            }
          });

          // Tính discount
          const discountAmount = calculateDiscount(
            totalPrice,
            newFormData.couponCode,
            updatedServices
          );
          const finalPrice = Math.max(0, totalPrice - discountAmount);

          setCalculatedData({
            totalDuration,
            totalPrice,
            discountAmount,
            finalPrice,
          });
        }, 100);
      }

      return newFormData;
    });

    // Reset staff availability khi service thay đổi
    if (field === "serviceId") {
      setStaffAvailability((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
      setUnavailableStaffMessage("");
    }

    // Validate services khi có thay đổi (chỉ validate khi đã chọn đầy đủ)
    setTimeout(() => {
      const updatedServices = formData.services.map((service, i) =>
        i === index
          ? {
              ...service,
              [field]: value,
              ...(field === "serviceId" ? { staffId: "", roomId: "" } : {}),
            }
          : service
      );

      const servicesError = validateServices(updatedServices);
      setValidationErrors((prev) => ({
        ...prev,
        services: servicesError,
      }));
    }, 100);

    setHasUserChanged(true);
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số
    const numericValue = value.replace(/[^0-9]/g, "");
    const limitedValue = numericValue.slice(0, 11);
    handleInputChange("customerPhone", limitedValue);
  };

  // Function để auto adjust phút về 00 hoặc 30
  const handleTimeInput = (e) => {
    const value = e.target.value;

    // Reset staff và room khi thay đổi start time
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) => ({
        ...service,
        staffId: "",
        roomId: "",
      })),
    }));

    // Clear staff availability khi thay đổi time
    setStaffAvailability({});
    setUnavailableStaffMessage("");

    if (!value) {
      handleInputChange("startTime", value);
      return;
    }

    const [hours, minutes] = value.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);

    if (hour < 8 || hour > 19.5) {
      setError({
        startTime: "Thời gian bắt đầu không hợp lệ (8:00 - 19:30)",
      });
      return;
    }

    // Auto adjust phút về 00 hoặc 30 gần nhất
    let adjustedMinutes;
    if (minute < 15) {
      adjustedMinutes = "00";
    } else if (minute < 45) {
      adjustedMinutes = "30";
    } else {
      adjustedMinutes = "00";
      // Tăng giờ lên 1 nếu phút > 45
      if (hour < 21) {
        const adjustedTime = `${String(hour + 1).padStart(2, "0")}:00`;
        handleInputChange("startTime", adjustedTime);
        return;
      }
    }

    const adjustedTime = `${String(hour).padStart(2, "0")}:${adjustedMinutes}`;
    handleInputChange("startTime", adjustedTime);
  };

  // ===== BUSINESS LOGIC FUNCTIONS =====

  // Function check staff availability
  const checkStaffAvailabilityForService = async (bookingId, staffId, serviceIndex) => {
    if (!formData.dateTime || !formData.startTime) return;

    const serviceItem = formData.services[serviceIndex];
    if (!serviceItem || !serviceItem.serviceId) return;

    // Tính toán start time cho service hiện tại
    const startTime = calculateServiceStartTime(serviceIndex);

    // Set loading state
    setStaffAvailability((prev) => ({
      ...prev,
      [serviceIndex]: { isChecking: true, isAvailable: false, message: "" },
    }));

    try {
      const response = await checkStaffAvailability(
        bookingId,
        staffId,
        serviceItem.serviceId,
        startTime,
        formData.dateTime
      );

      const isAvailable = response.data.isAvailable;
      const message = response.data.message || "";

      setStaffAvailability((prev) => ({
        ...prev,
        [serviceIndex]: {
          isChecking: false,
          isAvailable,
          message,
        },
      }));

      if (!isAvailable) {
        setUnavailableStaffMessage(
          "Nhân viên không rảnh trong khoảng thời gian này"
        );
      } else {
        setUnavailableStaffMessage("");
      }
    } catch (error) {
      console.error("Lỗi check staff availability:", error);
      setStaffAvailability((prev) => ({
        ...prev,
        [serviceIndex]: {
          isChecking: false,
          isAvailable: false,
          message: "Lỗi kiểm tra availability",
        },
      }));
    }
  };

  // Function tính toán discount
  const calculateDiscount = (
    totalPrice,
    couponCode,
    servicesToCheck = null
  ) => {
    if (!couponCode) return 0;
    let selectedCoupon =
      typeof couponCode === "object"
        ? couponCode
        : coupons.find((c) => c._id === couponCode);
    if (!selectedCoupon) return 0;
    if (
      selectedCoupon.maxUses <= selectedCoupon.usedCount ||
      selectedCoupon.endDate < new Date()
    )
      return 0;

    let applicablePrice = 0;
    if (selectedCoupon.applicableToAll) {
      applicablePrice = totalPrice;
    } else {
      // Lấy danh sách _id dạng string
      const applicableServiceIds = (
        selectedCoupon.applicableServices || []
      ).map((s) => (typeof s === "object" ? s._id : s));
      const servicesToUse = servicesToCheck || formData.services;
      applicablePrice = servicesToUse.reduce((sum, serviceItem) => {
        // So sánh kiểu string
        if (applicableServiceIds.includes(String(serviceItem.serviceId))) {
          const service = services.find((s) => s._id === serviceItem.serviceId);
          return sum + (service?.basePrice || 0);
        }
        return sum;
      }, 0);
    }

    let discountAmount = 0;
    if (selectedCoupon.discountType === "percentage") {
      discountAmount = (applicablePrice * selectedCoupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(selectedCoupon.discountValue, applicablePrice);
    }
    return discountAmount;
  };

  //Function check coupon có áp dụng đc không
  const checkCouponApplicable = (couponCode) => {
    return (couponCode && calculatedData.discountAmount === 0);
  }

  const handleTimeChange = () => {
    let totalDuration = 0;
    let totalPrice = 0;
    formData.services.forEach((serviceItem) => {
      const service = services.find((s) => s._id === serviceItem.serviceId);
      if (service) {
        totalDuration += service.duration || 0;
        totalPrice += service.basePrice || 0;
      }
    });
    let discountAmount = 0;
    if (formData.couponCode && formData.couponCode._id) {
      discountAmount = calculateDiscount(
        totalPrice,
        formData.couponCode,
        formData.services
      );
    }
    const finalPrice = Math.max(0, totalPrice - discountAmount);
    setCalculatedData({
      totalDuration,
      totalPrice,
      discountAmount,
      finalPrice,
    });
  };

  // ===== SERVICE MANAGEMENT FUNCTIONS =====

  const addService = () => {
    const newIndex = formData.services.length;
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { serviceId: "", staffId: "", roomId: "" }],
    }));
    // Auto expand new service
    setExpandedServices((prev) => ({
      ...prev,
      [newIndex]: true,
    }));
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
    // Remove from expanded state
    setExpandedServices((prev) => {
      const newState = { ...prev };
      delete newState[index];
      // Reindex remaining services
      const reindexed = {};
      Object.keys(newState).forEach((key) => {
        const oldIndex = Number.parseInt(key);
        if (oldIndex > index) {
          reindexed[oldIndex - 1] = newState[key];
        } else {
          reindexed[oldIndex] = newState[key];
        }
      });
      return reindexed;
    });

    // Clear staff availability cho service đã xóa
    setStaffAvailability((prev) => {
      const newState = { ...prev };
      delete newState[index];
      // Reindex remaining availability
      const reindexed = {};
      Object.keys(newState).forEach((key) => {
        const oldIndex = Number.parseInt(key);
        if (oldIndex > index) {
          reindexed[oldIndex - 1] = newState[key];
        } else {
          reindexed[oldIndex] = newState[key];
        }
      });
      return reindexed;
    });
  };

  const toggleServiceExpansion = (index) => {
    setExpandedServices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getServiceSummary = (serviceItem, index) => {
    const service = services.find((s) => s._id === serviceItem.serviceId);
    const staff = allStaff.find((s) => s._id === serviceItem.staffId);
    const room = allRooms.find((r) => r._id === serviceItem.roomId);

    if (!service) return `Dịch vụ ${index + 1}: Chưa chọn`;

    let summary = service.name;
    if (staff) summary += ` • ${staff.name}`;
    if (room) summary += ` • ${room.name}`;

    // Thêm start time cho service
    const serviceStartTime = calculateServiceStartTime(index);
    summary += ` • ${serviceStartTime}`;

    return summary;
  };

  const isFormDataTimeValid = () => {
    return formData.startTime !== "" && formData.dateTime !== "";
  };

  const isFormDataServicesValid = () => {
    return formData.services.every(
      (service) =>
        service.serviceId !== "" &&
        service.staffId !== "" &&
        service.roomId !== ""
    );
  };

  // Function tính toán start time cho service dựa trên index
  const calculateServiceStartTime = (serviceIndex) => {
    if (serviceIndex === 0) {
      return formData.startTime;
    }

    let totalDuration = 0;

    // Tính tổng thời gian của các service trước đó
    for (let i = 0; i < serviceIndex; i++) {
      const prevService = formData.services[i];
      if (prevService.serviceId && prevService.serviceId !== "default") {
        const service = services.find((s) => s._id === prevService.serviceId);
        if (service) {
          totalDuration += service.duration || 0;
        }
      }
    }

    // Tính start time cho service hiện tại
    if (totalDuration > 0) {
      const baseTime = new Date(`2000-01-01T${formData.startTime}:00`);
      const newTime = new Date(baseTime.getTime() + totalDuration * 60000);
      return newTime.toTimeString().slice(0, 5);
    }

    return formData.startTime;
  };

  // Function lọc dịch vụ khả dụng cho từng service slot
  const getAvailableServicesForSlot = (currentIndex) => {
    // Lấy danh sách serviceId đã được chọn ở các slot khác
    const selectedServiceIds = formData.services
      .map((service, index) => {
        // Bỏ qua slot hiện tại và các slot chưa chọn service
        if (
          index === currentIndex ||
          !service.serviceId ||
          service.serviceId === "default"
        ) {
          return null;
        }
        return service.serviceId;
      })
      .filter(Boolean);

    // Lọc ra các dịch vụ chưa được chọn
    return services.filter(
      (service) => !selectedServiceIds.includes(service._id)
    );
  };

  // ===== VALIDATION FUNCTIONS =====

  const validateCustomerName = (name) => {
    if (!name || name.trim() === "") {
      return "Tên khách hàng không được để trống";
    }
    if (name.trim().length < 2) {
      return "Tên khách hàng phải có ít nhất 2 ký tự";
    }
    if (name.trim().length > 50) {
      return "Tên khách hàng không được quá 50 ký tự";
    }
    return "";
  };

  const validateCustomerPhone = (phone) => {
    if (!phone || phone.trim() === "") {
      return "Số điện thoại không được để trống";
    }
    const phoneRegex = /^((03|05|07|08|09)[0-9]{8})$/;
    if (!phoneRegex.test(phone.trim())) {
      return "Số điện thoại không hợp lệ (10-11 số) và là số Việt Nam";
    }
    return "";
  };

  const validateCustomerEmail = (email) => {
    if (!email || email.trim() === "") {
      return "Email không được để trống";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Email không hợp lệ";
    }
    return "";
  };

  const validateDateTime = (date) => {
    if (!date) {
      return "Ngày không được để trống";
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Không thể chọn ngày trong quá khứ";
    }
    return "";
  };

  const validateStartTime = (time) => {
    if (!time) {
      return "Giờ bắt đầu không được để trống";
    }

    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const now = new Date();

    // Check giờ làm việc
    if (hour < 7 || hour > 21) {
      return "Giờ làm việc từ 07:00 đến 21:00";
    }

    // Check phút phải là 00 hoặc 30
    if (minutes !== "00" && minutes !== "30") {
      return "Giờ bắt đầu phải là 00 hoặc 30 phút";
    }

    // Check nếu chọn ngày hôm nay thì giờ phải sau giờ hiện tại
    if (formData.dateTime === formatDate(now)) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (
        hour < currentHour + 1 ||
        (hour === currentHour && minute <= currentMinute)
      ) {
        return "Giờ bắt đầu hơn bây giờ 1 giờ";
      }
    }

    return "";
  };

  const validateServices = (services) => {
    if (!services || services.length === 0) {
      return "Phải chọn ít nhất 1 dịch vụ";
    }

    // Kiểm tra từng service đã chọn đầy đủ chưa
    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      // Nếu service này chưa chọn serviceId thì bỏ qua (chưa hoàn thành)
      if (!service.serviceId || service.serviceId === "default") {
        continue;
      }

      // Nếu đã chọn serviceId nhưng chưa chọn staff hoặc room thì bỏ qua
      if (!service.staffId || !service.roomId) {
        continue;
      }

      // Chỉ validate khi đã chọn đầy đủ service, staff, room
      if (service.serviceId && service.staffId && service.roomId) {
        // Service này đã hoàn thành, kiểm tra service tiếp theo
        continue;
      }
    }

    // Kiểm tra có ít nhất 1 service hoàn thành không
    const completedServices = services.filter(
      (service) =>
        service.serviceId &&
        service.serviceId !== "default" &&
        service.staffId &&
        service.roomId
    );

    if (completedServices.length === 0) {
      return "Phải hoàn thành ít nhất 1 dịch vụ (chọn dịch vụ, nhân viên và phòng)";
    }

    return "";
  };

  // Function validate tất cả
  const validateForm = () => {
    const errors = {
      customerName: validateCustomerName(formData.customerName),
      customerPhone: validateCustomerPhone(formData.customerPhone),
      customerEmail: validateCustomerEmail(formData.customerEmail),
      dateTime: validateDateTime(formData.dateTime),
      startTime: validateStartTime(formData.startTime),
      services: validateServices(formData.services),
    };

    setValidationErrors(errors);

    // Return true nếu không có lỗi nào
    return !Object.values(errors).some((error) => error !== "");
  };

  const isEditable = () => {
    return (
      bookingData?.status === BOOKING_STATUS.PENDING ||
      bookingData?.status === ""
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form trước khi submit
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    // Check if any staff is not available
    const unavailableStaff = Object.values(staffAvailability).some(
      (availability) => !availability.isAvailable
    );

    if (unavailableStaff) {
      toast.error(
        "Có staff không rảnh trong thời gian đã chọn. Vui lòng kiểm tra lại!"
      );
      return;
    }

    // Lọc ra chỉ những services đã hoàn thành
    const completedServices = formData.services.filter(
      (service) =>
        service.serviceId &&
        service.serviceId !== "default" &&
        service.staffId &&
        service.roomId
    );

    if (completedServices.length === 0) {
      toast.error("Phải hoàn thành ít nhất 1 dịch vụ");
      return;
    }

    const submitData = {
      _id: formData._id || null,
      customerId: formData.customerId || null,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      serviceId: completedServices.map((serviceItem) => serviceItem.serviceId),
      staffId: completedServices.map((serviceItem) => serviceItem.staffId),
      roomId: completedServices.map((serviceItem) => serviceItem.roomId),
      dateTime: formData.dateTime,
      startTime: formData.startTime,
      duration: calculatedData.totalDuration,
      totalPrice: calculatedData.totalPrice,
      totalDiscount: calculatedData.discountAmount,
      couponCode: formData.couponCode?._id || null,
      totalPay: calculatedData.finalPrice,
      status:
        mode === "edit"
          ? bookingData?.status
          : formData.type === "online"
          ? BOOKING_STATUS.PENDING
          : BOOKING_STATUS.CONFIRMED,
      notes: formData.notes,
      type: formData.type,
    };
    if (onSubmit) {
      onSubmit(submitData);
    }
  };

  // ===== UTILITY FUNCTIONS =====

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;
  };

  const formatDate = (date) => {
    const dateString = date.toLocaleDateString("vi-VN").split(",")[0];
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {mode === "edit" ? "Sửa lịch hẹn" : "Đặt lịch dịch vụ"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Cập nhật thông tin lịch hẹn"
              : "Vui lòng điền đầy đủ thông tin để đặt lịch"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Tên khách hàng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                placeholder="Nhập tên khách hàng"
                required
                disabled={
                  mode === "edit" &&
                  bookingData?.status !== BOOKING_STATUS.PENDING
                }
                className={
                  validationErrors.customerName ? "border-red-500" : ""
                }
              />
              <ErrorMessage error={validationErrors.customerName} />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="customerPhone"
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                disabled={
                  mode === "edit" &&
                  bookingData?.status !== BOOKING_STATUS.PENDING
                }
                onChange={handlePhoneInput}
                placeholder="VD: 0987654321 (10-11 số)"
                required
                className={
                  validationErrors.customerPhone ? "border-red-500" : ""
                }
              />
              <ErrorMessage error={validationErrors.customerPhone} />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="customerEmail"
                className="flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerEmail"
                type="email"
                disabled={mode === "edit"}
                value={formData.customerEmail}
                onChange={(e) =>
                  handleInputChange("customerEmail", e.target.value)
                }
                placeholder="VD: example@email.com"
                required
                className={
                  validationErrors.customerEmail ? "border-red-500" : ""
                }
              />
              <ErrorMessage error={validationErrors.customerEmail} />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateTime" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ngày <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateTime"
                type="date"
                min={formatDate(new Date())}
                disabled={
                  mode === "edit" &&
                  bookingData?.status !== BOOKING_STATUS.PENDING
                }
                value={formData.dateTime}
                onChange={handleDateChange}
                required
                className={validationErrors.dateTime ? "border-red-500" : ""}
              />
              <ErrorMessage error={validationErrors.dateTime} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Giờ bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                step="1800"
                value={formData.startTime || "08:00"}
                max="19:30"
                onChange={handleTimeInput}
                required
                disabled={
                  mode === "edit" &&
                  bookingData?.status !== BOOKING_STATUS.PENDING
                }
                className={validationErrors.startTime ? "border-red-500" : ""}
                placeholder="HH:MM"
              />
              <div className="text-xs text-muted-foreground">
                Phút sẽ tự động điều chỉnh về 00 hoặc 30
              </div>
              <ErrorMessage error={validationErrors.startTime} />
            </div>
          </div>

          {/* Service Selection with Staff and Room */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Dịch vụ <span className="text-red-500">*</span>
            </Label>

            <div className="space-y-3">
              {formData.services.map((serviceItem, index) => {
                const service = services.find(
                  (s) => s._id === serviceItem.serviceId
                );
                const availableStaff = allStaff;
                const availableRooms = allRooms.filter(
                  (room) => room.serviceCategory === service?.categoryId
                );
                const isExpanded = expandedServices[index];

                return (
                  <Card key={index} className="overflow-hidden">
                    <Collapsible
                      open={isExpanded}
                      onOpenChange={() => toggleServiceExpansion(index)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {service && (
                                <img
                                  src={service?.image}
                                  alt={service?.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">
                                  {getServiceSummary(serviceItem, index)}
                                </div>
                                {service && (
                                  <div className="text-sm text-muted-foreground">
                                    {formatDuration(service?.duration)} •{" "}
                                    {formatCurrency(service?.basePrice)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                disabled={
                                  mode === "edit" &&
                                  bookingData?.status !== BOOKING_STATUS.PENDING
                                }
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeService(index);
                                }}
                              >
                                Xóa
                              </Button>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-4 border-t">
                          {/* Service, Staff, Room in one row */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                            {/* Service Selection */}
                            <div>
                              <Label>Dịch vụ {index + 1}</Label>
                              <Select
                                disabled={
                                  (mode === "edit" &&
                                    bookingData?.status !==
                                      BOOKING_STATUS.PENDING) ||
                                  loading.services ||
                                  !isFormDataTimeValid()
                                }
                                value={serviceItem.serviceId || "default"}
                                onValueChange={(value) =>
                                  handleServiceChange(
                                    index,
                                    "serviceId",
                                    value === "default" ? "" : value
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={
                                    validationErrors.services
                                      ? "border-red-500"
                                      : ""
                                  }
                                >
                                  <SelectValue
                                    placeholder={
                                      loading.services
                                        ? "Đang tải..."
                                        : "Chọn dịch vụ"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent className="max-h-[350px] overflow-y-auto">
                                  {getAvailableServicesForSlot(index).map(
                                    (service) => (
                                      <SelectItem
                                        className="cursor-pointer"
                                        style={{
                                          backgroundColor:
                                            serviceItem.serviceId ===
                                            service._id
                                              ? "lightblue"
                                              : "transparent",
                                        }}
                                        key={service._id}
                                        value={service._id}
                                      >
                                        <div className="flex items-center gap-3">
                                          <img
                                            src={service?.image}
                                            alt={service?.name}
                                            className="w-10 h-6 rounded-lg object-cover"
                                          />
                                          <div>
                                            <div className="font-medium">
                                              {service?.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                              {formatDuration(
                                                service?.duration
                                              )}{" "}
                                              •{" "}
                                              {formatCurrency(
                                                service?.basePrice
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Staff Selection */}
                            {serviceItem.serviceId &&
                              availableStaff.length >= 0 && (
                                <div>
                                  <Label>Nhân viên</Label>
                                  <Select
                                    value={
                                      isFormDataTimeValid()
                                        ? serviceItem.staffId || "none"
                                        : "none"
                                    }
                                    disabled={!isFormDataTimeValid()}
                                    onValueChange={(value) =>
                                      handleStaffToggle(
                                        index,
                                        bookingData?._id || "",
                                        value === "none" ? "" : value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn nhân viên" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[350px] overflow-y-auto">
                                      {availableStaff.length > 0 ? (
                                        availableStaff.map((staff) => (
                                          <SelectItem
                                            className="cursor-pointer"
                                            key={staff._id}
                                            value={staff._id}
                                            style={{
                                              backgroundColor:
                                                serviceItem.staffId ===
                                                staff._id
                                                  ? "lightblue"
                                                  : "transparent",
                                            }}
                                          >
                                            <div className="flex items-center gap-3">
                                              <img
                                                src={staff?.avatar}
                                                alt={staff?.name}
                                                className="w-10 h-6 rounded-lg object-cover"
                                              />
                                              <div>
                                                <div className="font-medium">
                                                  {staff?.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                  ⭐ {staff?.rating}
                                                </div>
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="none">
                                          Không có nhân viên
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>

                                  {/* Staff Availability Message */}
                                  {serviceItem.staffId &&
                                    staffAvailability[index] && (
                                      <div className="mt-2">
                                        {staffAvailability[index].isChecking ? (
                                          <div className="text-sm text-blue-600 flex items-center gap-1">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                            Đang kiểm tra availability...
                                          </div>
                                        ) : (
                                          !staffAvailability[index]
                                            .isAvailable && (
                                            <div className="text-sm text-red-600 flex items-center gap-1">
                                              <AlertCircle className="h-3 w-3" />
                                              {unavailableStaffMessage}
                                            </div>
                                          )
                                        )}
                                        {/* Không hiện gì nếu staff rảnh */}
                                      </div>
                                    )}
                                </div>
                              )}

                            {/* Room Selection */}
                            {serviceItem.serviceId && (
                              <div>
                                <Label>Phòng</Label>
                                <Select
                                  value={
                                    isFormDataTimeValid()
                                      ? serviceItem.roomId || "none"
                                      : "none"
                                  }
                                  disabled={!isFormDataTimeValid()}
                                  onValueChange={(value) =>
                                    handleRoomToggle(
                                      index,
                                      value === "none" ? "" : value
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn phòng" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[350px] overflow-y-auto">
                                    {availableRooms.map((room) => (
                                      <SelectItem
                                        className="cursor-pointer"
                                        key={room._id}
                                        value={room._id}
                                        style={{
                                          backgroundColor:
                                            serviceItem.roomId === room._id
                                              ? "lightblue"
                                              : "transparent",
                                        }}
                                      >
                                        <div className="flex items-center gap-3">
                                          <img
                                            src={room?.image}
                                            alt={room?.name}
                                            className="w-10 h-6 rounded object-cover"
                                          />
                                          <div>
                                            <div className="font-medium">
                                              {room?.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                              {room?.code} • {room?.type}
                                            </div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}

              <Button
                disabled={
                  formData.services.length >= 5 ||
                  formData.startTime === "" ||
                  formData.dateTime === "" ||
                  getAvailableServicesForSlot(formData.services.length)
                    .length === 0 ||
                  (mode === "edit" &&
                    bookingData?.status !== BOOKING_STATUS.PENDING)
                }
                type="button"
                variant="outline"
                onClick={addService}
                className="w-full bg-transparent"
              >
                + Thêm dịch vụ
                {getAvailableServicesForSlot(formData.services.length)
                  .length === 0 &&
                  formData.services.length < 5 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (Đã chọn hết dịch vụ)
                    </span>
                  )}
              </Button>

              {/* Services validation error */}
              <ErrorMessage error={validationErrors.services} />
            </div>
          </div>

          {/* Booking Type */}
          <div className="space-y-3">
            <Label>Loại đặt lịch</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              className="flex gap-6"
              disabled={mode === "edit"}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offline" id="offline" />
                <Label htmlFor="offline">Tại chi nhánh</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="couponCode" className="flex items-center gap-2">
              <DiamondPercent className="h-4 w-4" />
              Mã giảm giá
            </Label>
            <Select
              disabled={mode === "edit"}
              value={formData.couponCode?._id || "none"}
              onValueChange={(value) => {
                if (value === "none") {
                  handleInputChange("couponCode", null);
                } else {
                  const selectedCoupon = coupons.find(
                    (coupon) => coupon._id === value
                  );
                  handleInputChange("couponCode", selectedCoupon || null);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn mã giảm giá (tùy chọn)" />
              </SelectTrigger>
              <SelectContent className="max-h-[350px] overflow-y-auto">
                <SelectItem value="none" className="cursor-pointer">
                  Không sử dụng mã giảm giá
                </SelectItem>
                {coupons.map((coupon) => (
                  <SelectItem
                    disabled={
                      coupon.maxUses <= coupon.usedCount ||
                      coupon.endDate < new Date()
                    }
                    className="cursor-pointer"
                    key={coupon._id}
                    value={coupon._id}
                  >
                    <div className="flex flex-col">
                      <div className="font-medium text-wrap text-left">
                        {coupon.code} - {coupon.name}
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : formatCurrency(coupon.discountValue)}{" "}
                        - Còn {coupon.maxUses - coupon.usedCount} lượt sử dụng
                      </div>
                      <div className="text-xs text-muted-foreground text-wrap text-left">
                        {coupon.applicableToAll
                          ? "Áp dụng cho tất cả dịch vụ"
                          : "Chỉ áp dụng cho: " +
                            (coupon.applicableServices
                              ?.map((service) => service.name)
                              .join(", ") || "Không có dịch vụ áp dụng")}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.couponCode && calculatedData.discountAmount > 0 && (
              <div className="text-sm text-orange-600 flex items-center gap-1">
                Tiết kiệm: {formatCurrency(calculatedData.discountAmount)}
              </div>
            )}
            {formData.couponCode &&
              calculatedData.discountAmount === 0 &&
              formData.services.length > 0 && (
                <div className="text-sm text-red-600 flex items-center gap-1">
                  Mã giảm giá không áp dụng được với các dịch vụ đã chọn
                </div>
              )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ghi chú
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Ghi chú thêm về lịch hẹn..."
              rows={3}
              disabled={
                mode === "edit" &&
                bookingData?.status !== BOOKING_STATUS.PENDING
              }
            />
          </div>

          {/* Price Summary */}
          {formData.services.length > 0 && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" />
                  Tổng kết
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Thời gian dự kiến:</span>
                  <Badge variant="secondary">
                    {formatDuration(calculatedData.totalDuration)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tổng tiền dịch vụ:</span>
                  <span>{formatCurrency(calculatedData.totalPrice)}</span>
                </div>
                {calculatedData.discountAmount >= 0 && (
                  <>
                    <div className="flex justify-between text-orange-600">
                      <span className="flex items-center gap-1">
                        Tổng giảm giá:
                      </span>
                      <span>
                        -{formatCurrency(calculatedData.discountAmount)}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cần thanh toán:</span>
                  <span className="text-primary">
                    {formatCurrency(calculatedData.finalPrice)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={
                formData.services.length === 0 ||
                !formData.services.some(
                  (s) =>
                    s.serviceId &&
                    s.serviceId !== "default" &&
                    s.staffId &&
                    s.staffId !== "none" &&
                    s.roomId &&
                    s.roomId !== "none"
                ) ||
                !isFormDataServicesValid() ||
                formData.startTime === "" ||
                formData.dateTime === "" ||
                formData.customerName === "" ||
                formData.customerPhone === "" ||
                formData.customerEmail === "" ||
                formData.dateTime < new Date() ||
                checkCouponApplicable(formData.couponCode) ||
                (mode === "edit" &&
                  (bookingData?.status !== BOOKING_STATUS.PENDING && bookingData?.status !== BOOKING_STATUS.CONFIRMED)) ||
                unavailableStaffMessage !== ""
              }
            >
              {mode === "edit" ? "Cập nhật lịch" : "Đặt lịch ngay"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
