"use client"

import { MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function OrderNotes({ formData, onInputChange }) {
    return (
        <Card className="animate-in slide-in-from-left-5 duration-900">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    Ghi Chú Đơn Hàng
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Lời nhắn cho người bán"
                    value={formData.note}
                    onChange={(e) => onInputChange("note", e.target.value)}
                    className="min-h-[100px]"
                />
            </CardContent>
        </Card>
    )
}
