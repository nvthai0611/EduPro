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
    
    // Nếu có file, tạo FormData để upload
    if (data.image instanceof File) {
        const formData = new FormData()
        formData.append('image', data.image)
        formData.append('title', data.title)
        formData.append('description', data.description || '')
        formData.append('linkUrl', data.linkUrl)
        formData.append('isActive', data.isActive)
        
        return await apiClient.post(`/admin/setting/${key}/slides`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
    
    // Nếu không có file, gửi data thông thường
    return await apiClient.post(`/admin/setting/${key}/slides`, data)
}

const getAllBanners = async (params = {}) => {
    const key = params.key || 'homepage'
    return await apiClient.get(`/admin/setting/${key}/slides`)
}

const updateBanner = async (id, data) => {
    const key = data.key || 'homepage'
    
    // Nếu có file mới, tạo FormData để upload
    if (data.image instanceof File) {
        const formData = new FormData()
        formData.append('image', data.image)
        formData.append('title', data.title)
        formData.append('description', data.description || '')
        formData.append('linkUrl', data.linkUrl)
        formData.append('isActive', data.isActive)
        
        // Gửi publicId cũ để xóa ảnh cũ
        if (data.oldPublicId) {
            formData.append('oldPublicId', data.oldPublicId)
        }
        
        return await apiClient.put(`/admin/setting/${key}/slides/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
    
    // Nếu không có file mới, gửi data thông thường
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