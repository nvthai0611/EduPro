"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Import components
import DashboardHeader from "./components/DashboardHeader"
import StatsCards from "./components/StatsCards"
import ChartFilters from "./components/ChartFilters"
import ChartsSection from "./components/ChartsSection"
import OrderFilters from "./components/OrderFilters"
import OrderTable from "./components/OrderTable"
import Pagination from "./components/Pagination"
import OrderDetailModal from "./components/OrderDetailModal"

// Import utilities
import { generateFakeData } from "./lib/fakeData"
import { formatCurrency } from "./lib/formatters"
// import { getAllOrders, updateStatusShippingOrder } from "../../../services/admin/dashboardService"
import { toast, ToastContainer } from "react-toastify"
// Removed: import socket from "../../../utils/socket"
// Removed: import useNotificationStore from "../../../stores/zustand/notificationStore"

export default function OrderDashboard() {
    const [orders, setOrders] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [dateFilter, setDateFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [monthFilter, setMonthFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingOrder, setEditingOrder] = useState(null)
    const [yearFilter, setYearFilter] = useState("all")

    // Sử dụng useCallback để memoize fetchData, tránh re-render không cần thiết
    // const fetchData = useCallback(async () => {
    //     const orderResponse = await getAllOrders();
    //     if (orderResponse.success) {
    //         setOrders(orderResponse.data);
    //     }
    // }, []); // Không có dependencies vì nó chỉ gọi API tĩnh

    useEffect(() => {
        fetchData(); // Gọi fetchData khi component mount lần đầu
    }, [fetchData]); // `fetchData` là dependency vì nó được định nghĩa bên ngoài useEffect

    // Removed: useEffect for socket connection and listeners
    /*
    useEffect(() => {
        // Access the addNotification function from your Zustand store
        const { addNotification } = useNotificationStore.getState();

        socket.connect(); // Connect the socket

        socket.on("connect", () => {
            console.log("Admin socket connected:", socket.id); // Use socket.id directly
            socket.emit("joinRoom", { role: "admin" }); // Join the correct room
        });

        socket.on("admin_new_order", (orderData) => {
            console.log("🎉 Admin nhận đơn hàng mới:", orderData);

            // Create a notification object with relevant data
            const newNotification = {
                id: orderData.orderCode || Date.now(), // Use orderCode as ID or a timestamp
                type: "new_order",
                title: `🛍️ Đơn hàng mới từ khách: ${orderData.userName}`,
                message: `🧾 Mã đơn: ${orderData.orderCode}`,
                timestamp: new Date().toISOString(), // Add a timestamp
                orderData: orderData // Store full order data if needed
            };

            // Add the new notification to the Zustand store
            addNotification(newNotification);

            // Show a toast notification
            toast.info(newNotification.title);
            // Khi nhận được thông báo đơn hàng mới qua socket, gọi lại API để cập nhật danh sách đơn hàng
            fetchData(); // <--- Gọi lại fetchData ở đây
        });

        return () => {
            socket.off("connect");
            socket.off("admin_new_order");
        };
    }, [fetchData]);
    */

    // Filter orders
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                order?.orderCode?.toString()?.includes(searchTerm) ||
                order?.UserId?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                order?.UserId?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())

            const matchesStatus = statusFilter === "all" || order.statusOrder === statusFilter

            let matchesDate = true
            if (dateFilter !== "all") {
                const orderDate = new Date(order.createdAt)
                const now = new Date()

                switch (dateFilter) {
                    case "today":
                        matchesDate = orderDate?.toDateString() === now.toDateString()
                        break
                    case "week":
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                        matchesDate = orderDate >= weekAgo
                        break
                    case "month":
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                        matchesDate = orderDate >= monthAgo
                        break
                }
            }

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [orders, searchTerm, statusFilter, dateFilter])

    // Calculate statistics
    const stats = useMemo(() => {
        const totalOrders = filteredOrders?.length;

        const totalRevenue = filteredOrders?.reduce((sum, order) => {
            return order.statusShipping === "delivered"
                ? sum + order.totalAmount
                : sum;
        }, 0);

        const completedOrders = filteredOrders?.filter((order) => order.statusShipping === "delivered").length;

        const uniqueCustomers = new Set(
            filteredOrders?.map((order) => order?.UserId._id)
        )?.size;

        return {
            totalOrders,
            totalRevenue,
            completedOrders,
            uniqueCustomers,
        };
    }, [filteredOrders]);
    // Pagination calculations
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    // Reset to first page when filters change
    useMemo(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter, dateFilter])

    const monthlyChartData = useMemo(() => {
        let ordersToProcess = orders;

        // Apply month and year filter to chart data
        if (monthFilter !== "all" || yearFilter !== "all") {
            ordersToProcess = orders.filter((order) => {
                const orderDate = new Date(order.createdAt);
                const orderMonth = orderDate.getMonth() + 1;
                const orderYear = orderDate.getFullYear().toString();

                const matchesMonth = monthFilter === "all" || orderMonth.toString() === monthFilter;
                const matchesYear = yearFilter === "all" || orderYear === yearFilter;

                return matchesMonth && matchesYear;
            });
        }

        // ✅ Filter chỉ lấy các đơn đã giao và đã thanh toán
        ordersToProcess = ordersToProcess.filter(
            (order) => order.statusShipping === "delivered"
        );

        const monthlyData = {};
        ordersToProcess.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const monthLabel = orderDate.toLocaleDateString("vi-VN", {
                month: "short",
                year: "numeric",
            });
            const sortKey = orderDate.getFullYear() * 100 + (orderDate.getMonth() + 1);

            if (!monthlyData[sortKey]) {
                monthlyData[sortKey] = { month: monthLabel, orders: 0, revenue: 0, sortKey };
            }
            monthlyData[sortKey].orders += 1;
            monthlyData[sortKey].revenue += order.totalAmount;
        });

        return Object.values(monthlyData).sort((a, b) => a.sortKey - b.sortKey);
    }, [orders, monthFilter, yearFilter]);

    const statusChartData = useMemo(() => {
        let ordersToProcess = orders

        // Only use chart filters (month and year), not table filters
        if (monthFilter !== "all" || yearFilter !== "all") {
            ordersToProcess = orders.filter((order) => {
                const orderDate = new Date(order.createdAt)
                const orderMonth = orderDate.getMonth() + 1
                const orderYear = orderDate.getFullYear().toString()

                const matchesMonth = monthFilter === "all" || orderMonth.toString() === monthFilter
                const matchesYear = yearFilter === "all" || orderYear === yearFilter

                return matchesMonth && matchesYear
            })
        }

        const statusCounts = {}
        ordersToProcess.forEach((order) => {
            statusCounts[order.statusOrder] = (statusCounts[order.statusOrder] || 0) + 1
        })

        return Object.entries(statusCounts).map(([status, count]) => ({
            name: status,
            value: count,
        }))
    }, [orders, monthFilter, yearFilter])

    const handleViewDetail = (order) => {
        setSelectedOrder(order)
        setIsDetailModalOpen(true)
        setIsEditMode(false)
    }

    const handleEditOrder = (order) => {
        console.log("order", order);

        setEditingOrder({ ...order })
        setIsEditMode(true)
    }

    const handleSaveOrder = async (orderToSave) => { // Accept the order to save as an argument
        try {
            console.log("Saving order:", orderToSave) // Use orderToSave here
            // const result = await updateStatusShippingOrder(orderToSave.UserId._id, orderToSave.orderCode, orderToSave.statusShipping)
            console.log("result", result);

            if (result.success) {
                const updatedOrders = orders.map((order) => (order._id === result.data._id ? result.data : order)) // Use result.data for the updated order
                setOrders(updatedOrders)
                setSelectedOrder(result.data) // Update selectedOrder to reflect changes in view mode
                toast.success(result.message)
                setIsEditMode(false) // Exit edit mode on successful save
                setEditingOrder(null) // Clear editing order
            } else {
                toast.error(result.message || "Failed to update order.")
            }
        } catch (error) {
            console.error("Error saving order:", error)
            toast.error(error.message || "An unexpected error occurred.")
        }
    }

    const handleCancelEdit = () => {
        setIsEditMode(false)
        setEditingOrder(null)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick />
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <DashboardHeader />

                {/* Stats Cards */}
                <StatsCards stats={stats} formatCurrency={formatCurrency} />

                {/* Charts */}
                <ChartFilters
                    yearFilter={yearFilter}
                    setYearFilter={setYearFilter}
                    monthFilter={monthFilter}
                    setMonthFilter={setMonthFilter}
                />
                <ChartsSection
                    monthlyChartData={monthlyChartData}
                    statusChartData={statusChartData}
                    formatCurrency={formatCurrency}
                />

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách đơn hàng</CardTitle>
                        <CardDescription>Quản lý và theo dõi tất cả đơn hàng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrderFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            dateFilter={dateFilter}
                            setDateFilter={setDateFilter}
                        />

                        <OrderTable
                            paginatedOrders={paginatedOrders}
                            formatCurrency={formatCurrency}
                            handleViewDetail={handleViewDetail}
                        />

                        <Pagination
                            filteredOrders={filteredOrders}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            totalPages={totalPages}
                            startIndex={startIndex}
                            endIndex={endIndex}
                        />

                        {paginatedOrders.length === 0 && filteredOrders.length === 0 && (
                            <div className="text-center py-8 text-gray-500">Không tìm thấy đơn hàng nào phù hợp với bộ lọc</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Detail Modal */}
            <OrderDetailModal
                isDetailModalOpen={isDetailModalOpen}
                selectedOrder={selectedOrder}
                isEditMode={isEditMode}
                editingOrder={editingOrder}
                formatCurrency={formatCurrency}
                handleEditOrder={handleEditOrder}
                handleSaveOrder={handleSaveOrder}
                handleCancelEdit={handleCancelEdit}
                setIsDetailModalOpen={setIsDetailModalOpen}
                setIsEditMode={setIsEditMode}
                setEditingOrder={setEditingOrder} // Pass setEditingOrder here
            />
        </div>
    )
}