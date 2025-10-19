# Hướng dẫn hoạt động của hệ thống validate time trong booking

## Tổng quan

Hệ thống validate time được thiết kế để kiểm tra và ngăn chặn việc đặt lịch vào các khung giờ không khả dụng, bao gồm:

- Khung giờ đã qua (quá khứ)
- Khung giờ không nằm trong giờ làm việc của nhân viên
- Khung giờ bị conflict với các booking đã có


## Các hàm utility chính

### 1. `timeToMinutes(time)`

```javascript
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}
```

**Mục đích**: Chuyển đổi thời gian từ format "HH:MM" thành số phút để dễ dàng so sánh và tính toán.

**Ví dụ**:

- `"08:30"` → `8 * 60 + 30 = 510 phút`
- `"13:45"` → `13 * 60 + 45 = 825 phút`


### 2. `isPastTime(time, selectedDate)`

```javascript
const isPastTime = (time, selectedDate) => {
  const [hour, minute] = time.split(":").map(Number)
  const [day, month] = selectedDate?.date?.split("/")?.map(Number) || []
  const slotDate = new Date()
  slotDate.setHours(hour, minute, 0, 0)
  slotDate.setDate(day)
  slotDate.setMonth(month - 1)
  const now = new Date()
  return slotDate < now
}
```

**Mục đích**: Kiểm tra xem một khung giờ có thuộc quá khứ hay không.

**Cách hoạt động**:

1. Tách giờ và phút từ time
2. Tách ngày và tháng từ selectedDate
3. Tạo Date object cho khung giờ đó
4. So sánh với thời gian hiện tại


### 3. `isTimeSlotConflicted(timeSlot, bookedTimes, serviceDuration)`

```javascript
const isTimeSlotConflicted = (timeSlot, bookedTimes, serviceDuration = 60) => {
  if (!bookedTimes || bookedTimes.length === 0) return false

  const slotStartMinutes = timeToMinutes(timeSlot)
  const slotEndMinutes = slotStartMinutes + serviceDuration

  return bookedTimes.some((bookedTime) => {
    const bookedStartMinutes = timeToMinutes(bookedTime)
    const bookedEndMinutes = bookedStartMinutes + serviceDuration

    // Kiểm tra overlap
    return slotStartMinutes < bookedEndMinutes && slotEndMinutes > bookedStartMinutes
  })
}
```

**Mục đích**: Kiểm tra xem một khung giờ có bị conflict với các booking đã có hay không.

**Logic overlap**:

- Slot bắt đầu trước khi booking kết thúc VÀ
- Slot kết thúc sau khi booking bắt đầu
- → Có conflict


**Ví dụ thực tế**:

```plaintext
Booking đã có: 13:45 - 14:45
Slot muốn đặt: 13:00 - 14:00

Kiểm tra:
- slotStartMinutes = 780 (13:00)
- slotEndMinutes = 840 (14:00)
- bookedStartMinutes = 825 (13:45)
- bookedEndMinutes = 885 (14:45)

Điều kiện: 780 < 885 && 840 > 825 → TRUE → Có conflict
```

## Hàm tìm khung giờ khả dụng

### `findAvailableTimeSlots(services, selectedDate, selectedStylist)`

**Cách hoạt động**:

1. **Kiểm tra điều kiện cơ bản**:

```javascript
if (!services?.length || !selectedDate) return []
```


2. **Chuẩn hóa tên ngày**:

```javascript
const dayLabel = String(selectedDate?.label ?? "")
  .split("(")[0]
  .replace("Hôm nay,", "")
  .replace("Ngày mai,", "")
  .trim()
  .replace("Thứ 2", "T2")
  // ... các thứ khác
```


3. **Xử lý trường hợp không chọn stylist**:

```javascript
if (!selectedStylist) {
  return allTimeSlots.map((start) => ({
    start,
    aesthetician: null,
    service: services[0]?.name || "Default Service",
  }))
}
```


4. **Lọc theo giờ làm việc của stylist**:

```javascript
const workingHours = selectedStylist.workingHours?.[dayKey] || []

workingHours.forEach((slot) => {
  const slotStart = timeToMinutes(slot.start)
  const slotEnd = timeToMinutes(slot.end)
  
  allTimeSlots.forEach((time) => {
    const timeInMinutes = timeToMinutes(time)
    if (timeInMinutes >= slotStart && timeInMinutes < slotEnd) {
      availableSlots.push({...})
    }
  })
})
```




