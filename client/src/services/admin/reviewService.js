import { apiClient } from '../../utils/clientAxios'

const updateStatusReview = async (id) => {
    return await apiClient.put('/admin/review/' + id + '/status')
}
const updateReviewService = async (id) => {
    return await apiClient.put('/admin/review/review-service/' + id + '/status')
}
export {
    updateStatusReview,
    updateReviewService
}