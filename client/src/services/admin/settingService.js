import { apiClient } from "../../utils/clientAxios"

const getAllSetting = async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.category) queryParams.append('category', params.category)
    if (params.enabled !== undefined) queryParams.append('enabled', params.enabled)
    
    const queryString = queryParams.toString()
    return await apiClient.get(`/admin/setting${queryString ? '?' + queryString : ''}`)
}

const getSettingByKey = async (key) => {
    return await apiClient.get(`/admin/setting/${key}`)
}

const getSettingById = async (id) => {
    return await apiClient.get(`/admin/setting/id/${id}`)
}
const getSettingsByCategory = async (category) => {
    return await apiClient.get(`/admin/setting/category/${category}`)
}

const addNewSetting = async (data) => {
    return await apiClient.post(`/admin/setting`, data)
}

const updateSettingByKey = async (key, data) => {
    return await apiClient.put(`/admin/setting/${key}`, data)
}

const updateSetting = async (id, data) => {
    return await apiClient.put(`/admin/setting/id/${id}`, data)
}

const deleteSetting = async (id) => {
    return await apiClient.delete(`/admin/setting/id/${id}`)
}

const toggleSettingStatus = async (id) => {
    return await apiClient.patch(`/admin/setting/id/${id}/toggle`)
}
const addNewBanner = async (data) => {
    const key = data.key || 'homepage'
    return await apiClient.post(`/admin/setting/${key}/slides`, data)
}

const getAllBanners = async (params = {}) => {
    const key = params.key || 'homepage'
    return await apiClient.get(`/admin/setting/${key}/slides`)
}

const updateBanner = async (id, data) => {
    const key = data.key || 'homepage'
    return await apiClient.put(`/admin/setting/${key}/slides/${id}`, data)
}

const deleteBanner = async (id, key = 'homepage') => {
    return await apiClient.delete(`/admin/setting/${key}/slides/${id}`)
}

const reorderBanners = async (data) => {
    const key = data.key || 'homepage'
    return await apiClient.put(`/admin/setting/${key}/banners/reorder`, data)
}

export { 
    // Settings CRUD
    getAllSetting, 
    getSettingByKey,
    getSettingById,
    getSettingsByCategory,
    addNewSetting, 
    updateSetting,
    updateSettingByKey,
    deleteSetting,
    toggleSettingStatus,
    // Banners
    addNewBanner, 
    getAllBanners, 
    updateBanner, 
    deleteBanner, 
    reorderBanners 
}