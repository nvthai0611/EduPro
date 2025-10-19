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
 const isValidName = (string) => {
    // Thêm \s để chấp nhận khoảng trắng
    const re = /^[a-zA-Z\s]{2,}$/;
    return re.test(removeAscent(string));
}

 const isValidPhone = (formattedPhone) => {
    // Ép xuống string, fallback rỗng  
    const plain = String(formattedPhone ?? "").replace(/\./g, "");
    return /^(03|05|07|08|09)\d{8}$/.test(plain);
};

//validate email
 const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

module.exports = { isValidName, isValidPhone, isValidEmail };   