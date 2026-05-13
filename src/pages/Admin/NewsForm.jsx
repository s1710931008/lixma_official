import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Plus, Trash2, Upload } from "lucide-react";
import { newsData as localNewsData } from "../../data/newsData";
import { adminFetch } from "../../utils/adminAuth";
import { resizeImageFile } from "../../utils/imageUpload";

const API_BASE = "/api/admin/news";

const noDateAnimationSx = {
    "& .MuiInputBase-root, & .MuiInputBase-input, & .MuiInputLabel-root, & .MuiOutlinedInput-notchedOutline":
    {
        transition: "none"
    }
};

const emptyForm = {
    slug: "",
    category: "",
    title: "",
    date: "",
    views: 0,
    readMinutes: 3,
    award: false,
    awardTitle: "",
    awardDesc: "",
    year: "",
    coverImage: "",
    sections: [],
    stats: [],
    features: [],
    gallery: [],
    relatedIds: []
};

const previewImageSx = {
    width: 132,
    height: 82,
    flex: "0 0 auto",
    borderRadius: 1,
    border: "1px solid #e2e8f0",
    bgcolor: "#f8fafc",
    objectFit: "cover"
};

function toFormData(news) {
    return {
        ...emptyForm,
        ...news,
        views: Number(news.views ?? 0),
        readMinutes: Number(news.readMinutes ?? 3),
        award: Boolean(news.award),
        sections: news.sections ?? [],
        stats: news.stats ?? [],
        features:
            news.features?.map((item) =>
                typeof item === "string" ? item : item.content ?? ""
            ) ?? [],
        gallery: news.gallery ?? [],
        relatedIds: news.relatedIds?.map((item) => Number(item)) ?? []
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

function FormSection({ title, description, onAdd, children }) {
    return (
        <Box
            sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: { xs: 2, sm: 2.5 },
                bgcolor: "#ffffff"
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    mb: 2
                }}
            >
                <Box>
                    <Typography variant="h6" fontWeight={800}>
                        {title}
                    </Typography>

                    {description && (
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            {description}
                        </Typography>
                    )}
                </Box>

                <Button
                    type="button"
                    variant="outlined"
                    startIcon={<Plus size={18} />}
                    onClick={onAdd}
                >
                    新增
                </Button>
            </Stack>

            <Stack spacing={2}>{children}</Stack>
        </Box>
    );
}

function RemoveButton({ label, onClick }) {
    return (
        <IconButton
            type="button"
            color="error"
            aria-label={label}
            title={label}
            onClick={onClick}
            sx={{ alignSelf: "flex-start" }}
        >
            <Trash2 size={20} />
        </IconButton>
    );
}

