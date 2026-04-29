import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Trash2, Upload } from "lucide-react";
import { projectData } from "../../data/projectData";
import { adminFetch } from "../../utils/adminAuth";
import { resizeImageFile } from "../../utils/imageUpload";

const API_BASE = "http://localhost:3000/api/admin/projects";

const emptyForm = {
    title: "",
    desc: "",
    category: "",
    image: ""
};

function toFormData(item) {
    return {
        ...emptyForm,
        ...item
    };
}

async function getResponseError(res, fallback) {
    try {
        const data = await res.json();
        return data.message || fallback;
    } catch {
        return fallback;
    }
}

export default function ProjectForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const title = useMemo(
        () => (isEdit ? "編輯案場" : "新增案場"),
        [isEdit]
    );

    function updateField(name, value) {
        setForm((current) => ({
            ...current,
            [name]: value
        }));
    }

    async function handleImageUpload(event) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        setUploading(true);
        setMessage("");

        try {
            const imageData = await resizeImageFile(file);
            updateField("image", imageData);
        } catch (err) {
            setMessage(err.message || "案場照片上傳失敗");
        } finally {
            setUploading(false);
        }
    }

    useEffect(() => {
        if (!isEdit) return;

        async function fetchProject() {
            setLoading(true);
            setMessage("");

            try {
                const res = await adminFetch(`${API_BASE}/${id}`);

                if (!res.ok) {
                    throw new Error("取得案場失敗");
                }

                const data = await res.json();
                setForm(toFormData(data));
            } catch (err) {
                const localItem = projectData.find(
                    (item) => String(item.id) === id
                );

                if (localItem) {
                    setForm(toFormData(localItem));
                } else {
                    setMessage(err.message || "取得案場失敗");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [id, isEdit]);

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await adminFetch(
                isEdit ? `${API_BASE}/${id}` : API_BASE,
                {
                    method: isEdit ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            if (!res.ok) {
                throw new Error(await getResponseError(res, "儲存案場失敗"));
            }

            navigate("/admin/projects");
        } catch (err) {
            setMessage(err.message || "儲存案場失敗");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 5, color: "text.secondary" }}>
                    載入中...
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box component="form" onSubmit={handleSubmit} sx={{ py: 5 }}>
                <Stack spacing={3}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between"
                        }}
                    >
                        <Box>
                            <Typography variant="h4" fontWeight={800}>
                                {title}
                            </Typography>

                            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                Admin / Projects
                            </Typography>
                        </Box>

                        <Button component={Link} to="/admin/projects">
                            返回列表
                        </Button>
                    </Stack>

                    {message && <Alert severity="warning">{message}</Alert>}

                    <TextField
                        label="案場標題"
                        value={form.title}
                        onChange={(event) =>
                            updateField("title", event.target.value)
                        }
                        required
                        fullWidth
                    />

                    <TextField
                        label="分類"
                        value={form.category}
                        onChange={(event) =>
                            updateField("category", event.target.value)
                        }
                        fullWidth
                    />

                    <TextField
                        label="介紹"
                        value={form.desc}
                        onChange={(event) =>
                            updateField("desc", event.target.value)
                        }
                        multiline
                        minRows={4}
                        fullWidth
                    />

                    <Box
                        sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 2,
                            p: { xs: 2, sm: 2.5 },
                            bgcolor: "#ffffff"
                        }}
                    >
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="h6" fontWeight={800}>
                                    案場照片
                                </Typography>

                                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                    可貼圖片 URL，也可自行上傳照片。
                                </Typography>
                            </Box>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{ alignItems: "flex-start" }}
                            >
                                <TextField
                                    label="圖片 URL"
                                    value={form.image}
                                    onChange={(event) =>
                                        updateField("image", event.target.value)
                                    }
                                    fullWidth
                                />

                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<Upload size={18} />}
                                    disabled={uploading}
                                    sx={{ minWidth: 150, py: 1.65 }}
                                >
                                    {uploading ? "處理中..." : "上傳照片"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                            </Stack>

                            {form.image && (
                                <Box>
                                    <Box
                                        component="img"
                                        src={form.image}
                                        alt="案場照片預覽"
                                        sx={{
                                            width: "100%",
                                            maxHeight: 320,
                                            borderRadius: 2,
                                            border: "1px solid #e2e8f0",
                                            bgcolor: "#f8fafc",
                                            objectFit: "cover"
                                        }}
                                    />

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ justifyContent: "flex-end", mt: 1 }}
                                    >
                                        <Button
                                            type="button"
                                            color="error"
                                            variant="outlined"
                                            startIcon={<Trash2 size={18} />}
                                            onClick={() => updateField("image", "")}
                                        >
                                            刪除照片
                                        </Button>
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button component={Link} to="/admin/projects">
                            取消
                        </Button>

                        <Button type="submit" variant="contained" disabled={saving}>
                            {saving ? "儲存中..." : "儲存"}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    );
}
