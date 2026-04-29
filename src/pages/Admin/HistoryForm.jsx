import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { historyData as localHistoryData } from "../../data/historyData";
import { adminFetch } from "../../utils/adminAuth";

const API_BASE = "http://localhost:3000/api/admin/history";

const emptyForm = {
    year: "",
    text: ""
};

async function getResponseError(res, fallback) {
    try {
        const data = await res.json();
        return data.message || fallback;
    } catch {
        return fallback;
    }
}

export default function HistoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const title = useMemo(
        () => (isEdit ? "編輯發展歷程" : "新增發展歷程"),
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

        async function fetchHistoryItem() {
            setLoading(true);
            setMessage("");

            try {
                const res = await adminFetch(`${API_BASE}/${id}`);

                if (!res.ok) {
                    throw new Error("取得發展歷程失敗");
                }

                const data = await res.json();
                setForm({
                    year: data.year || "",
                    text: data.text || ""
                });
            } catch (err) {
                const localItem = localHistoryData.find(
                    (item) => String(item.id) === id
                );

                if (localItem) {
                    setForm({
                        year: localItem.year,
                        text: localItem.text
                    });
                } else {
                    setMessage(err.message || "取得發展歷程失敗");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchHistoryItem();
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
                throw new Error(
                    await getResponseError(res, "儲存發展歷程失敗")
                );
            }

            navigate("/admin/history");
        } catch (err) {
            setMessage(err.message || "儲存發展歷程失敗");
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
                                Admin / History
                            </Typography>
                        </Box>

                        <Button component={Link} to="/admin/history">
                            返回列表
                        </Button>
                    </Stack>

                    {message && <Alert severity="warning">{message}</Alert>}

                    <TextField
                        label="年份"
                        value={form.year}
                        onChange={(event) =>
                            updateField("year", event.target.value)
                        }
                        required
                        fullWidth
                    />

                    <TextField
                        label="歷程內容"
                        value={form.text}
                        onChange={(event) =>
                            updateField("text", event.target.value)
                        }
                        required
                        multiline
                        minRows={4}
                        fullWidth
                    />

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button component={Link} to="/admin/history">
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
