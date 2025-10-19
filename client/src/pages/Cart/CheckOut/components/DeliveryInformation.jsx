"use client"

import { User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
// import { fetchProvinces, fetchDistricts, fetchWards } from "../../../services/common/locationService"
import { isValidName, isValidPhone, isValidEmail } from "../../../utils/validation"

export default function DeliveryInformation({ formData, onInputChange, error }) {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    //Lay thong tin tu localStorage neu co, 1 lan khi component mount
    useEffect(() => {
        const storedData = localStorage.getItem("UserInformationCheckOut");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            formData.fullName = parsedData.fullName || "";
            formData.phone = parsedData.phone || "";
            formData.email = parsedData.email || "";
            formData.address = parsedData.address || "";
            formData.deliveryTime = parsedData.deliveryTime || ""
        }
    }, []);


    // // Lấy danh sách tỉnh thành phố khi component mount
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const resProvinces = await getAllProvince();
    //         if (resProvinces) setProvinces(resProvinces);
    //     };
    //     fetchData();
    // }, []);

    // Khi chọn province, gọi API lấy districts và reset district, ward
    useEffect(() => {
        // nếu không chọn province thì reset districts và wards
        if (!formData.province) {
            setDistricts([]);
            setWards([]);
            onInputChange("district", "");
            onInputChange("ward", "");
            return;
        }
        const selectedProvince = provinces.find(p => p.name === formData.province);
        if (selectedProvince) {
            fetchDistricts(selectedProvince.code).then(resDistricts => {
                setDistricts(resDistricts || []);
                onInputChange("district", "");
                onInputChange("ward", "");
                setWards([]);
            });
        }
        // eslint-disable-next-line
    }, [formData.province]);

    // Khi chọn district, gọi API lấy wards và reset ward
    useEffect(() => {
        if (!formData.district) {
            setWards([]);
            onInputChange("ward", "");
            return;
        }
        const selectedDistrict = districts.find(d => d.name === formData.district);
        if (selectedDistrict) {
            fetchWards(selectedDistrict.code).then(resWards => {
                setWards(resWards || []);
                onInputChange("ward", "");
            });
        }
        // eslint-disable-next-line
    }, [formData.district]);


    return (
        <Card className="animate-in slide-in-from-left-5 duration-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Thông Tin Nhận Hàng
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="fullName">Họ tên *</Label>
                    <Input
                        id="fullName"
                        placeholder="Nhập họ và tên"
                        value={formData?.fullName}
                        onChange={(e) => onInputChange("fullName", e.target.value)}
                        className={"mt-1" + (error.fullName ? " border-red-500" : "")}
                    />
                    {error.fullName && (
                        <div className="text-xs text-red-500 mt-1">{error.fullName}</div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="phone">Nhập số điện thoại của bạn *</Label>
                        <Input
                            id="phone"
                            placeholder="Số điện thoại"
                            value={formData?.phone}
                            onChange={(e) => onInputChange("phone", e.target.value)}
                            className={"mt-1" + (error.phone ? " border-red-500" : "")}
                        />
                        {error.phone && (
                            <div className="text-xs text-red-500 mt-1">{error.phone}</div>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={formData?.email}
                            onChange={(e) => onInputChange("email", e.target.value)}
                            className={"mt-1" + (error.email ? " border-red-500" : "")}
                        />
                        {error.email && (
                            <div className="text-xs text-red-500 mt-1">{error.email}</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Tỉnh / Thành Phố</Label>
                        <Select value={formData?.province} onValueChange={(value) => onInputChange("province", value)}>
                            <SelectTrigger className={"mt-1" + (error.province ? " border-red-500" : "")}>
                                <SelectValue placeholder="Chọn tỉnh/thành phố" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces?.map((province) => (
                                    <SelectItem key={province?._id} value={province?.name}>
                                        {province?.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {error.province && (
                            <div className="text-xs text-red-500 mt-1">{error.province}</div>
                        )}
                    </div>
                    <div>
                        <Label>Quận / Huyện</Label>
                        <Select value={formData?.district} onValueChange={(value) => onInputChange("district", value)}>
                            <SelectTrigger className={"mt-1" + (error.district ? " border-red-500" : "")}>
                                <SelectValue placeholder="Chọn quận/huyện" />
                            </SelectTrigger>
                            <SelectContent>
                                {districts.map((district) => (
                                    <SelectItem key={district?._id} value={district?.name}>
                                        {district?.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {error.district && (
                            <div className="text-xs text-red-500 mt-1">{error.district}</div>
                        )}
                    </div>
                    <div>
                        <Label>Xã / Thị trấn</Label>
                        <Select value={formData?.ward} onValueChange={(value) => onInputChange("ward", value)}>
                            <SelectTrigger className={"mt-1" + (error.ward ? " border-red-500" : "")}>
                                <SelectValue placeholder="Chọn xã/thị trấn" />
                            </SelectTrigger>
                            <SelectContent>
                                {wards.map((ward) => (
                                    <SelectItem key={ward?._id} value={ward?.name}>
                                        {ward?.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {error.ward && (
                            <div className="text-xs text-red-500 mt-1">{error.ward}</div>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="address">Địa chỉ / Tên đường *</Label>
                    <Input
                        id="address"
                        placeholder="Nhập địa chỉ chi tiết"
                        value={formData?.address}
                        onChange={(e) => onInputChange("address", e.target.value)}
                        className={"mt-1" + (error.address ? " border-red-500" : "")}
                    />
                    {error.address && (
                        <div className="text-xs text-red-500 mt-1">{error.address}</div>
                    )}
                    <div className="text-xs text-gray-600 text-start mt-1">
                        Địa chỉ chi tiết giúp giao hàng nhanh chóng và chính xác hơn.
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
