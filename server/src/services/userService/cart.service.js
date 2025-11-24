const Cart = require("../../models/order.model");
const Product = require("../../models/product.model");
const Checkout = require('../../models/checkout.model');
const TempOrder = require('../../models/temp_order.model');
const PayOS = require("@payos/node");
require("dotenv").config();
const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY)

const mongoose = require('mongoose');

const getCartByUserId = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid User ID');
    }

    let cart = await Cart.findOne({
        UserId: userId,
        statusOrder: 'processing'
    }).populate('items.product');

    if (!cart) {
        cart = new Cart({
            UserId: userId,
            items: [],
            statusOrder: 'processing',
            statusShipping: 'pending',
            shippingFee: 0,
            deliveryTime: 'standard'
        });
        await cart.save();
    }

    return cart;
};

const addToCart = async (userId, productId, quantity = 1) => {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid ID');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }

    let cart = await getCartByUserId(userId);
    const existingItemIndex = cart.items.findIndex(
        item => item.product._id.toString() === productId
    );
    if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({
            product: productId,
            quantity,
            price: product.price,
            selected: false
        });
    }

    await calculateCartTotal(cart);
    return await cart.save();
};

const updateCart = async (userId, productId, quantity) => {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid ID');
    }

    if (quantity <= 0) {
        return await removeFromCart(userId, productId);
    }

    const cart = await getCartByUserId(userId);
    const itemIndex = cart.items.findIndex(item => item.product._id?.toString() === productId);

    if (itemIndex === -1) {
        throw new Error('Product not found in cart');
    }

    cart.items[itemIndex].quantity = quantity;
    await calculateCartTotal(cart);
    return await cart.save();
};

const removeFromCart = async (userId, productId) => {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid ID');
    }

    const checkProduct = await Product.findById(productId);
    if (!checkProduct) {
        throw new Error('Product not found');
    }

    const cart = await getCartByUserId(userId);

    cart.items = cart.items.filter(item => item.product._id.toString() !== productId);
    await calculateCartTotal(cart);
    return await cart.save();
};

const mergeCartFromClient = async (userId, localCartItems = []) => {
    if (!mongoose.Types.ObjectId.isValid(userId) || !Array.isArray(localCartItems)) {
        throw new Error('Invalid input');
    }

    let cart = await Cart.findOne({ UserId: userId, statusOrder: 'processing' });

    if (!cart) {
        cart = new Cart({
            UserId: userId,
            items: [],
            statusOrder: 'processing',
            shippingFee: 30000,
        });
    }

    for (const item of localCartItems) {
        const { productId, quantity = 1, selected = false } = item;
        if (!mongoose.Types.ObjectId.isValid(productId) || quantity <= 0) continue;

        const product = await Product.findById(productId);
        if (!product) continue;

        const existingItemIndex = cart.items.findIndex(i => i.product._id.toString() === productId);
        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].selected = selected;
        } else {
            cart.items.push({
                product: product._id,
                quantity,
                price: product.price,
                selected
            });
        }
    }

    await cart.save();
    return cart;
};

const checkoutSelectedItems = async (userId, checkoutData) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid User ID');
    }


    const cart = await Cart.findOne({ UserId: userId, statusOrder: 'processing' });
    if (!cart) throw new Error('Cart not found');

    const selectedItems = cart.items.filter(item => item.selected === true);
    if (!selectedItems) throw new Error('No items selected');

    if (selectedItems.length === 0) throw new Error('No items selected');

    const totalAmount = selectedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const shippingFee = checkoutData.shippingFee || 0;
    const orderCode = Number(String(Date.now()).slice(-10));
    const checkout = new Checkout({
        UserId: userId,
        items: selectedItems,
        totalAmount: totalAmount + shippingFee,
        shippingFee,
        shippingAddress: checkoutData.shippingAddress,
        note: checkoutData.note || '',
        deliveryTime: checkoutData.deliveryTime || 'standard',
        statusOrder: 'pending',
        statusShipping: 'pending',
        orderCode
    });

    await checkout.save();
    cart.items = cart.items.filter(item => !item.selected);
    await cart.save();

    return checkout;
};

const toggleItemSelection = async (userId, productId) => {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid ID');
    }

    const cart = await getCartByUserId(userId);
    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

    if (itemIndex === -1) {
        throw new Error('Product not found in cart');
    }

    cart.items[itemIndex].selected = !cart.items[itemIndex].selected;
    await cart.save();
    return cart;
};

const selectAllItems = async (userId, selected) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid User ID');
    }

    const cart = await getCartByUserId(userId);
    cart.items = cart.items.map(item => ({ ...item.toObject(), selected }));
    await cart.save();
    return cart;
};

