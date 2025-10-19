import { ChevronRight } from "lucide-react"

export default function Breadcrumb() {
    return (
        <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center text-sm text-gray-600">
                    <span>Trang chủ</span>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-gray-900 font-medium">Thanh toán</span>
                </div>
            </div>
        </div>
    )
}
