"use client"

import { useEffect, useState } from "react"
import { Settings } from "lucide-react"
import { getAllSetting } from "../../../services/admin/settingService"
import SettingsTable from "./components/SettingsTable"
import BannerManagement from "./components/BannerManagement"
import { toast } from "react-toastify"

export default function SettingsManagement() {
    const [settings, setSettings] = useState([])

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await getAllSetting()
            if (res.success) {
                setSettings(res.data)
            } else {
                toast.error("Không thể tải danh sách settings")
            }
        }

        fetchSettings()
    }, [])

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Settings className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Quản lý Settings</h1>
                        <p className="text-muted-foreground">Quản lý các cài đặt hệ thống</p>
                    </div>
                </div>
            </div>

            <SettingsTable settings={settings} setSettings={setSettings} />
            <BannerManagement />
        </div>
    )
}
