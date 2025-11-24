const UserModel = require("../../models/user.model.js");
const { hashMake } = require("../../utils/hash.js");
const sendEmail = require("../../utils/email.js");
const StaffModel = require("../../models/staff.model");
const BookingModel = require("../../models/booking.model");
const OrderModel = require("../../models/order.model");
const UserCouponModel = require("../../models/user_coupon.js");
const ReviewModel = require("../../models/review.model");
const ReviewProductModel = require("../../models/review_product.model");
const LeaveRequestModel = require("../../models/leave_request.model");
const WorkScheduleModel = require("../../models/workschedule.model");
const dotenv = require("dotenv");
dotenv.config();
const createUser = async (fullName, emailUser, role, phoneNumber, position, branchId) => {
    try {
        branchId = branchId === "" ? null : branchId;
        if (!fullName) {
            const error = new Error("Missing fullName");
            error.status = 400;
            // trả về lỗi nếu thiếu thông tin
            throw error;
        }

        if (!emailUser) {
            const error = new Error("Missing email");
            error.status = 400;
            throw error;
        }
        if (!role) {
            const error = new Error("Missing role");
            error.status = 400;
            throw error;
        }
        if (!phoneNumber) {
            const error = new Error("Missing phone number");
            error.status = 400;
            throw error;
        }

        //Check valid full name

        //Kiểm tra xem email đã tồn tại chưa
        const checkEmail = await UserModel.findOne({
            email: emailUser,
            isActive: true,
        });
        if (checkEmail) {
            const error = new Error("Email already exists");
            error.status = 409;
            throw error;
        }
        //Kiểm tra xem phone number tồn tại chưa
        const checkPhoneNumber = await UserModel.findOne({
            phoneNumber,
            isActive: true,
        });
        if (checkPhoneNumber) {
            const error = new Error("Phone number already exists");
            error.status = 409;
            throw error;
        }


        //Tạo password để gửi cho user
        const randomPassword = role != 'staff' ? generateTempPassword() : "123123aA@";
        console.log("randomPassword", randomPassword);

        //hash password trước khi lưu
        fullName = fullName.trim().replace(/\s+/g, ' '); // loại bỏ khoảng trắng thừa
        const user = await UserModel.create({
            fullName: fullName,
            email: emailUser,
            role,
            phoneNumber,
            password: randomPassword,
            status: false,
            confirmEmail: false,
            verifyExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h từ bây giờ
        });
        let staffData = null;
        if (role === "staff") {
            // neu la role staff thi phai nhap position
            if (!position) {
                const error = new Error("Missing position or branchId");
                error.status = 400;
                throw error;
            }
            //check staff vs position manager
            const isManager = role === "staff" && position === "manager";
            //check xem co branch khong
            const hasBranch = !!branchId;

            if (isManager && hasBranch) {
                // neu co thi kiem tra xem branch nay da co manager chua
                console.log("isManager", isManager);
                console.log("hasBranch", hasBranch);

                const checkExistingManager = await StaffModel.findOne({
                    branchId,
                    position: "manager",
                });
                console.log(checkExistingManager);

                if (checkExistingManager) {
                    const error = new Error("Branch already has a manager");
                    error.status = 409;
                    throw error;
                }
            }

            const newStaff = await StaffModel.create({
                userId: user.id,
                position,
                branchId: branchId || undefined,
            });

            staffData = {
                staffId: newStaff._id,
                position: newStaff.position,
                branchId: newStaff.branchId,
                skills: newStaff.skills,
                rating: newStaff.rating,
                workingHours: newStaff.workingHours,
                createdAt: newStaff.createdAt,
                updatedAt: newStaff.updatedAt,
            };
        }
        const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
        const emailContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Account Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Chào ${user.fullName},</h2>
      <p>Tài khoản của bạn đã được tạo thành công.</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Mật khẩu:</strong> ${randomPassword}</p>
      <p>Vui lòng xác minh email của bạn bằng cách nhấp vào nút bên dưới:</p>
      <p>
        <a href="${FRONTEND_URL}/verify-account/${user._id}" 
           style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;"
           target="_blank" 
           rel="noopener noreferrer">
          Xác minh tài khoản
        </a>
      </p>
      <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
    </body>
  </html>
`;
        // await sendEmail(...)
        // Gửi email cho user với thông tin tài khoản
        await sendEmail(emailUser, "Verify your account", emailContent);
        const responseData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            verifyExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),// 24h từ bây giờ khi tạo tài khoản, neu không xác thực trong 24h thì tài khoản sẽ bị xóa     
        }
        if (staffData) {
            responseData.staff = staffData;
        }
        return responseData
    } catch (error) {
        console.error("Create user error service:", error.message);
        throw error;
    }
};

const getAllUser = async (search, role, isActive) => {
    try {
        const filter = {};

        // Tìm theo name hoặc email
        // if (search !== null && search !== undefined) {
        //     filter.$or = [
        //         { name: { $regex: search, $options: "i" } }, // 'i' = không phân biệt hoa thường
        //         { email: { $regex: search, $options: "i" } },
        //     ];
        // }

        // // Tìm theo role
        // if (role !== undefined && role !== null) {
        //     filter.role = { $regex: role, $options: "i" };
        // }

        // // Tìm theo isActive (boolean, so sánh trực tiếp)
        // if (typeof isActive === "boolean") {
        //     filter.isActive = isActive;
        // }

        const users = await UserModel.find().sort({ status: -1, createdAt: 1 }).lean();

        const usersWithStaffDetails = await Promise.all(
            users.map(async (user) => {
                const userData = {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };

                // Nếu người dùng có vai trò là "staff", tìm thông tin staff tương ứng
                if (user.role === "staff") {
                    const staff = await StaffModel.findOne({ userId: user._id }).lean();
                    if (staff) {
                        userData.staff = {
                            staffId: staff._id,
                            position: staff.position,
                            branchId: staff.branchId,
                            skills: staff.skills,
                            rating: staff.rating,
                            workingHours: staff.workingHours,
                            createdAt: staff.createdAt,
                            updatedAt: staff.updatedAt,
                        };
                    }
                }
                return userData;
            })
        );

        return usersWithStaffDetails;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        throw error;
    }
};

const editUser = async (userId, newInformation) => {
    try {
        const getUser = await UserModel.findById(userId)
        console.log("getUser", getUser);
        console.log("newInformation", newInformation);


        if (!getUser) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        if (newInformation.email || newInformation.email === "") {
            const error = new Error("Email is not allowed to change");
            error.status = 400;
            throw error;
        }

        //Nếu đang là role staff mà change role thì xóa staff
        if (getUser.role === "staff" && newInformation.role !== "staff") {
            // Xóa thông tin staff tương ứng
            await StaffModel.findOneAndDelete({ userId: userId });
        }

        if (newInformation.role === "staff") {
            // Nếu role là staff thì cập nhật thông tin staff tương ứng
            await StaffModel.create({
                userId: userId,
                position: "manager"
            })
        }


        // Cập nhật user mỗi cái status thôi
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                fullName: newInformation.fullName,
                phoneNumber: newInformation.phoneNumber,
                role: newInformation.role,
                status: newInformation.status,
            },
            { new: true }
        )



        return {
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            role: updatedUser.role,
            status: updatedUser.status,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
    } catch (error) {
        console.error("Edit user error:", error.message);
        throw error;
    }
};

const verifyEmail = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            const error = new Error(
                "User not found, can't verify email. Please contact admin"
            );
            error.status = 404;
            throw error;
        }
        if (user.confirmEmail) {
            const error = new Error("Email already verified");
            error.status = 400;
            throw error;
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { confirmEmail: true, status: true },
            { new: true }
        );
        return {
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            role: updatedUser.role,
            status: updatedUser.isActive,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
    } catch (error) {
        console.error("Edit user error:", error.message);
        throw error;
    }
};

const deleteUser = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        // Kiểm tra liên kết (bỏ staff)
        const [
            booking,
            order,
            userCoupon,
            review,
            reviewProduct,
            leaveRequest,
            leaveRequestApproved,
            workScheduleApproved
        ] = await Promise.all([
            BookingModel.findOne({ customerId: userId }),
            OrderModel.findOne({ UserId: userId }),
            UserCouponModel.findOne({ userId }),
            ReviewModel.findOne({ userId }),
            ReviewProductModel.findOne({ user: userId }),
            LeaveRequestModel.findOne({ staffId: userId }),
            LeaveRequestModel.findOne({ approvedBy: userId }),
            WorkScheduleModel.findOne({ approvedBy: userId }),
        ]);

        if (
            booking ||
            order ||
            userCoupon ||
            review ||
            reviewProduct ||
            leaveRequest ||
            leaveRequestApproved ||
            workScheduleApproved
        ) {
            const error = new Error("Không thể xóa user vì đã có liên kết dữ liệu.");
            error.status = 400;
            throw error;
        }

        // Nếu có staff thì xóa luôn staff
        await StaffModel.deleteOne({ userId });

        await UserModel.findByIdAndDelete(userId);
        return { message: "User deleted successfully" };
    } catch (error) {
        console.error("Delete user error:", error.message);
        throw error;
    }
};

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
    createUser,
    getAllUser,
    editUser,
    deleteUser,
    verifyEmail,
};
