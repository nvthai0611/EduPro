import { apiClient } from "../../utils/clientAxios"

const addNewSetting = async (data) => {
    return await apiClient.post("/admin/setting", data)
}

const getAllSetting = async () => {
    return await apiClient.get("/admin/setting")
}

const updateSetting = async (id, data) => {
    return await apiClient.put(`/admin/setting/${id}`, data)
}

const deleteSetting = async (id) => {
    return await apiClient.delete(`/admin/setting/${id}`)
}

export { addNewSetting, getAllSetting, updateSetting, deleteSetting }