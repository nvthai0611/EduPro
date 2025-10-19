const userModel = require("../../../models/user.model");
const { successResponse, errorResponse } = require("../../../utils/response");
const roleModel = require("../../../models/role.model");
const {
    createUser,
    getAllUser,
    editUser,
    verifyEmail,
    deleteUser
} = require("../../../services/adminService/userService");
const { ROLE } = require("../../../utils/role_enum");
const Staff = require("../../../models/staff.model");
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().populate("role");
        if (!users) {
            return errorResponse(res, {}, 404, "Không có danh sách người dùng");
        }
        const formatUsers = users.map((user) => {
            return { ...user._doc, password: undefined };
        });
        return successResponse(
            res,
            formatUsers,
            {},
            201,
            "Danh sách nguoi dung thanh cong"
        );
    } catch (error) {
        console.log(error);
    }
};
// const ROLE = require('../../../utils/role_enum')

const addUser = async (req, res) => {
    const { fullName, email, phoneNumber, role, position, branchId } = req.body;

    try {

        const result = await createUser(fullName, email, role, phoneNumber, position, branchId);

        return successResponse(res, result, {}, 201, "Create user success, send email success");
    } catch (error) {
        console.error("Create user error controller: ", error.message);
        return errorResponse(res, {}, error.status, `${error.message}`);
    }
};

const getAllUsersByCondition = async (req, res) => {
    try {
        const { search, role, isActive } = req.query;
        const result = await getAllUser(search, role, isActive)

        return successResponse(
            res,
            result,
            {},
            200,
            "Get all users by condition success"
        );
    } catch (error) { }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phoneNumber, role, status, position, branchId } = req.body;

        const result = await editUser(id, {
            fullName,
            phoneNumber,
            role,
            status,
            position,
            branchId,
        });
        return successResponse(res, result, {}, 200, "Edit user success");
    } catch (error) {
        console.error("Edit user error controller: ", error.message);
        return errorResponse(res, {}, error.status, `${error.message}`);
    }
};

const verifyAccount = async (req, res) => {
    const { id } = req.params;
    try {
        //Gọi xuống service để xác thực tài khoản
        const result = await verifyEmail(id);
        return successResponse(
            res,
            result,
            {},
            201,
            "Verify account success, you can login now"
        );
    } catch (error) {
        console.log("verify account error controller: ", error.message);
        return errorResponse(res, {}, error.status, `${error.message}`);
    }
};

const getDetailUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).populate([
            { path: "role", select: "name" },
            { path: "provider", select: "name -_id" },
        ]);
        if (!user) {
            return errorResponse(res, {}, 404, "Không có người dùng này");
        }
        const formatUser = { ...user._doc, password: undefined };
        return successResponse(res, formatUser, {}, 201, "Chi tiết người dùng");
    } catch (error) {
        console.log(error);
    }
};

// const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await userModel.findById(id);
//         if (!user) {
//             return errorResponse(res, {}, 404, "Không có người dùng này");
//         }
//         const updateUser = await userModel.findByIdAndUpdate(id, req.body, { new: true }).populate('role');
//         return successResponse(res, { ...updateUser._doc, password: undefined }, {}, 201, "Cập nhật người dùng thành công");
//     } catch (error) {
//         console.log(error);
//     }
// }

const getAllRole = async (req, res) => {
    try {
        const roles = [ROLE]; // bọc object ROLE vào mảng
        if (roles.length === 0) {
            return errorResponse(res, {}, 404, "Không có danh sách quyền");
        }
        return successResponse(res, roles, {}, 200, "Danh sách quyen");
    } catch (error) {
        console.log(error);
    }
};

const getAllPositions = async (req, res) => {
    try {
        const enumValues = Staff.schema.path("position").enumValues;

        if (!enumValues || enumValues.length === 0) {
            return errorResponse(res, {}, 404, "Không có danh sách quyền");
        }

        return successResponse(res, enumValues, {}, 200, "Danh sách quyền");
    } catch (error) {
        console.error("Lỗi lấy danh sách quyền:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};

const getStaffByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);

        const staff = await Staff.findOne({ userId })
            .populate("userId")        // Lấy thông tin user liên kết
            .populate("branchId")      // (Tuỳ chọn) Lấy thông tin chi nhánh
            .populate("skills");       // (Tuỳ chọn) Lấy thông tin dịch vụ

        if (!staff) {
            return errorResponse(res, {}, 404, "Không có chi tiết nhân viên");
        }

        return successResponse(res, staff, {}, 200, "Chi tiết nhân viên");
    } catch (error) {
        console.error("Lỗi lấy chi tiết nhân viên:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteUser(id);
        return successResponse(res, {}, {}, 201, "Xóa người dùng thành công");

    } catch (error) {
        console.log("Lỗi xóa người dùng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi xóa người dùng từ server",
        });
    }
};


module.exports = {
    getAllUsersByCondition,
    getDetailUser,
    updateUser,
    getAllRole,
    addUser,
    verifyAccount,
    getAllPositions,
    getStaffByUserId,
    deleteUserById
};
