import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { projectData } from "../../data/projectData";
import { adminFetch } from "../../utils/adminAuth";

const API_BASE = "/api/admin/projects";

export default function ProjectAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchProjects() {
        setLoading(true);

        try {
            const res = await adminFetch(API_BASE);

            if (!res.ok) {
                throw new Error("取得專案實績失敗");
            }

            const data = await res.json();
            setItems(Array.isArray(data) ? data : data.items ?? []);
        } catch {
            setItems(projectData);
        } finally {
            setLoading(false);
        }
    }

    async function deleteProject(id) {
        const confirmed = window.confirm("確定要刪除這個案場嗎？");

        if (!confirmed) return;

        try {
            const res = await adminFetch(`${API_BASE}/${id}`, {
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

    useEffect(() => {
        fetchProjects();
    }, []);

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
                            專案實績管理
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Admin / Projects
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="text"
                            component={Link}
                            to="/admin/news"
                        >
                            消息管理
                        </Button>

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
                    </Stack>
                </Stack>

                {loading && (
                    <Box sx={{ py: 6, color: "text.secondary" }}>
                        載入中...
                    </Box>
                )}

                <Stack spacing={2}>
                    {!loading &&
                        items.map((item) => (
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
                                        md: "140px 1fr auto"
                                    },
                                    gap: 2,
                                    alignItems: "center"
                                }}
                            >
                                {item.image && (
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
                                    <Typography variant="h6" fontWeight={700}>
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        {item.desc}
                                    </Typography>

                                    {item.category && (
                                        <Chip
                                            size="small"
                                            label={item.category}
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                </Box>

                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to="/projects"
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
                                        onClick={() => deleteProject(item.id)}
                                    >
                                        刪除
                                    </Button>
                                </Stack>
                            </Box>
                        ))}
                </Stack>
            </Box>
        </Container>
    );
}
