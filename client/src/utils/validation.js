export const isValidPhone = (formattedPhone) => {
  // Ép xuống string, fallback rỗng  
  const plain = String(formattedPhone ?? "").replace(/\./g, "");
  return /^(03|05|07|08|09)\d{8}$/.test(plain);
};

//validate email
export const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

//validate name
// export const isValidName = (name) => {
//   return /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐÊƠƯĂĐÊƠƯ\s]+$/.test(name);
// }


const removeAscent = (str) => {
  if (str === null || str === undefined) return str;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str;
}

// Phiên bản sửa - thêm khoảng trắng vào regex
export const isValidName = (string) => {
  // Thêm \s để chấp nhận khoảng trắng
  const re = /^[a-zA-Z\s]{2,}$/;
  return re.test(removeAscent(string));
}

// Validate password strength for production
export const isValidPassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 8 ký tự" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 1 chữ in hoa" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 1 chữ thường" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 1 chữ số" };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt" };
  }
  return { valid: true, message: "" };
}