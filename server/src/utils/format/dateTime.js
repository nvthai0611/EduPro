const dayjs = require("dayjs");

function buildDateTime(dateString, timeString) {
  let year, month, day

  // Check for DD/MM format (e.g., "30/07")
  if (dateString.includes("/")) {
    const parts = dateString.split("/").map(Number)
    if (parts.length === 2) {
      day = parts[0]
      month = parts[1] // Month is 1-indexed from input
      year = new Date().getFullYear() // Assume current year if not provided
    } else {
      console.error(`Invalid dateString format: '${dateString}'. Expected 'DD/MM' or 'YYYY-MM-DD'.`)
      throw new Error("Invalid date format for booking. Expected 'DD/MM' or 'YYYY-MM-DD'.")
    }
  }
  // Check for YYYY-MM-DD format (e.g., "2025-07-30")
  else if (dateString.includes("-")) {
    const parts = dateString.split("-").map(Number)
    if (parts.length === 3) {
      year = parts[0]
      month = parts[1] // Month is 1-indexed from input
      day = parts[2]
    } else {
      console.error(`Invalid dateString format: '${dateString}'. Expected 'DD/MM' or 'YYYY-MM-DD'.`)
      throw new Error("Invalid date format for booking. Expected 'DD/MM' or 'YYYY-MM-DD'.")
    }
  } else {
    console.error(`Unrecognized dateString format: '${dateString}'.`)
    throw new Error("Unrecognized date format for booking.")
  }

  const [hour, minute] = timeString.split(":").map(Number)

  // Month is 0-indexed in JavaScript Date object, so subtract 1
  const date = new Date(year, month - 1, day, hour, minute, 0, 0)

  // Thêm kiểm tra để đảm bảo đối tượng Date hợp lệ
  if (isNaN(date.getTime())) {
    console.error(`Invalid date or time provided after parsing: dateString='${dateString}', timeString='${timeString}'`)
    throw new Error("Invalid date or time format for booking.")
  }
  return date
}

const parseDateTime = (dateStr, timeStr) => {
  const [day, month] = dateStr.split("/").map(Number);
  const year = new Date().getFullYear();
  return new Date(`${year}-${month}-${day}T${timeStr}:00.000Z`);
};

module.exports = { buildDateTime, parseDateTime };
