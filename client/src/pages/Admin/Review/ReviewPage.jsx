// app/page.jsx
"use client"

import { useEffect, useState } from "react"
import ReviewManagement from "./components/review-management"
import ServiceReviewManagement from "./components/service-review-management"
import StatsCard from "./components/stats-card"
import { generateFakeReviews, generateFakeServiceReviews, generateFakeStats } from "./lib/fake-data"
import { Package, Star, CheckCircle, LayoutDashboard, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllReviews, getAllReviewService } from "../../../services/commonService"

export default function ReviewPage() {
    // Generate fake data once and pass it down
    // const initialReviews = useState(generateFakeReviews(30))[0]
    const [initialReviews, setInitialReviews] = useState([])
    // const initialServiceReviews = useState(generateFakeServiceReviews(25))[0]
    const [initialServiceReviews, setInitialServiceReviews] = useState([])
    const stats = generateFakeStats(initialReviews, initialServiceReviews)

    const [activeTab, setActiveTab] = useState("reviews") // State to manage active tab
    useEffect(() => {
        const fetchData = async () => {
            try {
                const reviewResponse = await getAllReviews();
                const reviewServiceResponse = await getAllReviewService()
                if (reviewResponse.success) {
                    console.log("API getAllReviews response:", reviewResponse);
                    setInitialReviews(reviewResponse.data);
                } else {
                    console.warn("API getAllReviews returned failure:", reviewResponse.message);
                }

                if (reviewServiceResponse.success) {
                    setInitialServiceReviews(reviewServiceResponse.data)
                }

            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        }
        fetchData()
    }, [])
    console.log();

    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-gray-50">
            <div className="w-full max-w-7xl mx-auto space-y-8">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8 drop-shadow-md">
                    Bảng điều khiển Quản lý Đánh giá
                </h1>

                {/* Statistic Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Tổng số Đánh giá"
                        value={stats.totalReviews}
                        description="Tổng số đánh giá khách hàng"
                        icon={Package}
                    />
                    <StatsCard
                        title="Đánh giá Trung bình"
                        value={stats.averageRating}
                        description="Điểm đánh giá trung bình của khách hàng"
                        icon={Star}
                    />
                    <StatsCard
                        title="Đánh giá Hoạt động"
                        value={stats.activeReviews}
                        description="Số lượng đánh giá đang hoạt động"
                        icon={CheckCircle}
                    />
                    <StatsCard
                        title="Đánh giá Dịch vụ"
                        value={stats.totalServiceReviews}
                        description="Tổng số đánh giá dịch vụ"
                        icon={Settings}
                    />
                </div>

                {/* Tabs for Review Management Sections */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-blue-200 dark:bg-gray-700 rounded-lg p-1 shadow-inner">
                        <TabsTrigger
                            value="reviews"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-200 text-blue-800 dark:text-blue-100"
                        >
                            <LayoutDashboard className="h-4 w-4 mr-2" /> Đánh giá Chung
                        </TabsTrigger>
                        <TabsTrigger
                            value="service-reviews"
                            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-200 text-purple-800 dark:text-purple-100"
                        >
                            <Settings className="h-4 w-4 mr-2" /> Đánh giá Dịch vụ
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="reviews" className="mt-6">
                        <ReviewManagement reviews={initialReviews} />
                    </TabsContent>
                    <TabsContent value="service-reviews" className="mt-6">
                        <ServiceReviewManagement serviceReviews={initialServiceReviews} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}
