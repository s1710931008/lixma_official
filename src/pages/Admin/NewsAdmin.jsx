import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
    mediaData as localMediaData,
    newsData as localNewsData
} from "../../data/newsData";
import { projectData as localProjectData } from "../../data/projectData";
import { historyData as localHistoryData } from "../../data/historyData";
import { adminFetch, clearAdminToken } from "../../utils/adminAuth";

const API_BASE = "/api/admin/news";
const MEDIA_API_BASE = "/api/admin/media";
const PROJECT_API_BASE = "/api/admin/projects";
const HISTORY_API_BASE = "/api/admin/history";
const PAGE_SIZE = 5;

export default function NewsAdmin({ defaultTab = "news" }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [newsList, setNewsList] = useState([]);
    const [mediaList, setMediaList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mediaLoading, setMediaLoading] = useState(true);
    const [projectLoading, setProjectLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [error, setError] = useState("");
    const [usingLocalData, setUsingLocalData] = useState(false);
    const [pageByTab, setPageByTab] = useState({
        news: 1,
        media: 1,
        projects: 1,
        history: 1
    });

    async function fetchNews() {
        setLoading(true);
        setError("");
        setUsingLocalData(false);

        try {
            const res = await adminFetch(API_BASE);

            if (!res.ok) {
                throw new Error("取得最新消息失敗");
            }

            const data = await res.json();
            setNewsList(Array.isArray(data) ? data : data.items ?? []);
        } catch {
            setError("");
            setNewsList(localNewsData);
            setUsingLocalData(true);
        } finally {
            setLoading(false);
        }
    }

    async function fetchMedia() {
        setMediaLoading(true);

        try {
            const res = await adminFetch(MEDIA_API_BASE);

            if (!res.ok) {
                throw new Error("取得媒體報導失敗");
            }

            const data = await res.json();
            setMediaList(Array.isArray(data) ? data : data.items ?? []);
        } catch {
            setMediaList(localMediaData);
        } finally {
            setMediaLoading(false);
        }
    }

    async function fetchProjects() {
        setProjectLoading(true);

        try {
            const res = await adminFetch(PROJECT_API_BASE);

            if (!res.ok) {
                throw new Error("取得專案實績失敗");
            }

            const data = await res.json();
            setProjectList(Array.isArray(data) ? data : data.items ?? []);
        } catch {
            setProjectList(localProjectData);
        } finally {
            setProjectLoading(false);
        }
    }

    async function fetchHistory() {
        setHistoryLoading(true);

        try {
            const res = await adminFetch(HISTORY_API_BASE);

            if (!res.ok) {
                throw new Error("取得發展歷程失敗");
            }

            const data = await res.json();
            setHistoryList(Array.isArray(data) ? data : data.items ?? []);
        } catch {
            setHistoryList(localHistoryData);
        } finally {
            setHistoryLoading(false);
        }
    }

    async function deleteNews(id) {
        if (usingLocalData) {
            window.alert("目前使用本地資料，需要啟動 API 才能刪除。");
            return;
        }

        const confirmed = window.confirm("確定要刪除這則消息嗎？");

        if (!confirmed) return;

        try {
            const res = await adminFetch(`${API_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("刪除消息失敗");
            }

            fetchNews();
        } catch (err) {
            window.alert(err.message || "刪除消息失敗");
        }
    }

    async function deleteMedia(id) {
        const confirmed = window.confirm("確定要刪除這則媒體報導嗎？");

        if (!confirmed) return;

        try {
            const res = await adminFetch(`${MEDIA_API_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("刪除媒體報導失敗");
            }

            fetchMedia();
        } catch (err) {
            window.alert(err.message || "刪除媒體報導失敗");
        }
    }

    async function deleteProject(id) {
        const confirmed = window.confirm("確定要刪除這個案場嗎？");

        if (!confirmed) return;

        try {
            const res = await adminFetch(`${PROJECT_API_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("刪除案場失敗");
            }

            fetchProjects();
        } catch (err) {
            window.alert(err.message || "刪除案場失敗");
        }
    }

    async function deleteHistory(id) {
        const confirmed = window.confirm("確定要刪除這筆發展歷程嗎？");

        if (!confirmed) return;

        try {
            const res = await adminFetch(`${HISTORY_API_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("刪除發展歷程失敗");
            }

            fetchHistory();
        } catch (err) {
            window.alert(err.message || "刪除發展歷程失敗");
        }
    }

    useEffect(() => {
        fetchNews();
        fetchMedia();
        fetchProjects();
        fetchHistory();
    }, []);

    const currentList =
        activeTab === "news"
            ? newsList
            : activeTab === "media"
              ? mediaList
              : activeTab === "projects"
                ? projectList
                : historyList;
    const currentLoading =
        activeTab === "news"
            ? loading
            : activeTab === "media"
              ? mediaLoading
              : activeTab === "projects"
                ? projectLoading
                : historyLoading;
    const currentPage = pageByTab[activeTab];
    const totalPages = Math.max(1, Math.ceil(currentList.length / PAGE_SIZE));

    const pageStart = currentList.length
        ? (currentPage - 1) * PAGE_SIZE + 1
        : 0;

    const pageEnd = Math.min(currentPage * PAGE_SIZE, currentList.length);

    const pagedList = useMemo(
        () =>
            currentList.slice(
                (currentPage - 1) * PAGE_SIZE,
                currentPage * PAGE_SIZE
            ),
        [currentList, currentPage]
    );

    useEffect(() => {
        if (currentPage <= totalPages) return;

        setPageByTab((current) => ({
            ...current,
            [activeTab]: totalPages
        }));
    }, [activeTab, currentPage, totalPages]);

    function handleTabChange(tab) {
        setActiveTab(tab);
    }

    function handlePageChange(event, value) {
        setPageByTab((current) => ({
            ...current,
            [activeTab]: value
        }));
    }

    function handleLogout() {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 5 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        mb: 3
                    }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={800}>
                            消息管理
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Admin
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button variant="text" onClick={handleLogout}>
                            登出
                        </Button>

                        {activeTab === "news" && (
                            <>
                                <Button variant="outlined" onClick={fetchNews}>
                                    重新載入
                                </Button>

                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/admin/news/create"
                                >
                                    新增消息
                                </Button>
                            </>
                        )}

                        {activeTab === "media" && (
                            <>
                                <Button variant="outlined" onClick={fetchMedia}>
                                    重新載入
                                </Button>

                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/admin/media/create"
                                >
                                    新增媒體報導
                                </Button>
                            </>
                        )}

                        {activeTab === "projects" && (
                            <>
                                <Button variant="outlined" onClick={fetchProjects}>
                                    重新載入
                                </Button>

                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/admin/projects/create"
                                >
                                    新增案場
                                </Button>
                            </>
                        )}

                        {activeTab === "history" && (
                            <>
                                <Button variant="outlined" onClick={fetchHistory}>
                                    重新載入
                                </Button>

                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/admin/history/create"
                                >
                                    新增歷程
                                </Button>
                            </>
                        )}
                    </Stack>
                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        mb: 3,
                        borderBottom: "1px solid #e2e8f0",
                        pb: 1
                    }}
                >
                    <Button
                        variant={activeTab === "news" ? "contained" : "text"}
                        onClick={() => handleTabChange("news")}
                    >
                        最新消息
                    </Button>

                    <Button
                        variant={activeTab === "media" ? "contained" : "text"}
                        onClick={() => handleTabChange("media")}
                    >
                        媒體報導
                    </Button>

                    <Button
                        variant={activeTab === "projects" ? "contained" : "text"}
                        onClick={() => handleTabChange("projects")}
                    >
                        專案實績
                    </Button>

                    <Button
                        variant={activeTab === "history" ? "contained" : "text"}
                        onClick={() => handleTabChange("history")}
                    >
                        發展歷程
                    </Button>
                </Stack>

                {currentLoading && (
                    <Box sx={{ py: 6, color: "text.secondary" }}>
                        載入中...
                    </Box>
                )}

                {!currentLoading && !error && currentList.length === 0 && (
                    <Box
                        sx={{
                            p: 3,
                            border: "1px solid #e2e8f0",
                            borderRadius: 2,
                            color: "text.secondary"
                        }}
                    >
                        目前沒有資料
                    </Box>
                )}

                <Stack spacing={2}>
                    {!currentLoading &&
                        pagedList.map((item) => (
                            <Box
                                key={item.id}
                                sx={{
                                    p: 2.5,
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 2,
                                    bgcolor: "#ffffff",
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md:
                                            activeTab === "projects"
                                                ? "140px 1fr auto"
                                                : "1fr auto"
                                    },
                                    gap: 2,
                                    alignItems: "center"
                                }}
                            >
                                {activeTab === "projects" && item.image && (
                                    <Box
                                        component="img"
                                        src={item.image}
                                        alt={item.title}
                                        sx={{
                                            width: "100%",
                                            height: 90,
                                            borderRadius: 1,
                                            objectFit: "cover",
                                            border: "1px solid #e2e8f0"
                                        }}
                                    />
                                )}

                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        {activeTab === "history"
                                            ? item.year
                                            : item.title}
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        useFlexGap
                                        flexWrap="wrap"
                                        sx={{ mt: 1 }}
                                    >
                                        {activeTab !== "projects" && item.date && (
                                            <Chip
                                                size="small"
                                                label={`日期 ${item.date}`}
                                            />
                                        )}

                                        {item.category && (
                                            <Chip
                                                size="small"
                                                label={`分類 ${item.category}`}
                                            />
                                        )}

                                        {activeTab !== "projects" && item.year && (
                                            <Chip
                                                size="small"
                                                label={
                                                    activeTab === "history"
                                                        ? `年份 ${item.year}`
                                                        : item.year
                                                }
                                            />
                                        )}
                                    </Stack>

                                    {activeTab === "projects" && item.desc && (
                                        <Typography
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >
                                            {item.desc}
                                        </Typography>
                                    )}

                                    {activeTab === "history" && item.text && (
                                        <Typography
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >
                                            {item.text}
                                        </Typography>
                                    )}
                                </Box>

                                {activeTab === "news" ? (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to={`/news/${item.id}?adminReturn=/admin/news`}
                                        >
                                            預覽
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to={`/admin/news/edit/${item.id}`}
                                        >
                                            編輯
                                        </Button>

                                        <Button
                                            color="error"
                                            variant="outlined"
                                            onClick={() =>
                                                deleteNews(item.id)
                                            }
                                        >
                                            刪除
                                        </Button>
                                    </Stack>
                                ) : activeTab === "media" ? (
                                    <Stack direction="row" spacing={1}>
                                        {item.url && (
                                            <Button
                                                variant="outlined"
                                                component="a"
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                開啟
                                            </Button>
                                        )}

                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to={`/admin/media/edit/${item.id}`}
                                        >
                                            編輯
                                        </Button>

                                        <Button
                                            color="error"
                                            variant="outlined"
                                            onClick={() =>
                                                deleteMedia(item.id)
                                            }
                                        >
                                            刪除
                                        </Button>
                                    </Stack>
                                ) : activeTab === "projects" ? (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to="/projects?adminReturn=/admin/projects"
                                        >
                                            預覽
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to={`/admin/projects/edit/${item.id}`}
                                        >
                                            編輯
                                        </Button>

                                        <Button
                                            color="error"
                                            variant="outlined"
                                            onClick={() =>
                                                deleteProject(item.id)
                                            }
                                        >
                                            刪除
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to="/about?adminReturn=/admin/history"
                                        >
                                            預覽
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to={`/admin/history/edit/${item.id}`}
                                        >
                                            編輯
                                        </Button>

                                        <Button
                                            color="error"
                                            variant="outlined"
                                            onClick={() =>
                                                deleteHistory(item.id)
                                            }
                                        >
                                            刪除
                                        </Button>
                                    </Stack>
                                )}
                            </Box>
                        ))}
                </Stack>

                {!currentLoading && currentList.length > PAGE_SIZE && (
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{
                            alignItems: {
                                xs: "flex-start",
                                sm: "center"
                            },
                            justifyContent: "space-between",
                            mt: 3
                        }}
                    >
                        <Typography
                            color="text.secondary"
                            fontWeight={600}
                        >
                            {`顯示 ${pageStart}-${pageEnd} 筆，共 ${currentList.length} 筆`}
                        </Typography>

                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            shape="rounded"
                            color="primary"
                        />
                    </Stack>
                )}
            </Box>
        </Container>
    );
}
