import { Navigate, useLocation } from "react-router-dom";
import { isAdminLoggedIn } from "../../utils/adminAuth";

export default function RequireAdmin({ children }) {
    const location = useLocation();

    if (!isAdminLoggedIn()) {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}
