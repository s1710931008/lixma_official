import { Routes, Route } from "react-router-dom";

// pages
import Home from "../pages/Home";
import News from "../pages/News";
import NewsDetail from "../pages/News/NewsDetail";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Contact from "../pages/Contact";

// 路由表（可擴充）
const routes = [
    { path: "/", element: <Home /> },
    { path: "/news", element: <News /> },
    { path: "/news/:id", element: <NewsDetail /> },
    { path: "/about", element: <About /> },
    { path: "/projects", element: <Projects /> },
    { path: "/contact", element: <Contact /> },
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