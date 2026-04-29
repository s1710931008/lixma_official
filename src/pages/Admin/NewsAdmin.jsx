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
import { adminFetch, clearAdminToken } from "../../utils/adminAuth";

const API_BASE = "http://localhost:3000/api/admin/news";
const MEDIA_API_BASE = "http://localhost:3000/api/admin/media";
const PAGE_SIZE = 5;

export default function NewsAdmin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("news");
    const [newsList, setNewsList] = useState([]);
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mediaLoading, setMediaLoading] = useState(true);
    const [error, setError] = useState("");
    const [usingLocalData, setUsingLocalData] = useState(false);
    const [pageByTab, setPageByTab] = useState({
        news: 1,
        media: 1
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

    useEffect(() => {
        fetchNews();
        fetchMedia();
    }, []);

    const currentList = activeTab === "news" ? newsList : mediaList;
    const currentLoading = activeTab === "news" ? loading : mediaLoading;
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
                            Admin / News
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
                        目前沒有消息
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
                                        md: "1fr auto"
                                    },
                                    gap: 2,
                                    alignItems: "center"
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        useFlexGap
                                        flexWrap="wrap"
                                        sx={{ mt: 1 }}
                                    >
                                        {item.date && (
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

                                        {item.year && (
                                            <Chip
                                                size="small"
                                                label={item.year}
                                            />
                                        )}
                                    </Stack>
                                </Box>

                                {activeTab === "news" ? (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            component={Link}
                                            to={`/news/${item.id}`}
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
                                ) : (
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
