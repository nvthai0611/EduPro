import { apiClient } from '../../utils/clientAxios'

const getCartByUserId = async () => {
    return await apiClient.get(`/users/cart`);
}

const addToCart = async (data) => {
    return await apiClient.post('/users/cart/add-to-cart', data);
}

const updateCart = async (data) => {
    return await apiClient.put('/users/cart/update-cart', data);
}

const removeFromCart = async (productId) => {
    return await apiClient.delete(`/users/cart/remove-from-cart/${productId}`);
}

const clearCart = async () => {
    return await apiClient.delete(`/users/cart/clear-cart`);
}

const mergeCartFromClient = async (localCartItems) => {
    return await apiClient.post('/users/cart/merge-cart', { localCartItems });
}
const checkoutSelectedItems = async (data) => {
    return await apiClient.post('/users/cart/checkout', data);
}

const toggleItemSelection = async (productId) => {
    return await apiClient.post('/users/cart/toggle-selection', { productId });
}

const selectAllItems = async (selected) => {
    return await apiClient.post('/users/cart/select-all', { selected });
}

const createPayosPaymentLink = async (checkoutData, type) => {
    return await apiClient.post('/payos/payment', { checkoutData, type });
}

const getCheckoutByUserId = async (orderCode) => {
    return await apiClient.get(`/users/cart/checkout/${orderCode}`);
}


export {
    getCartByUserId,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    mergeCartFromClient,
    checkoutSelectedItems,
    toggleItemSelection,
    selectAllItems,
    createPayosPaymentLink,
    getCheckoutByUserId
};