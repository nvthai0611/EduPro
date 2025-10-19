"use client"

import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function DeliveryTime({ formData, onInputChange }) {
    const deliveryOptions = [
        {
            value: "standard",
            label: "Chỉ giao hàng giờ hành chính (phù hợp với địa chỉ văn phòng/cơ quan)",
        },
        {
            value: "allday",
            label: "Tất cả các ngày trong tuần (phù hợp với địa chỉ nhà riêng, luôn có người nhận hàng)",
        },
        {
            value: "fastdelivery",
            label: "Giao nhanh trong 2h (áp dụng với địa chỉ giao hàng tại Hà Nội và Hồ Chí Minh)",
        },
    ]

    return (
        <Card className="animate-in slide-in-from-left-5 duration-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    Thời Gian Nhận Hàng
                </CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={formData.deliveryTime}
                    onValueChange={(value) => onInputChange("deliveryTime", value)}
                    className="space-y-3"
                >
                    {deliveryOptions.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                            <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                            <div className="flex-1">
                                <Label htmlFor={option.value} className="font-medium cursor-pointer">
                                    {option.label}
                                </Label>
                            </div>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    )
}
