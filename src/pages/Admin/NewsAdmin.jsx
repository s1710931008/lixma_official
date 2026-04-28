import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

const API_BASE = "http://localhost:3000/api/admin/news";
const MEDIA_API_BASE = "http://localhost:3000/api/admin/media";
const PAGE_SIZE = 5;

export default function NewsAdmin() {
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
            const res = await fetch(API_BASE);

            if (!res.ok) {
                throw new Error("Failed to fetch news");
            }

            const data = await res.json();
            setNewsList(Array.isArray(data) ? data : data.items ?? []);
        } catch (err) {
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
            const res = await fetch(MEDIA_API_BASE);

            if (!res.ok) {
                throw new Error("Failed to fetch media reports");
            }

            const data = await res.json();
            setMediaList(Array.isArray(data) ? data : data.items ?? []);
        } catch (err) {
            setMediaList(localMediaData);
        } finally {
            setMediaLoading(false);
        }
    }

    async function deleteNews(id) {
        if (usingLocalData) {
            window.alert(
                "\u76ee\u524d\u4f7f\u7528\u672c\u5730\u8cc7\u6599\uff0c\u9700\u8981\u555f\u52d5 API \u624d\u80fd\u522a\u9664\u3002"
            );
            return;
        }

        const confirmed = window.confirm(
            "\u78ba\u5b9a\u8981\u522a\u9664\u9019\u5247\u6d88\u606f\u55ce\uff1f"
        );

        if (!confirmed) return;

        try {
            const res = await fetch(`${API_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("Failed to delete news");
            }

            fetchNews();
        } catch (err) {
            window.alert(err.message || "Failed to delete news");
        }
    }

    async function deleteMedia(id) {
        const confirmed = window.confirm(
            "\u78ba\u5b9a\u8981\u522a\u9664\u9019\u5247\u5a92\u9ad4\u5831\u5c0e\u55ce\uff1f"
        );

        if (!confirmed) return;

        try {
            const res = await fetch(`${MEDIA_API_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("Failed to delete media report");
            }

            fetchMedia();
        } catch (err) {
            window.alert(err.message || "Failed to delete media report");
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
                            {"\u6d88\u606f\u7ba1\u7406"}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Admin / News
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        {activeTab === "news" && (
                            <>
                                <Button variant="outlined" onClick={fetchNews}>
                                    {"\u91cd\u65b0\u8f09\u5165"}
                                </Button>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/admin/news/create"
                                >
                                    {"\u65b0\u589e\u6d88\u606f"}
                                </Button>
                            </>
                        )}
                        {activeTab === "media" && (
                            <>
                                <Button variant="outlined" onClick={fetchMedia}>
                                    {"\u91cd\u65b0\u8f09\u5165"}
                                </Button>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/admin/media/create"
                                >
                                    {"\u65b0\u589e\u5a92\u9ad4\u5831\u5c0e"}
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
                        {"\u6700\u65b0\u6d88\u606f"}
                    </Button>
                    <Button
                        variant={activeTab === "media" ? "contained" : "text"}
                        onClick={() => handleTabChange("media")}
                    >
                        {"\u5a92\u9ad4\u5831\u5c0e"}
                    </Button>
                </Stack>

                {currentLoading && (
                    <Box sx={{ py: 6, color: "text.secondary" }}>
                        {"\u8f09\u5165\u4e2d..."}
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
                        {"\u76ee\u524d\u6c92\u6709\u6d88\u606f"}
                    </Box>
                )}

                <Stack spacing={2}>
                    {!currentLoading && pagedList.map((item) => (
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
                                <Typography variant="h6" fontWeight={700}>
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
                                            label={`${"\u65e5\u671f"} ${item.date}`}
                                        />
                                    )}
                                    {item.category && (
                                        <Chip
                                            size="small"
                                            label={`${"\u5206\u985e"} ${item.category}`}
                                        />
                                    )}
                                    {item.year && (
                                        <Chip size="small" label={item.year} />
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
                                        {"\u9810\u89bd"}
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to={`/admin/news/edit/${item.id}`}
                                    >
                                        {"\u7de8\u8f2f"}
                                    </Button>

                                    <Button
                                        color="error"
                                        variant="outlined"
                                        onClick={() => deleteNews(item.id)}
                                    >
                                        {"\u522a\u9664"}
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
                                            {"\u958b\u555f"}
                                        </Button>
                                    )}

                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to={`/admin/media/edit/${item.id}`}
                                    >
                                        {"\u7de8\u8f2f"}
                                    </Button>

                                    <Button
                                        color="error"
                                        variant="outlined"
                                        onClick={() => deleteMedia(item.id)}
                                    >
                                        {"\u522a\u9664"}
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
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between",
                            mt: 3
                        }}
                    >
                        <Typography color="text.secondary" fontWeight={600}>
                            {`\u986f\u793a ${pageStart}-${pageEnd} \u7b46\uff0c\u5171 ${currentList.length} \u7b46`}
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