export default function NewsForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [message, setMessage] = useState("");
    const [newsOptions, setNewsOptions] = useState(localNewsData);

    const title = useMemo(
        () => (isEdit ? "編輯消息" : "新增消息"),
        [isEdit]
    );

    const availableRelatedOptions = useMemo(
        () =>
            newsOptions.filter(
                (item) =>
                    String(item.id) !== String(form.id) &&
                    !form.relatedIds.some(
                        (relatedId) => Number(relatedId) === Number(item.id)
                    )
            ),
        [form.id, form.relatedIds, newsOptions]
    );

    function updateField(name, value) {
        setForm((current) => ({
            ...current,
            [name]: value
        }));
    }

    function updateArrayItem(name, index, key, value) {
        setForm((current) => ({
            ...current,
            [name]: current[name].map((item, itemIndex) =>
                itemIndex === index ? { ...item, [key]: value } : item
            )
        }));
    }

    function updateTextArrayItem(name, index, value) {
        setForm((current) => ({
            ...current,
            [name]: current[name].map((item, itemIndex) =>
                itemIndex === index ? value : item
            )
        }));
    }

    function addArrayItem(name, value) {
        setForm((current) => ({
            ...current,
            [name]: [...(current[name] ?? []), value]
        }));
    }

    function removeArrayItem(name, index) {
        setForm((current) => ({
            ...current,
            [name]: current[name].filter((_, itemIndex) => itemIndex !== index)
        }));
    }

    function addRelatedNews(relatedId) {
        const nextId = Number(relatedId);

        if (!Number.isFinite(nextId) || nextId <= 0) return;

        setForm((current) => {
            if (String(current.id) === String(nextId)) return current;
            if (current.relatedIds.some((item) => Number(item) === nextId)) {
                return current;
            }

            return {
                ...current,
                relatedIds: [...current.relatedIds, nextId]
            };
        });
    }

    function getRelatedNews(relatedId) {
        return newsOptions.find((item) => Number(item.id) === Number(relatedId));
    }

    async function handleCoverUpload(event) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        setUploadingCover(true);
        setMessage("");

        try {
            const imageData = await resizeImageFile(file);
            updateField("coverImage", imageData);
        } catch (err) {
            setMessage(err.message || "封面圖片上傳失敗");
        } finally {
            setUploadingCover(false);
        }
    }

    async function handleGalleryUpload(event, index) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        setMessage("");

        try {
            const imageData = await resizeImageFile(file);
            updateArrayItem("gallery", index, "image", imageData);
        } catch (err) {
            setMessage(err.message || "圖庫圖片上傳失敗");
        }
    }

    useEffect(() => {
        if (!isEdit) return;

        async function fetchNews() {
            setLoading(true);
            setMessage("");

            try {
                const res = await adminFetch(`${API_BASE}/${id}`);

                if (!res.ok) {
                    throw new Error("取得消息失敗");
                }

                const data = await res.json();
                setForm(toFormData(data));
            } catch (err) {
                const localItem = localNewsData.find(
                    (item) => String(item.id) === id || item.slug === id
                );

                if (localItem) {
                    setForm(toFormData(localItem));
                    setMessage("無法連線到 API，目前載入本地資料供預覽。");
                } else {
                    setMessage(err.message || "取得消息失敗");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchNews();
    }, [id, isEdit]);

    useEffect(() => {
        let active = true;

        async function fetchNewsOptions() {
            try {
                const res = await adminFetch(API_BASE);

                if (!res.ok) {
                    throw new Error("取得消息列表失敗");
                }

                const data = await res.json();

                if (active) {
                    setNewsOptions(Array.isArray(data) ? data : data.items ?? []);
                }
            } catch {
                if (active) {
                    setNewsOptions(localNewsData);
                }
            }
        }

        fetchNewsOptions();

        return () => {
            active = false;
        };
    }, []);

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
                    await getResponseError(res, "儲存消息失敗")
                );
            }

            navigate("/admin/news");
        } catch (err) {
            setMessage(err.message || "儲存消息失敗");
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
                                Admin / News
                            </Typography>
                        </Box>

                        <Button component={Link} to="/admin/news">
                            返回列表
                        </Button>
                    </Stack>

                    {message && (
                        <Alert severity="warning">
                            {message}
                        </Alert>
                    )}

                    <TextField
                        label="Slug"
                        value={form.slug}
                        onChange={(event) =>
                            updateField("slug", event.target.value)
                        }
                        required
                        fullWidth
                    />

                    <TextField
                        label="標題"
                        value={form.title}
                        onChange={(event) =>
                            updateField("title", event.target.value)
                        }
                        required
                        fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="分類"
                            value={form.category}
                            onChange={(event) =>
                                updateField("category", event.target.value)
                            }
                            fullWidth
                        />

                        <TextField
                            label="年份"
                            value={form.year}
                            onChange={(event) =>
                                updateField("year", event.target.value)
                            }
                            fullWidth
                        />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="日期"
                            type="date"
                            value={form.date}
                            onChange={(event) =>
                                updateField("date", event.target.value)
                            }
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            sx={noDateAnimationSx}
                            fullWidth
                        />

                        <TextField
                            label="瀏覽次數"
                            type="number"
                            value={form.views}
                            onChange={(event) =>
                                updateField("views", Number(event.target.value))
                            }
                            fullWidth
                        />

                        <TextField
                            label="閱讀分鐘"
                            type="number"
                            value={form.readMinutes}
                            onChange={(event) =>
                                updateField(
                                    "readMinutes",
                                    Number(event.target.value)
                                )
                            }
                            fullWidth
                        />
                    </Stack>

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
                                    封面圖片
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
                                    label="封面圖片 URL"
                                    value={form.coverImage}
                                    onChange={(event) =>
                                        updateField(
                                            "coverImage",
                                            event.target.value
                                        )
                                    }
                                    helperText="貼上網址或上傳照片後自動填入。"
                                    fullWidth
                                />

                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<Upload size={18} />}
                                    disabled={uploadingCover}
                                    sx={{ minWidth: 150, py: 1.65 }}
                                >
                                    {uploadingCover ? "處理中..." : "上傳照片"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleCoverUpload}
                                    />
                                </Button>
                            </Stack>

                            {form.coverImage && (
                                <Box>
                                    <Box
                                        component="img"
                                        src={form.coverImage}
                                        alt="封面圖片預覽"
                                        sx={{
                                            width: "100%",
                                            maxHeight: 280,
                                            borderRadius: 2,
                                            border: "1px solid #e2e8f0",
                                            bgcolor: "#f8fafc",
                                            objectFit: "cover"
                                        }}
                                    />

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            justifyContent: "flex-end",
                                            mt: 1
                                        }}
                                    >
                                        <Button
                                            type="button"
                                            color="error"
                                            variant="outlined"
                                            startIcon={<Trash2 size={18} />}
                                            onClick={() =>
                                                updateField("coverImage", "")
                                            }
                                        >
                                            刪除照片
                                        </Button>
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.award}
                                onChange={(event) =>
                                    updateField("award", event.target.checked)
                                }
                            />
                        }
                        label="顯示獎項區塊"
                    />

                    {form.award && (
                        <Stack spacing={2}>
                            <TextField
                                label="獎項標題"
                                value={form.awardTitle}
                                onChange={(event) =>
                                    updateField(
                                        "awardTitle",
                                        event.target.value
                                    )
                                }
                                fullWidth
                            />

                            <TextField
                                label="獎項說明"
                                value={form.awardDesc}
                                onChange={(event) =>
                                    updateField(
                                        "awardDesc",
                                        event.target.value
                                    )
                                }
                                multiline
                                minRows={3}
                                fullWidth
                            />
                        </Stack>
                    )}

                    <Divider />

                    <FormSection
                        title="文章段落"
                        description="對應前台的專案概述、技術特色、未來展望等內容。"
                        onAdd={() =>
                            addArrayItem("sections", {
                                title: "",
                                content: ""
                            })
                        }
                    >
                        {form.sections.length === 0 && (
                            <Typography color="text.secondary">
                                尚未新增文章段落
                            </Typography>
                        )}

                        {form.sections.map((item, index) => (
                            <Stack
                                key={index}
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{ alignItems: "flex-start" }}
                            >
                                <Stack spacing={1.5} sx={{ flex: 1 }}>
                                    <TextField
                                        label={`段落標題 ${index + 1}`}
                                        value={item.title}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "sections",
                                                index,
                                                "title",
                                                event.target.value
                                            )
                                        }
                                        fullWidth
                                    />

                                    <TextField
                                        label="段落內容"
                                        value={item.content}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "sections",
                                                index,
                                                "content",
                                                event.target.value
                                            )
                                        }
                                        multiline
                                        minRows={4}
                                        fullWidth
                                    />
                                </Stack>

                                <RemoveButton
                                    label="刪除段落"
                                    onClick={() =>
                                        removeArrayItem("sections", index)
                                    }
                                />
                            </Stack>
                        ))}
                    </FormSection>

                    <FormSection
                        title="數據卡片"
                        description="對應前台 499、650、325、20 這類統計資料。"
                        onAdd={() =>
                            addArrayItem("stats", {
                                number: "",
                                label: ""
                            })
                        }
                    >
                        {form.stats.length === 0 && (
                            <Typography color="text.secondary">
                                尚未新增數據卡片
                            </Typography>
                        )}

                        {form.stats.map((item, index) => (
                            <Stack
                                key={index}
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{ alignItems: "flex-start" }}
                            >
                                <TextField
                                    label={`數字 ${index + 1}`}
                                    value={item.number}
                                    onChange={(event) =>
                                        updateArrayItem(
                                            "stats",
                                            index,
                                            "number",
                                            event.target.value
                                        )
                                    }
                                    fullWidth
                                />

                                <TextField
                                    label="標籤"
                                    value={item.label}
                                    onChange={(event) =>
                                        updateArrayItem(
                                            "stats",
                                            index,
                                            "label",
                                            event.target.value
                                        )
                                    }
                                    fullWidth
                                />

                                <RemoveButton
                                    label="刪除數據"
                                    onClick={() =>
                                        removeArrayItem("stats", index)
                                    }
                                />
                            </Stack>
                        ))}
                    </FormSection>

                    <FormSection
                        title="特色條列"
                        description="對應前台文章下方的項目符號列表。"
                        onAdd={() => addArrayItem("features", "")}
                    >
                        {form.features.length === 0 && (
                            <Typography color="text.secondary">
                                尚未新增特色條列
                            </Typography>
                        )}

                        {form.features.map((item, index) => (
                            <Stack
                                key={index}
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{ alignItems: "flex-start" }}
                            >
                                <TextField
                                    label={`特色 ${index + 1}`}
                                    value={item}
                                    onChange={(event) =>
                                        updateTextArrayItem(
                                            "features",
                                            index,
                                            event.target.value
                                        )
                                    }
                                    fullWidth
                                />

                                <RemoveButton
                                    label="刪除特色"
                                    onClick={() =>
                                        removeArrayItem("features", index)
                                    }
                                />
                            </Stack>
                        ))}
                    </FormSection>

                    <FormSection
                        title="文章圖庫"
                        description="可貼圖片 URL，也可自行上傳照片。"
                        onAdd={() =>
                            addArrayItem("gallery", {
                                image: "",
                                alt: ""
                            })
                        }
                    >
                        {form.gallery.length === 0 && (
                            <Typography color="text.secondary">
                                尚未新增圖庫圖片
                            </Typography>
                        )}

                        {form.gallery.map((item, index) => (
                            <Stack
                                key={index}
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{ alignItems: "flex-start" }}
                            >
                                {item.image && (
                                    <Box
                                        component="img"
                                        src={item.image}
                                        alt={item.alt || `圖庫圖片 ${index + 1}`}
                                        sx={previewImageSx}
                                    />
                                )}

                                <Stack spacing={1.5} sx={{ flex: 1 }}>
                                    <TextField
                                        label={`圖片 URL ${index + 1}`}
                                        value={item.image}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "gallery",
                                                index,
                                                "image",
                                                event.target.value
                                            )
                                        }
                                        fullWidth
                                    />

                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={1}
                                    >
                                        <Button
                                            component="label"
                                            type="button"
                                            variant="outlined"
                                            startIcon={<Upload size={18} />}
                                        >
                                            上傳照片
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(event) =>
                                                    handleGalleryUpload(
                                                        event,
                                                        index
                                                    )
                                                }
                                            />
                                        </Button>

                                        {item.image && (
                                            <Button
                                                type="button"
                                                color="error"
                                                variant="outlined"
                                                startIcon={<Trash2 size={18} />}
                                                onClick={() =>
                                                    updateArrayItem(
                                                        "gallery",
                                                        index,
                                                        "image",
                                                        ""
                                                    )
                                                }
                                            >
                                                刪除照片
                                            </Button>
                                        )}
                                    </Stack>

                                    <TextField
                                        label="替代文字"
                                        value={item.alt}
                                        onChange={(event) =>
                                            updateArrayItem(
                                                "gallery",
                                                index,
                                                "alt",
                                                event.target.value
                                            )
                                        }
                                        fullWidth
                                    />
                                </Stack>

                                <RemoveButton
                                    label="刪除圖片"
                                    onClick={() =>
                                        removeArrayItem("gallery", index)
                                    }
                                />
                            </Stack>
                        ))}
                    </FormSection>

                    <FormSection
                        title="相關消息"
                        description="下方已列出目前會顯示在文章底部的相關消息。"
                        onAdd={() => addArrayItem("relatedIds", "")}
                    >
                        <TextField
                            select
                            label="加入其他消息"
                            value=""
                            onChange={(event) =>
                                addRelatedNews(event.target.value)
                            }
                            disabled={availableRelatedOptions.length === 0}
                            helperText={
                                availableRelatedOptions.length === 0
                                    ? "目前沒有其他可加入的消息，既有消息已全部列在下方。"
                                    : "選擇後會加入到下方相關消息清單。"
                            }
                            fullWidth
                        >
                            <MenuItem value="" disabled>
                                {availableRelatedOptions.length === 0
                                    ? "沒有可加入的消息"
                                    : "請選擇消息"}
                            </MenuItem>

                            {availableRelatedOptions.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {`${item.id} - ${item.title}`}
                                    </MenuItem>
                                ))}
                        </TextField>

                        {form.relatedIds.length === 0 && (
                            <Typography color="text.secondary">
                                尚未新增相關消息
                            </Typography>
                        )}

                        {form.relatedIds.map((item, index) => (
                            <Stack
                                key={index}
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                sx={{ alignItems: "flex-start" }}
                            >
                                {getRelatedNews(item)?.coverImage && (
                                    <Box
                                        component="img"
                                        src={getRelatedNews(item).coverImage}
                                        alt={getRelatedNews(item).title}
                                        sx={previewImageSx}
                                    />
                                )}

                                <Stack spacing={1} sx={{ flex: 1 }}>
                                    <TextField
                                        label={`相關消息 ID ${index + 1}`}
                                        type="number"
                                        value={item}
                                        onChange={(event) =>
                                            updateTextArrayItem(
                                                "relatedIds",
                                                index,
                                                event.target.value
                                                    ? Number(event.target.value)
                                                    : ""
                                            )
                                        }
                                        fullWidth
                                    />

                                    {getRelatedNews(item) ? (
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                border: "1px solid #e2e8f0",
                                                borderRadius: 1,
                                                bgcolor: "#f8fafc"
                                            }}
                                        >
                                            <Typography
                                                color="text.secondary"
                                                variant="body2"
                                            >
                                                {getRelatedNews(item).date ||
                                                    "未設定日期"}
                                            </Typography>

                                            <Typography fontWeight={700}>
                                                {getRelatedNews(item).title}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Alert severity="warning">
                                            找不到 ID {item} 對應的消息
                                        </Alert>
                                    )}
                                </Stack>

                                <RemoveButton
                                    label="刪除相關消息"
                                    onClick={() =>
                                        removeArrayItem("relatedIds", index)
                                    }
                                />
                            </Stack>
                        ))}
                    </FormSection>

                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                    >
                        <Button component={Link} to="/admin/news">
                            取消
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                        >
                            {saving ? "儲存中..." : "儲存"}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    );
}
