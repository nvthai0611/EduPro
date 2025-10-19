const User = require("../../models/user.model")
const { hashCheck, hashMake } = require("../../utils/hash")
const { isValidName, isValidPhone, isValidEmail } = require("../../utils/validation")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { generateConfirmPasswordEmail } = require("../../utils/templateString/emailContent")
const sendEmail = require("../../utils/email")
const bcrypt = require("bcrypt");
dotenv.config()
const changePasswordByUserId = async (userId, oldPassword, newPassword) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }

        const isPasswordValid = await hashCheck(oldPassword, user.password)
        console.log("checkPassword", isPasswordValid);

        if (!isPasswordValid) {
            throw new Error("Old password is incorrect")
        }

        // validate password
        validatePassword(newPassword)
        user.password = newPassword; // Gán password mới, sẽ trigger middleware hash
        await user.save()
    } catch (error) {
        throw error
    }
}

function validatePassword(password) {
    const trimmed = password.trim();

    if (!trimmed) {
        throw new Error("Mật khẩu không được để trống");
    }

    if (trimmed.length < 8) {
        throw new Error("Mật khẩu phải có ít nhất 8 ký tự");
    }

    if (!/[A-Z]/.test(trimmed)) {
        throw new Error("Mật khẩu phải chứa ít nhất một chữ cái in hoa");
    }

    if (!/[a-z]/.test(trimmed)) {
        throw new Error("Mật khẩu phải chứa ít nhất một chữ cái thường");
    }

    if (!/[0-9]/.test(trimmed)) {
        throw new Error("Mật khẩu phải chứa ít nhất một chữ số");
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(trimmed)) {
        throw new Error("Mật khẩu phải chứa ít nhất một ký tự đặc biệt");
    }

    return true;
}

const getUserProfile = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }
        return user
    } catch (error) {
        throw error
    }
}

const changeUserProfile = async (userId, fullName, phoneNumber, email, birthDate) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }
        const findUserByPhone = await User.findOne({ phoneNumber: phoneNumber })


        if (findUserByPhone && !findUserByPhone._id.equals(userId)) {
            throw new Error("Số điện thoại đã có người sử dụng")
        }
        // validate fullName
        if (!fullName) {
            throw new Error("Full name is required")
        }
        if (fullName.length > 100 || isValidName(fullName) === false) {
            throw new Error("Full name is invalid, please try again")
        }
        // validate phoneNumber
        if (!phoneNumber) {
            throw new Error("Phone number is required")
        }

        if (phoneNumber.length > 15 || isValidPhone(phoneNumber) === false) {
            throw new Error("Phone number is invalid, please try again VN phone number")
        }

        //validate email
        if (!email) {
            throw new Error("Email is required")
        }

        if (email.length > 100 || isValidEmail(email) === false) {
            throw new Error("Email is invalid, please try again")
        }

        user.fullName = fullName
        user.phoneNumber = phoneNumber
        user.email = email
        if (birthDate !== undefined) {
            if (birthDate) {
                const birth = new Date(birthDate)
                const now = new Date()
                const age = now.getFullYear() - birth.getFullYear()
                const m = now.getMonth() - birth.getMonth()
                const d = now.getDate() - birth.getDate()
                let isOldEnough = false
                if (age > 12) {
                    isOldEnough = true
                } else if (age === 12) {
                    if (m > 0 || (m === 0 && d >= 0)) {
                        isOldEnough = true
                    }
                }
                if (!isOldEnough) {
                    throw new Error("Người dùng phải lớn hơn 12 tuổi")
                }
                user.birthDate = birth
            } else {
                user.birthDate = null
            }
        }
        await user.save()
        return user
    } catch (error) {
        throw error
    }
}

const changeImageProfile = async (userId, image) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }
        // check format avatar
        if (!image) {
            throw new Error("Avatar is required")
        }
        user.image = image
        await user.save()
        return user
    } catch (error) {
        throw error
    }
}

const linkResetPassword = async (email) => {
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            const error = new Error()
            error.status = 400
            error.message = "Email không tồn tại"
            throw error
        }
        const tempPassword = generateTempPassword();
        const token = jwt.sign({
            email: user.email,
            tempPassword: tempPassword,
        }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const linkFrontend = process.env.FRONTEND_URL
        const confirmLink = `${linkFrontend}/confirm-temp-password?token=${token}`;

        sendEmail(user.email, "Xác nhận mật khẩu tạm thời", generateConfirmPasswordEmail(user.email, tempPassword, confirmLink))
        return confirmLink
    } catch (error) {
        console.log(error);
        throw error
    }
}

const confirmEmailResetPassword = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            const error = new Error()
            error.status = 400
            error.message = "Email không tồn tại"
            throw error
        }
        // Cập nhật mật khẩu tạm thời
        user.password = decoded.tempPassword;
        await user.save();

    } catch (err) {
        throw err
    }
}

const generateTempPassword = () => {
    const numbers = '0123456789';
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specials = '@!#$%^&*';

    const getRandom = (str) => str[Math.floor(Math.random() * str.length)];

    let password = [
        getRandom(numbers),
        getRandom(lowers),
        getRandom(uppers),
        getRandom(specials),
    ];

    const allChars = numbers + lowers + uppers + specials;
    while (password.length < 8) {
        password.push(getRandom(allChars));
    }

    return password.sort(() => 0.5 - Math.random()).join('');
};

module.exports = {
    changePasswordByUserId,
    getUserProfile,
    changeUserProfile,
    changeImageProfile,
    linkResetPassword,
    confirmEmailResetPassword
}