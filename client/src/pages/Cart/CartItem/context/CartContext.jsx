"use client"

import { createContext, useContext, useReducer, useEffect, useState } from "react"
import { getAllProduct } from "../../../../services/commonService"
import { authService } from "../../../../services/auth/authService"
import * as cartApi from "../../../../services/user/cartService"

const CART_STORAGE_KEY = "shopping_cart"

const saveCartToStorage = (cartItems) => {
    try {
        const cartData = cartItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
            selected: item.selected || false,
        }))
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
    } catch (error) {
        console.error("Failed to save cart to localStorage:", error)
    }
}

const loadCartFromStorage = () => {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY)
        return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
        return []
    }
}

const clearCartStorage = () => {
    try {
        localStorage.removeItem(CART_STORAGE_KEY)
    } catch (error) {
        console.error("Failed to clear cart from localStorage:", error)
    }
}

const CartContext = createContext()

const cartReducer = (state, action) => {
    switch (action.type) {
        case "INIT_CART":
            return { ...state, items: action.payload }
        default:
            return state
    }
}

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [], shippingFee: 30000 })
    const [initialized, setInitialized] = useState(false)
    const [loading, setLoading] = useState(false)
    const isAuthenticated = authService.isAuthenticated()

    // --- INIT CART ---
    useEffect(() => {
        const initCart = async () => {
            setLoading(true)
            if (isAuthenticated) {
                // Nếu vừa đăng nhập, merge cart local lên server
                const localCart = loadCartFromStorage()
                if (localCart.length > 0) {
                    try {
                        await cartApi.mergeCartFromClient(localCart)
                        clearCartStorage()
                    } catch (e) {
                        // Nếu merge lỗi vẫn tiếp tục
                        console.error("Failed to merge cart:", e)
                    }
                }
                // Lấy cart từ API
                try {
                    const res = await cartApi.getCartByUserId()
                    if (res?.success) {
                        const cartItems = res.data.items.map(item => ({
                            product: item.product,
                            quantity: item.quantity,
                            price: item.product.price,
                            selected: item.selected ?? false,
                        }))
                        dispatch({ type: "INIT_CART", payload: cartItems })
                    }
                } catch (e) {
                    console.error("Failed to fetch cart from API:", e)
                }
            } else {
                // Chưa đăng nhập: lấy cart từ localStorage
                let products = []
                try {
                    const res = await getAllProduct()
                    if (res?.success) {
                        products = res.data
                    }
                } catch (e) {
                    console.error("Failed to fetch products for cart:", e)
                }
                const savedCartData = loadCartFromStorage()
                const cartItems = savedCartData
                    .map((savedItem) => {
                        const product = products.find((p) => p._id === savedItem.productId)
                        if (product) {
                            return {
                                product,
                                quantity: savedItem.quantity,
                                price: product.price,
                                selected: savedItem.selected || false,
                            }
                        }
                        return null
                    })
                    .filter(Boolean)
                dispatch({ type: "INIT_CART", payload: cartItems })
            }
            setInitialized(true)
            setLoading(false)
        }
        initCart()
        // eslint-disable-next-line
    }, [isAuthenticated])

    // --- LOCAL STORAGE SYNC ---
    useEffect(() => {
        if (!isAuthenticated && initialized) {
            saveCartToStorage(state.items)
        }
    }, [state.items, initialized, isAuthenticated])

    // --- ACTIONS ---
    const reloadCart = async () => {
        if (isAuthenticated) {
            try {
                const res = await cartApi.getCartByUserId()
                if (res?.success) {
                    const cartItems = res.data.items.map(item => ({
                        product: item.product,
                        quantity: item.quantity,
                        price: item.product.price,
                        selected: item.selected ?? false,
                    }))
                    dispatch({ type: "INIT_CART", payload: cartItems })
                }
            } catch (e) {
                console.error("Failed to reload cart from API:", e)
            }
        } else {
            // local: đã sync qua useEffect phía trên
        }
    }

    const addToCart = async (product) => {
        if (isAuthenticated) {
            await cartApi.addToCart({ productId: product._id, quantity: product.quantity || 1 })
            await reloadCart()
        } else {
            // local
            const existingItem = state.items.find((item) => item.product._id === product._id)
            let newItems
            if (existingItem) {
                newItems = state.items.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                        : item
                )
            } else {
                newItems = [...state.items, { product, quantity: product.quantity || 1, price: product.price }]
            }
            dispatch({ type: "INIT_CART", payload: newItems })
        }
    }

    const removeFromCart = async (productId) => {
        if (isAuthenticated) {
            await cartApi.removeFromCart(productId)
            await reloadCart()
        } else {
            const newItems = state.items.filter((item) => item.product._id !== productId)
            dispatch({ type: "INIT_CART", payload: newItems })
        }
    }

    const updateQuantity = async (productId, quantity) => {
        if (isAuthenticated) {
            if (quantity <= 0) {
                await cartApi.removeFromCart(productId)
            } else {
                await cartApi.updateCart({ productId, quantity })
            }
            await reloadCart()
        } else {
            const newItems = state.items
                .map((item) =>
                    item.product._id === productId
                        ? { ...item, quantity: Math.max(0, quantity) }
                        : item
                )
                .filter((item) => item.quantity > 0)
            dispatch({ type: "INIT_CART", payload: newItems })
        }
    }

    const clearCart = async () => {
        if (isAuthenticated) {
            await cartApi.clearCart()
            await reloadCart()
        } else {
            dispatch({ type: "INIT_CART", payload: [] })
            clearCartStorage()
        }
    }

    const toggleItemSelection = async (productId) => {
        if (isAuthenticated) {
            // Tùy API, có thể cần thêm endpoint update selected
            // Nếu chưa có, chỉ update local state tạm thời

            await cartApi.toggleItemSelection(productId)
            await reloadCart()
        } else {
            const newItems = state.items.map((item) =>
                item.product._id === productId
                    ? { ...item, selected: !item.selected }
                    : item
            )
            dispatch({ type: "INIT_CART", payload: newItems })
        }
    }

    const selectAll = async (selected) => {
        if (isAuthenticated) {
            await cartApi.selectAllItems(selected)
            await reloadCart()
        } else {
            const newItems = state.items.map((item) => ({
                ...item,
                selected: selected,
            }))
            dispatch({ type: "INIT_CART", payload: newItems })
        }
    }

    const getCartTotal = () => {
        return state.items.filter((item) => item.selected).reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getSelectedItems = () => {
        return state.items.filter((item) => item.selected)
    }

    const getTotalItems = () => {
        return state.items.reduce((total, item) => total + item.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{
                cart: state,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                toggleItemSelection,
                selectAll,
                getCartTotal,
                getSelectedItems,
                getTotalItems,
                loading,
                isAuthenticated
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
