import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AUTH_TOKEN, TYPE_AUTH } from "../constains/auth";

const RoleRedirectMiddleware = () => {
    const [redirectPath, setRedirectPath] = useState(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const token = Cookies.get(AUTH_TOKEN.ACCESS_TOKEN);
       
        if (!token) {
            setIsChecking(false);
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const role = decoded.role;
            // Nếu là staff/admin thì redirect ngay
            if (role === TYPE_AUTH.ADMIN) {
                setRedirectPath("/admin/dashboard");
            } else if (role === TYPE_AUTH.STAFF ) {
                setRedirectPath("/staff/schedule");
            } else if(role === TYPE_AUTH.MANAGER){
                setRedirectPath("/staff/dashboard");
            }
            else {
                // user/customer cho đi tiếp (ở public pages)
                setRedirectPath(null);
            }
        } catch (error) {
            // Token không hợp lệ -> xóa token hoặc redirect login
            setRedirectPath("/dang-nhap");
        } finally {
            setIsChecking(false);
        }
    }, []);

    if (isChecking) return null; // loading spinner

    if (redirectPath) {
        return <Navigate to={redirectPath} replace />
    }

    return <Outlet />;
};

export default RoleRedirectMiddleware;
