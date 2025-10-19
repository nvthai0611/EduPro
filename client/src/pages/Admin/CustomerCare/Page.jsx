"use client"

import { useState, useEffect } from "react"
import UserBookingDashboard from "./components/user-booking-dashboard"
import { getAllBooking, getAllCoupons, getAllCouponsUser, getAllCustomer } from "../../../services/admin/customer_careService"

// Fake data generation
export default function CustomerCare() {
    // const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [bookings, setBookings] = useState([])
    const [coupons, setCoupons] = useState([])
    const [userCoupons, setUserCoupons] = useState([])
    useEffect(() => {
        // Simulate API call delay
        const fetchData = async () => {
            const getAllCustomers = await getAllCustomer()
            const getAllBookings = await getAllBooking()
            const getAllCoupon = await getAllCoupons()
            const getAllUserCoupon = await getAllCouponsUser()
            if (getAllCustomers.success) {
                setUsers(getAllCustomers.data)
            }

            if (getAllBookings.success) {
                setBookings(getAllBookings.data)
            }

            if (getAllCoupon.success) {
                setCoupons(getAllCoupon.data)
            }
            if (getAllUserCoupon.success) {
                setUserCoupons(getAllUserCoupon.data)
            }
            setLoading(false)
        }

        fetchData()
    }, [])

    const data = {
        users,
        bookings,
        coupons,
        userCoupons
    }

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <UserBookingDashboard data={data} />
        </div>
    )
}
