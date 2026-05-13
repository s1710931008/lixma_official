import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { mediaData as localMediaData } from "../../data/newsData";
import { adminFetch } from "../../utils/adminAuth";

const API_BASE = "/api/admin/media";

const noDateAnimationSx = {
    "& .MuiInputBase-root, & .MuiInputBase-input, & .MuiInputLabel-root, & .MuiOutlinedInput-notchedOutline":
    {
        transition: "none"
    }
};

const emptyForm = {
    title: "",
    date: "",
    year: "",
    source: "",
    url: ""
};

function toFormData(item) {
    return {
        ...emptyForm,
        ...item,
        year: item.year || String(item.date || "").slice(0, 4)
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

export default function MediaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const title = useMemo(
        () =>
            isEdit
                ? "編輯媒體報導"
                : "新增媒體報導",
        [isEdit]
    );

    function updateField(name, value) {
        setForm((current) => ({
            ...current,
            [name]: value
        }));
    }

    useEffect(() => {
        if (!isEdit) return;

        async function fetchMedia() {
            setLoading(true);
            setMessage("");

            try {
                const res = await adminFetch(`${API_BASE}/${id}`);

                if (!res.ok) {
                    throw new Error("取得媒體報導失敗");
                }

                const data = await res.json();
                setForm(toFormData(data));
            } catch (err) {
                const localItem = localMediaData.find(
                    (item) => String(item.id) === id
                );

                if (localItem) {
                    setForm(toFormData(localItem));
                } else {
                    setMessage(err.message || "取得媒體報導失敗");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchMedia();
    }, [id, isEdit]);

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            const payload = {
                ...form,
                year: form.year || String(form.date || "").slice(0, 4)
            };

            const res = await adminFetch(
                isEdit ? `${API_BASE}/${id}` : API_BASE,
                {
                    method: isEdit ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {
                throw new Error(
                    await getResponseError(res, "儲存媒體報導失敗")
                );
            }

            navigate("/admin/news");
        } catch (err) {
            setMessage(err.message || "儲存媒體報導失敗");
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
                            alignItems: {
                                xs: "flex-start",
                                sm: "center"
                            },
                            justifyContent: "space-between"
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight={800}
                            >
                                {title}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                Admin / Media
                            </Typography>
                        </Box>

                        <Button
                            component={Link}
                            to="/admin/news"
                        >
                            返回列表
                        </Button>
                    </Stack>

                    {message && (
                        <Alert severity="warning">
                            {message}
                        </Alert>
                    )}

                    <TextField
                        label="標題"
                        value={form.title}
                        onChange={(event) =>
                            updateField(
                                "title",
                                event.target.value
                            )
                        }
                        required
                        fullWidth
                    />

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={2}
                    >
                        <TextField
                            label="日期"
                            type="date"
                            value={form.date}
                            onChange={(event) =>
                                updateField(
                                    "date",
                                    event.target.value
                                )
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                            sx={noDateAnimationSx}
                            fullWidth
                        />

                        <TextField
                            label="年份"
                            value={form.year}
                            onChange={(event) =>
                                updateField(
                                    "year",
                                    event.target.value
                                )
                            }
                            fullWidth
                        />
                    </Stack>

                    <TextField
                        label="來源"
                        value={form.source}
                        onChange={(event) =>
                            updateField(
                                "source",
                                event.target.value
                            )
                        }
                        fullWidth
                    />

                    <TextField
                        label="連結 URL"
                        value={form.url}
                        onChange={(event) =>
                            updateField(
                                "url",
                                event.target.value
                            )
                        }
                        fullWidth
                    />

                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                    >
                        <Button
                            component={Link}
                            to="/admin/news"
                        >
                            取消
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                        >
                            {saving
                                ? "儲存中..."
                                : "儲存"}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    );
}
