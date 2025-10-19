import { useState, useRef, useEffect } from "react"
import { X, Send, Headphones, Clock, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Helper function to remove diacritics (Vietnamese accents)
function removeDiacritics(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
}

// Helper function to format opening hours
function formatOpeningHours(openingHours) {
  if (!openingHours) return "Giờ mở cửa: Không xác định"

  if (typeof openingHours === "string") {
    return `Giờ mở cửa: ${openingHours}`
  }

  if (typeof openingHours === "object") {
    const days = Object.keys(openingHours)
    if (days.length === 0) return "Giờ mở cửa: Không xác định"

    const getHoursString = (dayEntry) => {
      if (typeof dayEntry === "string") {
        return dayEntry
      }
      if (dayEntry && dayEntry.start && dayEntry.end) {
        return `${dayEntry.start}-${dayEntry.end}`
      }
      return ""
    }

    const firstDayHoursString = getHoursString(openingHours[days[0]])
    const allSame = days.every((day) => getHoursString(openingHours[day]) === firstDayHoursString)

    if (allSame && firstDayHoursString) {
      return `Giờ mở cửa: Hàng ngày ${firstDayHoursString}`
    } else {
      const dayNameMap = {
        monday: "Thứ Hai",
        tuesday: "Thứ Ba",
        wednesday: "Thứ Tư",
        thursday: "Thứ Năm",
        friday: "Thứ Sáu",
        saturday: "Thứ Bảy",
        sunday: "Chủ Nhật",
        "mon-fri": "Thứ Hai - Thứ Sáu",
        "mon-sat": "Thứ Hai - Thứ Bảy",
        "mon-sun": "Hàng ngày",
      }

      const formattedHours = days
        .map((dayKey) => {
          const hours = getHoursString(openingHours[dayKey])
          const displayDayName = dayNameMap[dayKey.toLowerCase()] || dayKey
          return hours ? `${displayDayName}: ${hours}` : ""
        })
        .filter(Boolean)
        .join("; ")
      return formattedHours ? `Giờ mở cửa: ${formattedHours}` : "Giờ mở cửa: Không xác định"
    }
  }
  return "Giờ mở cửa: Không xác định"
}

// Raw spa data provided by the user
const rawSpaData = [
  {
    _id: { $oid: "665000000000000000000008" },
    name: "Spa Tân Bình",
    address: "200 Cộng Hòa",
    city: "Hồ Chí Minh",
    district: "Tân Bình",
    ward: "Phường 13",
    location: { type: "Point", coordinates: [106.65109, 10.80129] },
    phone: "0922123456",
    opening_hours: { "mon-sun": "08:00-21:00" },
    services: [],
  },
  {
    _id: { $oid: "665000000000000000000010" },
    name: "Spa Phú Nhuận",
    address: "37 Phan Đăng Lưu",
    city: "Hồ Chí Minh",
    district: "Phú Nhuận",
    ward: "Phường 3",
    location: null,
    phone: "0945123456",
    opening_hours: {
      monday: { start: "08:00", end: "20:00" },
      tuesday: { start: "08:00", end: "20:00" },
      wednesday: { start: "08:00", end: "20:00" },
      thursday: { start: "08:00", end: "20:00" },
      friday: { start: "08:00", end: "22:00" },
      saturday: { start: "09:00", end: "21:00" },
      sunday: { start: "09:00", end: "21:00" },
    },
    services: [],
    updatedAt: { $date: "2025-06-25T04:30:34.225Z" },
  },
  {
    _id: { $oid: "665000000000000000000001" },
    name: "Spa Quận 1",
    address: "123 Lê Lợi",
    city: "Bình Thuận",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    location: { type: "Point", coordinates: [106.70098, 10.77689] },
    phone: "0984736363",
    opening_hours: {
      monday: { start: "08:00", end: "20:30" },
      tuesday: { start: "08:00", end: "20:30" },
      wednesday: { start: "08:00", end: "20:30" },
      thursday: { start: "08:00", end: "20:30" },
      friday: { start: "08:00", end: "20:30" },
      saturday: { start: "08:00", end: "20:30" },
      sunday: { start: "08:00", end: "20:30" },
    },
    services: [
      { $oid: "64f7d8d58c1a4e0012345672" },
      { $oid: "64f7d8d58c1a4e0012345677" },
      { $oid: "682d97ffc5ad8aabc97a9f3c" },
      { $oid: "68615b7fb3c2dcef59c798e9" },
    ],
    isActive: true,
    updatedAt: { $date: "2025-07-02T10:17:44.012Z" },
    images: ["https://res.cloudinary.com/dgqkmqkdz/image/upload/v1751451463/WDP_SpaBooking/ir1tj7l8nndmf387zjqc.jpg"],
  },
  {
    _id: { $oid: "665000000000000000000004" },
    name: "Spa Quận 7",
    address: "321 Nguyễn Thị Thập",
    city: "Hồ Chí Minh",
    district: "Quận 7",
    ward: "Phường Tân Phong",
    location: { type: "Point", coordinates: [106.72145, 10.73291] },
    phone: "0933344556",
    opening_hours: { "mon-fri": "10:00-21:00", "sat-sun": "10:00-22:00" },
    services: [],
    isActive: true,
    updatedAt: { $date: "2025-06-28T09:41:04.187Z" },
  },
  {
    _id: { $oid: "665000000000000000000005" },
    name: "Spa Gò Vấp",
    address: "111 Quang Trung",
    city: "Hồ Chí Minh",
    district: "Gò Vấp",
    ward: "Phường 10",
    location: { type: "Point", coordinates: [106.66435, 10.8321] },
    phone: "0977987654",
    opening_hours: { "mon-sun": "08:00-20:00" },
    services: [],
    isActive: true,
    updatedAt: { $date: "2025-06-28T09:41:06.690Z" },
  },
  {
    _id: { $oid: "665000000000000000000009" },
    name: "Spa Quận 10",
    address: "15 Ba Tháng Hai",
    city: "Hồ Chí Minh",
    district: "Quận 10",
    ward: "Phường 12",
    location: { type: "Point", coordinates: [106.66752, 10.77222] },
    phone: "0938765432",
    opening_hours: { "mon-sat": "09:00-22:00" },
    services: [],
  },
  {
    _id: { $oid: "665000000000000000000003" },
    name: "Spa Quận 5",
    address: "789 Trần Hưng Đạo",
    city: "Hồ Chí Minh",
    district: "Quận 5",
    ward: "Phường 1",
    location: { type: "Point", coordinates: [106.67021, 10.75432] },
    phone: "0987123456",
    opening_hours: { "mon-sun": "09:00-22:00" },
    services: [],
    isActive: true,
    updatedAt: { $date: "2025-06-28T09:41:01.574Z" },
  },
  {
    _id: { $oid: "665000000000000000000007" },
    name: "Spa Bình Thạnh",
    address: "55 Điện Biên Phủ",
    city: "Hồ Chí Minh",
    district: "Bình Thạnh",
    ward: "Phường 15",
    location: { type: "Point", coordinates: [106.70932, 10.80011] },
    phone: "0911222333",
    opening_hours: { "mon-fri": "08:30-20:30" },
    services: [],
  },
  {
    _id: { $oid: "665000000000000000000002" },
    name: "Spa Quận 3",
    address: "456 Nguyễn Đình Chiểu",
    city: "Hồ Chí Minh",
    district: "Quận 3",
    ward: "Phường 6",
    location: { type: "Point", coordinates: [106.68572, 10.77978] },
    phone: "0912345678",
    opening_hours: { "mon-sat": "08:30-21:30", sun: "09:00-20:00" },
    services: [],
    isActive: true,
    updatedAt: { $date: "2025-06-28T09:40:58.883Z" },
  },
  {
    _id: { $oid: "665000000000000000000006" },
    name: "Spa Thủ Đức",
    address: "99 Võ Văn Ngân",
    city: "Hồ Chí Minh",
    district: "Thủ Đức",
    ward: "Linh Chiểu",
    location: { type: "Point", coordinates: [106.76952, 10.85032] },
    phone: "0903009876",
    opening_hours: { "mon-sat": "09:00-21:00" },
    services: [],
  },
  {
    _id: { $oid: "66501a1f1a1a1a1a1a1a1a11" },
    name: "Beauty Spa Hòa Lạc",
    address: "Bắc phú cát",
    city: "Hà Nội",
    district: "Thạch Hòa",
    ward: "Thạch Thất",
    location: { type: "Point", coordinates: [105.5319713, 20.9862006] },
    phone: "0987654321",
    images: [
      "https://res.cloudinary.com/dgqkmqkdz/image/upload/v1751439165/WDP_SpaBooking/xt0mewrsfloih8dcf5gy.jpg",
      "https://res.cloudinary.com/dgqkmqkdz/image/upload/v1751439165/WDP_SpaBooking/rrhefvnxxv8v7bhhuym3.webp",
      "https://res.cloudinary.com/dgqkmqkdz/image/upload/v1751439165/WDP_SpaBooking/fwsaa6swtf1pbilm5ifs.jpg",
    ],
    opening_hours: {
      monday: { start: "08:00", end: "20:00" },
      tuesday: { start: "08:00", end: "20:00" },
      wednesday: { start: "08:00", end: "20:00" },
      thursday: { start: "08:00", end: "20:00" },
      friday: { start: "08:00", end: "20:00" },
      saturday: { start: "08:00", end: "20:00" },
      sunday: { start: "08:00", end: "20:00" },
    },
    services: [
      { $oid: "682c577ac3637473f83744b8" },
      { $oid: "64f7d8d58c1a4e0012345672" },
      { $oid: "64f7d8d58c1a4e0012345677" },
      { $oid: "682d97ffc5ad8aabc97a9f3c" },
      { $oid: "64f7d8d58c1a4e0012345676" },
      { $oid: "64f7d8d58c1a4e0012345678" },
      { $oid: "64f7d8d58c1a4e0012345671" },
    ],
    updatedAt: { $date: "2025-07-07T06:16:26.898Z" },
    isActive: true,
    rooms: [
      { $oid: "670000000000000000000003" },
      { $oid: "670000000000000000000007" },
      { $oid: "670000000000000000000008" },
      { $oid: "67000000000000000000000a" },
      { $oid: "670000000000000000000002" },
      { $oid: "670000000000000000000009" },
      { $oid: "67000000000000000000000c" },
    ],
  },
  {
    _id: { $oid: "66501a1f1a1a1a1a1a1a1a12" },
    name: "Hiền Spa",
    address: "Bắc phú cát",
    city: "Hà Nội",
    district: "Thạch Hòa",
    ward: "Thạch Thất",
    location: { type: "Point", coordinates: [105.5385, 20.993] },
    phone: "0912345678",
    images: ["https://picsum.photos/200/300?random=2"],
    opening_hours: {
      monday: "09:00 - 20:00",
      tuesday: "09:00 - 20:00",
      wednesday: "09:00 - 20:00",
      thursday: "09:00 - 20:00",
      friday: "09:00 - 20:00",
      saturday: "08:00 - 22:00",
      sunday: "08:00 - 22:00",
    },
    services: [],
  },
  {
    _id: { $oid: "66501a1f1a1a1a1a1a1a1a13" },
    name: "HaeiSpa Nguyễn Xiển",
    address: "Số 5 Nguyễn Xiển, Thanh Xuân",
    city: "Hà Nội",
    district: "Thanh Xuân",
    ward: "Hạ Đình",
    location: { type: "Point", coordinates: [105.554, 20.9945] },
    phone: "0909090909",
    images: ["https://picsum.photos/200/300?random=3"],
    opening_hours: {
      monday: "09:00 - 21:00",
      tuesday: "09:00 - 21:00",
      wednesday: "09:00 - 21:00",
      thursday: "09:00 - 21:00",
      friday: "09:00 - 21:00",
      saturday: "09:00 - 23:00",
      sunday: "09:00 - 23:00",
    },
    services: [],
    isActive: true,
    updatedAt: { $date: "2025-07-06T09:43:40.108Z" },
  },
  {
    _id: { $oid: "686551e385dbef6372322616" },
    name: "Spa Test cho Hai",
    address: "Bắc Phú Cát",
    city: "Hà Nội",
    district: "Thạch Thất",
    ward: "Thạch Hoà",
    location: { type: "Point", coordinates: [105.5709519, 20.9891643] },
    services: [
      { $oid: "64f7d8d58c1a4e0012345677" },
      { $oid: "64f7d8d58c1a4e0012345673" },
      { $oid: "64f7d8d58c1a4e0012345678" },
      { $oid: "64f7d8d58c1a4e0012345676" },
      { $oid: "64f7d8d58c1a4e0012345671" },
      { $oid: "68503c58d783013b861319ad" },
    ],
    phone: "0936363727",
    images: [
      "https://res.cloudinary.com/dgqkmqkdz/image/upload/v1751470563/WDP_SpaBooking/ussybs5vqh5zw2ymful2.jpg",
      "https://res.cloudinary.com/dgqkmqkdz/image/upload/v1751470563/WDP_SpaBooking/gz6sxmlfrzh57bniu4jy.webp",
    ],
    opening_hours: {
      monday: { start: "08:30", end: "20:00" },
      tuesday: { start: "08:30", end: "20:00" },
      wednesday: { start: "08:30", end: "20:00" },
      thursday: { start: "08:30", end: "20:00" },
      friday: { start: "08:30", end: "20:00" },
      saturday: { start: "08:30", end: "20:00" },
      sunday: { start: "08:30", end: "20:00" },
    },
    isActive: true,
    createdAt: { $date: "2025-07-02T15:36:03.819Z" },
    updatedAt: { $date: "2025-07-02T15:36:03.819Z" },
    __v: 0,
  },
  {
    _id: { $oid: "6865dcfa441e058006fcffd5" },
    name: "Heai Spa Hòa Lạc",
    address: "Thôn 4 ",
    city: "Hà Nội",
    district: "Thạch Thất",
    ward: "Thạch Hoà",
    location: { type: "Point", coordinates: [105.82031250000001, 21.020418764184075] },
    services: [
      { $oid: "682c577ac3637473f83744b8" },
      { $oid: "64f7d8d58c1a4e0012345672" },
      { $oid: "64f7d8d58c1a4e0012345678" },
      { $oid: "6845c31ba484f526efeb16a8" },
    ],
    phone: "0956586758",
    images: ["https://res.cloudinary.com/dgqkmqkdz/image/upload/v1751506170/WDP_SpaBooking/zjvoepqmgmsrdfzb7yxh.png"],
    opening_hours: {
      monday: { start: "08:30", end: "20:30" },
      tuesday: { start: "08:30", end: "20:30" },
      wednesday: { start: "08:30", end: "20:30" },
      thursday: { start: "08:30", end: "20:30" },
      friday: { start: "08:30", end: "20:30" },
      saturday: { start: "08:30", end: "20:30" },
      sunday: { start: "08:30", end: "20:30" },
    },
    isActive: true,
    createdAt: { $date: "2025-07-03T01:29:31.006Z" },
    updatedAt: { $date: "2025-07-08T04:19:16.577Z" },
    __v: 0,
    rooms: [
      { $oid: "67000000000000000000000b" },
      { $oid: "683c1c7ca57beb5f515b9432" },
      { $oid: "670000000000000000000001" },
      { $oid: "670000000000000000000002" },
      { $oid: "67000000000000000000000d" },
      { $oid: "67000000000000000000000e" },
    ],
  },
  {
    _id: { $oid: "6869ee76e5f7c522d091ddf0" },
    name: "Ninh giang haeispa",
    address: "thôn 3",
    city: "Hà Nội",
    district: "Thạch Thất",
    ward: "Thạch Hoà",
    location: { type: "Point", coordinates: [106.387471, 20.73676] },
    services: [
      { $oid: "64f7d8d58c1a4e0012345677" },
      { $oid: "682c577ac3637473f83744b8" },
      { $oid: "682d97ffc5ad8aabc97a9f3c" },
      { $oid: "64f7d8d58c1a4e0012345678" },
    ],
    rooms: [
      { $oid: "670000000000000000000003" },
      { $oid: "670000000000000000000008" },
      { $oid: "670000000000000000000009" },
      { $oid: "67000000000000000000000d" },
      { $oid: "67000000000000000000000f" },
      { $oid: "684f8d1a27a00dc4ad0db031" },
    ],
    phone: "0987654456",
    images: ["https://res.cloudinary.com/dgqkmqkdz/image/upload/v1751772789/WDP_SpaBooking/rfutaovqujloqvs5dk2x.jpg"],
    opening_hours: {
      monday: { start: "08:00", end: "20:00" },
      tuesday: { start: "08:00", end: "20:00" },
      wednesday: { start: "08:00", end: "20:00" },
      thursday: { start: "08:00", end: "20:00" },
      friday: { start: "08:00", end: "20:00" },
      saturday: { start: "08:00", end: "20:00" },
      sunday: { start: "08:00", end: "20:00" },
    },
    isActive: true,
    createdAt: { $date: "2025-07-06T03:33:10.769Z" },
    updatedAt: { $date: "2025-07-06T03:33:10.769Z" },
    __v: 0,
  },
  {
    _id: { $oid: "686d39173a7c0cddf81264dc" },
    name: "test spa",
    address: "286",
    city: "Hà Nội",
    district: "Hoàng Mai",
    ward: "Định Công",
    location: { type: "Point", coordinates: [105.849816, 20.9816822] },
    services: [{ $oid: "64f7d8d58c1a4e0012345673" }, { $oid: "64f7d8d58c1a4e0012345677" }],
    rooms: [
      { $oid: "670000000000000000000007" },
      { $oid: "67000000000000000000000d" },
      { $oid: "670000000000000000000008" },
      { $oid: "67000000000000000000000e" },
    ],
    phone: "0987878654",
    images: ["https://res.cloudinary.com/dgqkmqkdz/image/upload/v1751988502/WDP_SpaBooking/ww1jojstcbjt008wsw1p.webp"],
    opening_hours: {
      monday: { start: "09:00", end: "19:30" },
      tuesday: { start: "09:00", end: "19:30" },
      wednesday: { start: "09:00", end: "19:30" },
      thursday: { start: "09:00", end: "19:30" },
      friday: { start: "09:00", end: "19:30" },
      saturday: { start: "09:00", end: "19:30" },
      sunday: { start: "09:00", end: "19:30" },
    },
    isActive: true,
    createdAt: { $date: "2025-07-08T15:28:23.119Z" },
    updatedAt: { $date: "2025-07-08T15:29:26.750Z" },
    __v: 0,
  },
  {
    _id: { $oid: "686e794167faa842b5b9d115" },
    name: "hải đẹp trai",
    address: "286",
    city: "Hà Nội",
    district: "Hoàng Mai",
    ward: "Định Công",
    location: { type: "Point", coordinates: [105.8085208, 20.9832736] },
    services: [
      { $oid: "64f7d8d58c1a4e0012345678" },
      { $oid: "64f7d8d58c1a4e0012345672" },
      { $oid: "64f7d8d58c1a4e0012345673" },
    ],
    rooms: [
      { $oid: "670000000000000000000007" },
      { $oid: "670000000000000000000008" },
      { $oid: "67000000000000000000000a" },
      { $oid: "67000000000000000000000d" },
      { $oid: "67000000000000000000000c" },
      { $oid: "67000000000000000000000e" },
      { $oid: "67000000000000000000000f" },
      { $oid: "684f8d1a27a00dc4ad0db031" },
      { $oid: "68655a166c5e183fac1c3221" },
    ],
    phone: "0331231231",
    images: ["https://res.cloudinary.com/dgqkmqkdz/image/upload/v1752070464/WDP_SpaBooking/e3yzuyiclfao0vixzsld.png"],
    opening_hours: {
      monday: { start: "07:00", end: "22:30" },
      tuesday: { start: "07:00", end: "22:30" },
      wednesday: { start: "07:00", end: "22:30" },
      thursday: { start: "07:00", end: "22:30" },
      friday: { start: "07:00", end: "22:30" },
      saturday: { start: "07:00", end: "22:30" },
      sunday: { start: "07:00", end: "22:30" },
    },
    isActive: true,
    createdAt: { $date: "2025-07-09T14:14:25.655Z" },
    updatedAt: { $date: "2025-07-09T14:14:25.655Z" },
    __v: 0,
  },
]

// Transformed spa data
const spaData = rawSpaData.map((spa) => {
  const name = spa.name || ""
  const address = spa.address || ""
  const ward = spa.ward || ""
  const district = spa.district || ""
  const city = spa.city || ""
  const phone = spa.phone || ""
  const openingHours = spa.opening_hours

  // Generate search keywords
  const rawKeywords = [name, address, ward, district, city].filter(Boolean)
  const processedKeywords = rawKeywords.flatMap((s) => {
    const lower = s.toLowerCase()
    const noDiacritics = removeDiacritics(lower)
    return [lower, noDiacritics, ...lower.split(/\s+/), ...noDiacritics.split(/\s+/)]
  })
  const uniqueKeywords = [...new Set(processedKeywords)].filter(Boolean)
  const searchKeywords = uniqueKeywords

  // Construct info string
  const infoParts = []
  if (name) infoParts.push(`${name}`)
  if (address) infoParts.push(`Địa chỉ: ${address}`)
  if (ward) infoParts.push(`${ward}`)
  if (district) infoParts.push(`${district}`)
  if (city) infoParts.push(`${city}`)
  if (phone) infoParts.push(`Hotline: ${phone}`)

  const formattedHours = formatOpeningHours(openingHours)
  if (formattedHours && formattedHours !== "Giờ mở cửa: Không xác định") infoParts.push(formattedHours)

  const info = infoParts.join(". ")

  return {
    name: name,
    searchKeywords: searchKeywords,
    info: info,
  }
})

// Define the predefined questions and answers
const predefinedQuestions = [
  // Quick Replies
  {
    keywords: ["tôi muốn đặt lịch", "đặt lịch"],
    answer:
      "Bạn muốn đặt lịch tại spa nào và vào thời gian nào? Vui lòng cung cấp thêm thông tin để tôi hỗ trợ bạn nhé.",
  },
  {
    keywords: ["hỏi về dịch vụ", "dịch vụ"],
    answer:
      "Bạn quan tâm đến dịch vụ cụ thể nào? Chúng tôi có đa dạng các dịch vụ chăm sóc da mặt, body, massage, và liệu trình chuyên sâu.",
  },
  {
    keywords: ["thông tin chi nhánh", "chi nhánh"],
    answer: "Bạn muốn biết thông tin chi nhánh nào? Vui lòng cho tôi biết tên spa hoặc khu vực bạn muốn tìm.",
  },
  {
    keywords: ["khuyến mãi hiện tại", "khuyến mãi", "ưu đãi"],
    answer:
      "Hiện tại, chúng tôi đang có một số chương trình khuyến mãi hấp dẫn. Bạn có thể truy cập website hoặc hỏi thêm về chương trình cụ thể để biết chi tiết nhé!",
  },
  {
    keywords: ["danh sách spa", "các spa có sẵn", "list spa", "những spa nào"],
    answer: `Hiện tại chúng tôi có các spa sau:\n\n${spaData.map((s) => `- ${s.info}`).join("\n\n\n\n")}.`,
  },
  // 1. Câu hỏi về loại da & chẩn đoán
  {
    keywords: ["loại da của tôi thuộc loại gì", "da tôi loại gì", "loại da", "da của tôi thuộc loại gì"],
    answer:
      "Để xác định loại da chính xác, bạn có thể quan sát các dấu hiệu như độ bóng dầu, cảm giác căng khô, hoặc mức độ nhạy cảm. Cách tốt nhất là đến spa để được chuyên gia phân tích da bằng thiết bị chuyên dụng.",
  },
  {
    keywords: ["biết da mình là da dầu hay da khô", "da dầu hay da khô", "làm sao biết da mình là da dầu hay da khô"],
    answer:
      "Da dầu thường có lỗ chân lông to, bóng nhờn, dễ nổi mụn. Da khô thì căng, thô ráp, ít khi nổi mụn. Bạn có thể dùng giấy thấm dầu hoặc quan sát da sau khi rửa mặt 30 phút để nhận biết.",
  },
  {
    keywords: ["kiểm tra loại da tại nhà", "có cách nào để kiểm tra loại da tại nhà không"],
    answer:
      "Bạn có thể rửa mặt sạch, đợi 30 phút rồi quan sát: nếu da bóng dầu khắp mặt là da dầu; nếu căng, khô là da khô; nếu chỉ bóng ở vùng chữ T là da hỗn hợp; nếu không có dấu hiệu rõ rệt là da thường.",
  },
  {
    keywords: ["da tôi vừa khô vừa nhạy cảm", "chăm sóc da nhạy cảm", "da tôi vừa khô vừa nhạy cảm, chăm sóc thế nào"],
    answer:
      "Với da khô và nhạy cảm, bạn nên ưu tiên các sản phẩm dịu nhẹ, không chứa cồn, hương liệu. Tập trung cấp ẩm sâu và phục hồi hàng rào bảo vệ da. Tránh chà xát mạnh và tiếp xúc với các yếu tố gây kích ứng.",
  },
  {
    keywords: ["tôi bị đổ dầu nhiều ở vùng chữ T", "đổ dầu nhiều ở vùng chữ T", "da vùng chữ T"],
    answer:
      "Đổ dầu nhiều ở vùng chữ T (trán, mũi, cằm) là đặc điểm phổ hình của da hỗn hợp. Vùng này có tuyến bã nhờn hoạt động mạnh hơn. Bạn nên dùng sản phẩm kiềm dầu cho vùng chữ T và dưỡng ẩm cho các vùng còn lại.",
  },
  // 2. Câu hỏi về chăm sóc da cơ bản
  {
    keywords: ["quy trình skincare cơ bản gồm những bước nào", "quy trình skincare cơ bản", "các bước skincare"],
    answer:
      "Quy trình skincare cơ bản gồm 3 bước chính: Làm sạch (tẩy trang, sữa rửa mặt), Dưỡng ẩm, và Chống nắng (ban ngày). Bạn nên thực hiện đều đặn mỗi ngày.",
  },
  {
    keywords: ["tôi mới bắt đầu chăm sóc da thì nên dùng gì trước", "mới bắt đầu chăm sóc da", "dùng gì trước"],
    answer:
      "Khi mới bắt đầu, bạn nên tập trung vào các sản phẩm cơ bản như sữa rửa mặt dịu nhẹ, kem dưỡng ẩm và kem chống nắng. Sau đó, có thể thêm serum hoặc các sản phẩm đặc trị khác.",
  },
  {
    keywords: ["dưỡng ẩm có thật sự cần thiết không", "dưỡng ẩm có cần thiết không", "dưỡng ẩm cần thiết"],
    answer:
      "Dưỡng ẩm cực kỳ cần thiết cho mọi loại da, kể cả da dầu. Dưỡng ẩm giúp duy trì hàng rào bảo vệ da, ngăn ngừa mất nước và giữ da mềm mại, khỏe mạnh.",
  },
  {
    keywords: ["da dầu có cần dùng kem dưỡng ẩm không", "da dầu dùng kem dưỡng ẩm"],
    answer:
      "Có, da dầu vẫn cần dùng kem dưỡng ẩm. Việc thiếu ẩm có thể khiến da tiết dầu nhiều hơn để bù đắp. Hãy chọn kem dưỡng ẩm dạng gel, lỏng, không gây bít tắc lỗ chân lông.",
  },
  {
    keywords: [
      "tẩy tế bào chết bao nhiêu lần một tuần là tốt",
      "tẩy tế bào chết bao nhiêu lần",
      "tẩy tế bào chết tần suất",
    ],
    answer:
      "Tẩy tế bào chết 1-2 lần mỗi tuần là tần suất lý tưởng cho hầu hết các loại da. Da nhạy cảm có thể ít hơn, khoảng 1 lần/tuần hoặc 2 tuần/lần.",
  },
  // 3. Câu hỏi về chống nắng
  {
    keywords: ["dùng kem chống nắng như thế nào là đúng", "cách dùng kem chống nắng"],
    answer:
      "Bạn nên thoa kem chống nắng đủ lượng (khoảng 2 đốt ngón tay cho mặt và cổ), thoa trước khi ra ngoài 15-20 phút. Đảm bảo thoa đều khắp các vùng da tiếp xúc với ánh nắng.",
  },
  {
    keywords: ["da nhạy cảm nên dùng loại chống nắng nào", "chống nắng cho da nhạy cảm"],
    answer:
      "Da nhạy cảm nên chọn kem chống nắng vật lý (chứa Zinc Oxide, Titanium Dioxide) hoặc các sản phẩm có nhãn 'for sensitive skin', 'non-comedogenic', không chứa hương liệu, cồn.",
  },
  {
    keywords: [
      "tôi nên thoa lại kem chống nắng sau bao lâu",
      "thoa lại kem chống nắng sau bao lâu",
      "thoa lại chống nắng",
    ],
    answer:
      "Bạn nên thoa lại kem chống nắng sau mỗi 2-3 giờ nếu hoạt động ngoài trời, đổ mồ hôi nhiều hoặc bơi lội. Nếu ở trong nhà, có thể thoa lại sau 4-6 giờ hoặc không cần nếu không tiếp xúc trực tiếp với ánh nắng.",
  },
  {
    keywords: ["có cần chống nắng khi ở trong nhà không", "chống nắng trong nhà"],
    answer:
      "Có, bạn vẫn nên chống nắng khi ở trong nhà, đặc biệt nếu ngồi gần cửa sổ hoặc sử dụng các thiết bị điện tử phát ra ánh sáng xanh. Tia UVA có thể xuyên qua cửa kính và gây hại cho da.",
  },
  // 4. Câu hỏi về vấn đề da cụ thể
  {
    keywords: ["mụn ẩn", "mụn viêm", "mụn đầu đen", "chăm sóc mụn", "da bị mụn"],
    answer:
      "Với mụn ẩn/viêm/đầu đen, bạn nên tập trung làm sạch sâu, sử dụng các sản phẩm chứa BHA, AHA hoặc Retinoids (tùy tình trạng). Tránh tự ý nặn mụn và tham khảo ý kiến chuyên gia.",
  },
  {
    keywords: ["trị thâm mụn hiệu quả", "cách trị thâm mụn"],
    answer:
      "Để trị thâm mụn hiệu quả, bạn có thể dùng các sản phẩm chứa Vitamin C, Niacinamide, Alpha Arbutin hoặc AHA. Kết hợp chống nắng kỹ lưỡng để ngăn thâm sạm thêm.",
  },
  {
    keywords: ["da bị sạm", "làm sáng da"],
    answer:
      "Để làm sáng da sạm, bạn có thể dùng các sản phẩm chứa Vitamin C, Niacinamide, Arbutin, hoặc các liệu trình làm sáng da chuyên sâu tại spa như peel da, điện di vitamin C.",
  },
  {
    keywords: ["lỗ chân lông to", "sản phẩm cho lỗ chân lông to"],
    answer:
      "Lỗ chân lông to thường do da dầu hoặc lão hóa. Bạn có thể dùng sản phẩm chứa BHA để làm sạch sâu, Retinoids để cải thiện cấu trúc da, và giữ ẩm tốt để da không tiết dầu quá mức.",
  },
  {
    keywords: ["da tôi cứ bị bong tróc dù đã dưỡng ẩm", "da bị bong tróc dù đã dưỡng ẩm", "da bong tróc"],
    answer:
      "Da bong tróc dù đã dưỡng ẩm có thể do thiếu nước trầm trọng, hàng rào bảo vệ da bị tổn thương, hoặc do thời tiết khô hanh. Bạn nên tăng cường cấp ẩm, dùng sản phẩm phục hồi da và uống đủ nước.",
  },
  // 5. Câu hỏi về sản phẩm chăm sóc da
  {
    keywords: ["dùng serum hay kem trước", "thứ tự dùng serum kem"],
    answer:
      "Quy tắc chung là dùng sản phẩm có kết cấu lỏng trước, đặc sau. Vì vậy, bạn nên dùng serum trước rồi mới đến kem dưỡng.",
  },
  {
    keywords: ["dùng retinol vào lúc nào", "thời điểm dùng retinol"],
    answer:
      "Retinol nên được dùng vào buổi tối, sau bước làm sạch và toner. Bắt đầu với tần suất thấp (2-3 lần/tuần) rồi tăng dần để da làm quen.",
  },
  {
    keywords: ["da nhạy cảm có dùng được vitamin C", "vitamin C cho da nhạy cảm"],
    answer:
      "Da nhạy cảm vẫn có thể dùng Vitamin C, nhưng nên chọn nồng độ thấp (dưới 10%) và dạng ổn định hơn như Ascorbyl Glucoside hoặc Magnesium Ascorbyl Phosphate để tránh kích ứng.",
  },
  {
    keywords: ["Niacinamide với BHA chung", "dùng Niacinamide BHA"],
    answer:
      "Niacinamide và BHA có thể dùng chung, nhưng nên dùng cách ngày hoặc dùng Niacinamide vào buổi sáng và BHA vào buổi tối để giảm thiểu khả năng kích ứng.",
  },
  {
    keywords: ["sữa rửa mặt nào cho da dầu", "sữa rửa mặt da dầu"],
    answer:
      "Đối với da dầu, bạn nên chọn sữa rửa mặt dạng gel hoặc tạo bọt nhẹ, có khả năng làm sạch sâu nhưng không gây khô căng da. Tìm các sản phẩm có nhãn 'oil-control' hoặc 'for oily skin'.",
  },
  // 6. Câu hỏi về điều trị chuyên sâu tại spa
  {
    keywords: ["spa có dịch vụ điều trị mụn", "dịch vụ trị mụn spa"],
    answer:
      "Có, SpaConnect có nhiều dịch vụ điều trị mụn chuyên sâu, từ lấy nhân mụn chuẩn y khoa đến các liệu trình giảm viêm, phục hồi da sau mụn. Bạn có thể tham khảo chi tiết trên website hoặc liên hệ để được tư vấn.",
  },
  {
    keywords: ["liệu trình nào giúp da tôi sáng lên", "làm sáng da tại spa"],
    answer:
      "Chúng tôi có các liệu trình làm sáng da hiệu quả như peel da sinh học, điện di Vitamin C, hoặc liệu trình ánh sáng sinh học giúp cải thiện sắc tố da, làm đều màu và rạng rỡ hơn.",
  },
  {
    keywords: ["bao lâu thì nên làm facial một lần", "tần suất làm facial"],
    answer:
      "Tần suất làm facial lý tưởng là khoảng 1 lần mỗi tháng (4-6 tuần/lần) để duy trì làn da sạch, khỏe và hấp thụ dưỡng chất tốt nhất.",
  },
  {
    keywords: ["công nghệ nào giúp trẻ hoá làn da hiệu quả nhất", "trẻ hoá da hiệu quả"],
    answer:
      "Để trẻ hóa làn da, SpaConnect cung cấp các công nghệ tiên tiến như HIFU, RF (Radio Frequency), hoặc liệu trình cấy collagen, giúp nâng cơ, giảm nếp nhăn và tăng độ đàn hồi cho da.",
  },
  {
    keywords: ["liệu trình phục hồi da sau nặn mụn", "phục hồi da sau mụn spa"],
    answer:
      "SpaConnect có liệu trình phục hồi da chuyên biệt sau nặn mụn, giúp làm dịu da, giảm sưng đỏ, ngăn ngừa thâm sẹo và đẩy nhanh quá trình lành thương.",
  },
  // 7. Câu hỏi về AI/phân tích da
  {
    keywords: ["AI của bạn phân tích da bằng cách nào", "AI phân tích da bằng cách nào"],
    answer:
      "AI của chúng tôi phân tích da dựa trên hình ảnh da mặt của bạn, sử dụng công nghệ thị giác máy tính để nhận diện các vấn đề như mụn, thâm, nếp nhăn, lỗ chân lông, độ ẩm, và sắc tố da.",
  },
  {
    keywords: ["quét da mặt để biết tình trạng da", "quét da mặt"],
    answer:
      "Có, bạn hoàn toàn có thể quét da mặt thông qua ứng dụng hoặc thiết bị chuyên dụng tại spa để nhận được báo cáo chi tiết về tình trạng da hiện tại của mình.",
  },
  {
    keywords: ["công nghệ AI sẽ gợi ý sản phẩm thế nào", "AI gợi ý sản phẩm"],
    answer:
      "Công nghệ AI sẽ dựa trên kết quả phân tích da của bạn để gợi ý các sản phẩm phù hợp nhất, từ sữa rửa mặt, serum đến kem dưỡng, đảm bảo hiệu quả tối ưu cho từng vấn đề da cụ thể.",
  },
  {
    keywords: ["cá nhân hóa quy trình skincare theo da tôi", "quy trình skincare theo da"],
    answer:
      "Chắc chắn rồi! Dựa trên phân tích AI, chúng tôi có thể cá nhân hóa một quy trình skincare độc quyền dành riêng cho bạn, từ các bước chăm sóc hàng ngày đến các liệu trình chuyên sâu tại spa.",
  },
]

export default function ChatSupport({
  isOpen,
  onClose,
  customerName,
  bookingInfo,
  position = "bottom-right",
  size = "medium",
  showAsPopup = true,
  className = "",
}) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: `Xin chào ${customerName || "bạn"}! 👋 Cảm ơn bạn đã quan tâm đến ${bookingInfo?.branch?.name || "SpaConnect"}. Tôi có thể hỗ trợ gì cho bạn? Hiện tại chúng tôi có các spa: ${spaData.map((s) => s.name).join(", ")}.`,
      sender: "support",
      timestamp: new Date(),
      status: "delivered",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [supportStatus, setSupportStatus] = useState("online")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Helper function to process user message and determine support response
  const processAndRespond = (messageText) => {
    const normalizedMessage = messageText.toLowerCase()
    let response = ""

    // 1. Check for predefined questions (including quick replies like "danh sách spa") first
    const foundQA = predefinedQuestions.find((qa) =>
      qa.keywords.some((keyword) => normalizedMessage.includes(keyword.toLowerCase())),
    )

    if (foundQA) {
      response = foundQA.answer
    } else {
      // 2. If no predefined question, then check for specific spa information requests by search keywords
      let foundSpaInfo = false
      for (const spa of spaData) {
        const foundKeyword = spa.searchKeywords.some((keyword) => normalizedMessage.includes(keyword))
        if (foundKeyword) {
          response = spa.info
          foundSpaInfo = true
          break
        }
      }

      if (!foundSpaInfo) {
        // 3. Check for unknown spa queries (if "spa" keyword is present but no known spa name is matched)
        const containsSpaKeyword = normalizedMessage.includes("spa")
        const knownSpaMentionedByExactName = spaData.some((spa) => normalizedMessage.includes(spa.name.toLowerCase()))
        if (containsSpaKeyword && !knownSpaMentionedByExactName) {
          response = `Spa này không tồn tại trên hệ thống. Vui lòng chọn một trong các spa có sẵn: ${spaData.map((s) => s.name).join(", ")}.`
        } else {
          // 4. Default response
          response = "AI đang trong quá trình training, vui lòng hỏi câu hỏi khác."
        }
      }
    }
    return response
  }

  // Function to handle sending and processing any message (from input or quick reply)
  const sendAndProcessMessage = (messageText) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    }
    setMessages((prev) => [...prev, userMessage])
    setNewMessage("") // Clear input after sending
    setIsSending(true) // Set sending state for user message

    // Simulate message sending status update
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "delivered" } : msg)))
      setIsSending(false) // Clear sending state after user message is "delivered"
    }, 1000)

    const supportResponseText = processAndRespond(messageText)

    // Simulate support typing and response
    setTimeout(() => {
      setIsTyping(true)
    }, 1500)

    setTimeout(() => {
      setIsTyping(false)
      const supportMessage = {
        id: (Date.now() + 1).toString(),
        text: supportResponseText,
        sender: "support",
        timestamp: new Date(),
        status: "delivered",
      }
      setMessages((prev) => [...prev, supportMessage])
    }, 3000)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (isSending) return // Prevent sending if already in sending state
    sendAndProcessMessage(newMessage)
  }

  const handleQuickReply = (text) => {
    // Directly send the text from quick reply
    sendAndProcessMessage(text)
    inputRef.current?.focus()
  }

  const quickReplies = [
    "Tôi muốn đặt lịch",
    "Hỏi về dịch vụ",
    "Thông tin chi nhánh",
    "Khuyến mãi hiện tại",
    "Danh sách spa", // Added for spa list
  ]

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400 animate-spin" />
      case "sent":
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-green-500" />
      default:
        return null
    }
  }

  // Position classes
  const getPositionClasses = () => {
    if (!showAsPopup) return "inset-0 items-center justify-center"
    switch (position) {
      case "bottom-right":
        return "bottom-20 right-4"
      case "bottom-left":
        return "bottom-20 left-4"
      case "top-right":
        return "top-4 right-4"
      case "top-left":
        return "top-4 left-4"
      case "center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      default:
        return "bottom-20 right-4"
    }
  }

  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-80 h-96"
      case "medium":
        return "w-96 h-[500px]"
      case "large":
        return "w-[450px] h-[600px]"
      default:
        return "w-96 h-[500px]"
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed z-[9999] ${showAsPopup ? getPositionClasses() : "inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"}`}
    >
      <div
        className={`
        bg-white rounded-2xl shadow-2xl flex flex-col
        ${showAsPopup ? getSizeClasses() : "w-full max-w-md h-[80vh] sm:h-[600px]"}
        transform animate-in
        ${showAsPopup ? "slide-in-from-bottom-4" : "slide-in-from-bottom-4 sm:zoom-in-95"}
        duration-300
        ${className}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white ${
                  supportStatus === "online"
                    ? "bg-green-500"
                    : supportStatus === "busy"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                }`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Hỗ trợ khách hàng</h3>
              <p className="text-xs text-white/80">
                {supportStatus === "online" ? "Đang trực tuyến" : supportStatus === "busy" ? "Đang bận" : "Ngoại tuyến"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 hover:bg-white/20 text-white">
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                {message.sender === "support" && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <Headphones className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-xs text-gray-500">Nhân viên hỗ trợ</span>
                  </div>
                )}
                <div
                  className={`p-2 rounded-xl text-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                <div
                  className={`flex items-center gap-1 mt-1 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  {message.sender === "user" && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Headphones className="w-2 h-2 text-white" />
                </div>
                <span className="text-xs text-gray-500">Đang nhập...</span>
              </div>
              <div className="bg-white border border-gray-200 p-2 rounded-xl">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="p-2 border-t border-gray-100 bg-white">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className="whitespace-nowrap text-xs bg-transparent border-purple-200 text-purple-700 hover:bg-purple-50 h-6 px-2"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 h-8 text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim() || isSending}
              className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
