import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { verifyEmail as verifyEmailAPI } from "../../../services/admin/userService";

const EmailVerifiedSuccess = () => {
    const { id } = useParams();
    const [success, setSuccess] = useState(null); // true | false | null
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await verifyEmailAPI(id);
                if (response.data.success) {
                    setSuccess(true);
                    setMessage("Tài khoản của bạn đã được xác thực. Bây giờ bạn có thể đăng nhập.");
                } else {
                    setSuccess(false);
                    setMessage(response.data.message || "Xác thực tài khoản thất bại.");
                }
            } catch (error) {
                setSuccess(false);
                setMessage(
                    error.response?.data?.message || "Đã xảy ra lỗi trong quá trình xác thực."
                );
            }
        };
        verifyEmail();
    }, [id]);

    const handleGoToLogin = () => {
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white p-4">
            <Card className="w-full max-w-md shadow-xl border-green-500">
                <CardContent className="flex flex-col items-center justify-center text-center p-8">
                    {success === null ? (
                        <p className="text-gray-600">Loading verifying ...</p>
                    ) : success ? (
                        <>
                            <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Verify email successfully !</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <Button onClick={handleGoToLogin} className="w-full">
                                Go to home page
                            </Button>
                        </>
                    ) : (
                        <>
                            <XCircle className="text-red-600 w-16 h-16 mb-4" />
                            <h2 className="text-2xl font-bold mb-2 text-red-700">Verify email failed !</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <Button onClick={() => { window.location.href = "/" }} className="w-full">
                                Go to home page
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailVerifiedSuccess;
