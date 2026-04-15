import { Routes, Route } from "react-router-dom";

// pages
import Home from "../pages/Home";

// 路由表（可擴充）
const routes = [
    { path: "/", element: <Home /> },
];

export default function AppRoutes() {
    return (
        <Routes>
            {routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {/* 404 */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    );
}