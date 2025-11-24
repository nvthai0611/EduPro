const SettingModel = require('../../models/setting.model')

//get All Setting
const getAllSettings = async () => {
    try {
        const getAll = await SettingModel.find()
        if (!getAll) {
            const error = new Error('not found')
            error.status = 404
            throw error
        }
        return getAll
    } catch (error) {
        console.log(error);
        throw error
    }
}

const addNewSetting = async (key, enabled, description) => {
    try {
        const getByKey = await SettingModel.findOne({ key })
        if (getByKey) {
            const error = new Error('Đã có setting này rồi, hãy đổi Key')
            error.status = 400
            throw error
        }
        const addNew = await SettingModel.create({ key, enabled, description })
        return addNew
    } catch (error) {
        console.log(error);
        throw error
    }
}

const updateSetting = async (id, key, enabled, description) => {
    try {
        const update = await SettingModel.findByIdAndUpdate(id, { key, enabled, description }, { new: true })
        if (!update) {
            const error = new Error('Không tìm thấy setting')
            error.status = 404
            throw error
        }
        return update
    } catch (error) {
        console.log(error);
        throw error
    }
}

const deleteSetting = async (id) => {
    try {
        const deleteSetting = await SettingModel.findByIdAndDelete(id)
        if (!deleteSetting) {
            const error = new Error('Không tìm thấy setting')
            error.status = 404
            throw error
        }
        return deleteSetting
    } catch (error) {
        console.log(error);
        throw error
    }
}

module.exports = { getAllSettings, addNewSetting, updateSetting, deleteSetting }