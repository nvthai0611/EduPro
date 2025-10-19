const { addNewSetting, getAllSettings, updateSetting, deleteSetting } = require("../../../services/adminService/settingService")
const { errorResponse, successResponse } = require('../../../utils/response')



const addNewSettingController = async (req, res) => {
    try {
        const { key, enabled, description } = req.body
        const result = await addNewSetting(key, enabled, description)
        return successResponse(res, result, {}, 200, "Thêm setting thành công");
    } catch (error) {
        return errorResponse(res, {}, error.status, error.message);
    }
}

const updateSettingController = async (req, res) => {
    try {
        const { id } = req.params
        const { key, enabled, description } = req.body
        const result = await updateSetting(id, key, enabled, description)
        return successResponse(res, result, {}, 200, "Chỉnh sửa setting thành công");
    } catch (error) {
        return errorResponse(res, {}, error.status, error.message);
    }
}

const getAllSettingController = async (req, res) => {
    try {
        const result = await getAllSettings()
        return successResponse(res, result, {}, 200, "Lấy dữ liệu setting");
    } catch (error) {
        return errorResponse(res, {}, error.status, error.message);
    }
}

const deleteSettingController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteSetting(id)
        return successResponse(res, result, {}, 200, "Xóa setting thông");
    } catch (error) {
        return errorResponse(res, {}, error.status, error.message);
    }
}

module.exports = {
    addNewSettingController,
    updateSettingController,
    getAllSettingController,
    deleteSettingController
}