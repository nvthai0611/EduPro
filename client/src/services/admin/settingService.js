import { apiClient } from "../../utils/clientAxios"

const addNewBanner = async (data) => {
    const key = data.key || 'homepage';
    return await apiClient.post(`/admin/setting/${key}/banners`, data)
}

const getAllBanners = async (params = {}) => {
    const key = params.key || 'homepage';
    return await apiClient.get(`/admin/setting/${key}/banners`)
}

const updateBanner = async (id, data) => {
    const key = data.key || 'homepage';
    return await apiClient.put(`/admin/setting/${key}/banners/${id}`, data)
}

const deleteBanner = async (id) => {
    const key = 'homepage'; // or pass key
    return await apiClient.delete(`/admin/setting/${key}/banners/${id}`)
}

const reorderBanners = async (data) => {
    const key = data.key || 'homepage';
    return await apiClient.put(`/admin/setting/${key}/banners/reorder`, data)
}

// Settings functions
const addNewSetting = async (data) => {
    const key = data.key;
    return await apiClient.post(`/admin/setting/${key}`, data)
}

const getAllSetting = async (key = 'homepage') => {
    return await apiClient.get(`/admin/setting/${key}`)
}

const updateSetting = async (key, data) => {
    return await apiClient.put(`/admin/setting/${key}`, data)
}

export { addNewBanner, getAllBanners, updateBanner, deleteBanner, reorderBanners, addNewSetting, getAllSetting, updateSetting }