const clearCart = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid User ID');
    }

    const cart = await Cart.findOneAndUpdate(
        { UserId: userId, statusOrder: 'processing' },
        { items: [], totalAmount: 0 },
        { new: true }
    );

    if (!cart) {
        throw new Error('No processing cart found for user');
    }

    return cart;
};

const calculateCartTotal = async (cart) => {
    let total = 0;

    for (const item of cart.items) {
        if (typeof item.product === 'string') {
            const product = await Product.findById(item.product);
            if (product) {
                item.price = product.price;
            }
        }
        total += item.quantity * item.price;
    }

    cart.totalAmount = total + (cart.shippingFee || 0);
};

const getCheckoutByUserId = async (userId, orderCode) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid User ID');
    }
    const checkout = await Checkout.findOne({ UserId: userId, orderCode: orderCode }).populate('items.product').populate({ path: 'UserId', select: 'fullName email phoneNumber _id' });
    if (!checkout) throw new Error('Checkout not found');
    return checkout;
}

// Tạo link thanh toán PayOS cho các item đã chọn
const createPayosPaymentLink = async (userId, checkoutData) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid User ID');
    }
    if (checkoutData.shippingAddress === ', , , ') throw new Error('Địa chỉ giao hàng không được trống');
    if (checkoutData.deliveryTime === '') throw new Error('Thời gian giao hàng không được trống');
    if (checkoutData.fullName === '') throw new Error('Tên khách hàng không được trống');
    if (checkoutData.phoneNumber === '') throw new Error('Số điện thoại không được trống');
    if (checkoutData.email === '') throw new Error('Email không được trống');

    const cart = await Cart.findOne({ UserId: userId, statusOrder: 'processing' });
    if (!cart) throw new Error('Cart not found');

    const selectedItems = cart.items.filter(item => item.selected === true);
    if (selectedItems.length === 0) throw new Error('No items selected');

    const totalAmount = selectedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const shippingFee = checkoutData.shippingFee || 0;
    // const finalAmount = 2000;
    const finalAmount = totalAmount + shippingFee;
    const orderCode = Number(String(Date.now()).slice(-10));

    // Lưu thông tin tạm để xử lý trong webhook
    await TempOrder.create({
        orderCode,
        userId,
        shippingAddress: checkoutData.shippingAddress,
        note: checkoutData.note,
        deliveryTime: checkoutData.deliveryTime || 'standard',
        shippingFee
    });

    const body = {
        orderCode,
        amount: finalAmount,
        description: 'Paymentforproduct',
        returnUrl: process.env.FRONTEND_URL + "/shop/success",
        cancelUrl: process.env.FRONTEND_URL + "/shop/checkout",
        webhookUrl: process.env.PAYOS_WEBHOOK_URL,
    };

    const paymentLinkResponse = await payos.createPaymentLink(body);
    return paymentLinkResponse.checkoutUrl;
};

// Xử lý callback trả về từ PayOS
const handlePayosWebhook = async (webhookBody) => {
    const { orderCode, description, code } = webhookBody.data;
    if (!description.includes('Paymentforproduct')) {
        throw new Error("Unsupported payment type");
    }
    const tempOrder = await TempOrder.findOne({ orderCode });
    if (!tempOrder) throw new Error("Temp order not found");

    const { userId, shippingAddress, note, deliveryTime, shippingFee } = tempOrder;

    if (code == '00') {
        const cart = await Cart.findOne({ UserId: userId, statusOrder: 'processing' });
        if (!cart) throw new Error('Cart not found');

        const selectedItems = cart.items.filter(item => item.selected === true);
        if (selectedItems.length === 0) throw new Error('No items selected');

        const totalAmount = selectedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

        const checkout = new Checkout({
            UserId: userId,
            items: selectedItems,
            totalAmount: totalAmount + shippingFee,
            shippingFee,
            shippingAddress,
            note,
            deliveryTime,
            statusOrder: 'paid',
            statusShipping: 'pending',
            orderCode
        });
        console.log("Thanh toán thành công");

        await checkout.save();

        // Xoá item đã chọn trong giỏ
        cart.items = cart.items.filter(item => !item.selected);
        await cart.save();

        // Xoá bản ghi tạm
        await TempOrder.deleteOne({ orderCode });

        return checkout;
    } else if (code !== '00') {
        await TempOrder.deleteOne({ orderCode });
        return null;
    }
};

module.exports = {
    getCartByUserId,
    addToCart,
    updateCart,
    removeFromCart,
    mergeCartFromClient,
    clearCart,
    checkoutSelectedItems,
    toggleItemSelection,
    selectAllItems,
    handlePayosWebhook,
    createPayosPaymentLink,
    getCheckoutByUserId
};