## Luồng validate trong component chính

### 1. Tính toán tổng thời gian dịch vụ

```javascript
const totalServiceDuration = useMemo(() => {
  return selectedServices?.reduce((sum, service) => sum + (service.duration || 60), 0) || 60
}, [selectedServices])
```

### 2. Fetch dữ liệu booking đã có

```javascript
const { data: bookingExistsResponse = { data: [] } } = useQuery({
  queryKey: ["bookingExists", selectedStylist ? selectedStylist.aesId : "no-stylist", selectedDate?.date],
  queryFn: () => getBookedTimeSlotsByAestheticians({
    branchId: selectedBranch?._id,
    aesId: selectedStylist ? [selectedStylist.aesId] : [],
    date: selectedDate?.date,
  }),
  enabled: !!selectedDate?.date,
})
```

### 3. Render time slots với validation

```javascript
{allTimeSlots.map((time) => {
  const isAvailable = availableTimeSlots.some((slot) => slot.start === time)
  const isConflicted = selectedStylist
    ? isTimeSlotConflicted(time, bookedTimes, totalServiceDuration)
    : false
  const isPast = isPastTime(time, selectedDate)
  const isDisabled = !isAvailable || isPast || isConflicted
  
  return (
    <Button
      key={time}
      disabled={isDisabled}
      className={isDisabled ? "bg-gray-200 cursor-not-allowed opacity-50" : "..."}
    >
      {time}
    </Button>
  )
})}
```

## Ví dụ thực tế

### Scenario: Booking đã có và validation

**Dữ liệu**:

- Booking đã có: `['08:00', '08:30', '09:00', '09:30', '12:00', '12:30', '13:00', '13:30', '13:45', '14:15', '14:45']`
- Dịch vụ: 60 phút
- Stylist: Đã chọn
- Ngày: Hôm nay


**Kết quả validation**:

| Khung giờ | Trạng thái | Lý do
|-----|-----|-----
| 08:00 | ❌ Disabled | Conflict với booking 08:00-09:00
| 08:30 | ❌ Disabled | Conflict với booking 08:30-09:30
| 09:00 | ❌ Disabled | Conflict với booking 09:00-10:00
| 09:30 | ❌ Disabled | Conflict với booking 09:30-10:30
| 10:00 | ✅ Available | Không có conflict
| 10:30 | ✅ Available | Không có conflict
| 11:00 | ✅ Available | Không có conflict
| 11:30 | ❌ Disabled | Conflict với booking 12:00-13:00
| 12:00 | ❌ Disabled | Conflict với booking 12:00-13:00
| 12:30 | ❌ Disabled | Conflict với booking 12:30-13:30
| 13:00 | ❌ Disabled | Conflict với booking 13:00-14:00
| 13:30 | ❌ Disabled | Conflict với booking 13:30-14:30
| 13:45 | ❌ Disabled | Conflict với booking 13:45-14:45
| 14:15 | ❌ Disabled | Conflict với booking 14:15-15:15
| 14:45 | ❌ Disabled | Conflict với booking 14:45-15:45


## Tối ưu hóa performance

### 1. Sử dụng useMemo

```javascript
const availableTimeSlots = useMemo(() => {
  return findAvailableTimeSlots(selectedServices, selectedDate, selectedStylist)
}, [selectedServices, selectedDate, selectedStylist, aesthetican.data])

const allTimeSlots = useMemo(() => {
  if (!selectedDate) return []
  return generateTimeSlots(selectedDate.date, true)
}, [selectedDate])
```

### 2. Conditional API calls

```javascript
const { data: bookingExistsResponse } = useQuery({
  // ...
  enabled: !!selectedDate?.date, // Chỉ gọi API khi có ngày được chọn
})
```

## Xử lý edge cases

### 1. Không có stylist được chọn

- Hiển thị tất cả time slots có thể
- Không kiểm tra conflict với booking cụ thể


### 2. Không có dữ liệu booking

- Placeholder data: `{ data: [] }`
- Không disable bất kỳ slot nào do conflict


### 3. Thời gian quá khứ

- Luôn disable các slot đã qua
- Kiểm tra cả ngày và giờ


### 4. Giờ làm việc của stylist

- Chỉ hiển thị slots trong giờ làm việc
- Mapping ngày trong tuần với schedule