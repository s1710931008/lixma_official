import { Routes, Route } from "react-router-dom";

// pages
import Home from "../pages/Home";
import News from "../pages/News";
import NewsDetail from "../pages/News/NewsDetail";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Contact from "../pages/Contact";
import SolarCalculator from "../pages/SolarCalculator";
import NewsAdmin from "../pages/Admin/NewsAdmin";
import NewsForm from "../pages/Admin/NewsForm";
import MediaForm from "../pages/Admin/MediaForm";

// 路由表（可擴充）
const routes = [
    { path: "/", element: <Home /> },
    { path: "/news", element: <News /> },
    { path: "/news/:id", element: <NewsDetail /> },
    { path: "/about", element: <About /> },
    { path: "/projects", element: <Projects /> },
    { path: "/contact", element: <Contact /> },
    { path: "/solar-calculator", element: <SolarCalculator /> },
    { path: "/admin/news", element: <NewsAdmin /> },
    { path: "/admin/news/create", element: <NewsForm /> },
    { path: "/admin/news/edit/:id", element: <NewsForm /> },
    { path: "/admin/media/create", element: <MediaForm /> },
    { path: "/admin/media/edit/:id", element: <MediaForm /> }
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
