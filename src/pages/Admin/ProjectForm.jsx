import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Plus, Trash2, Upload } from "lucide-react";
import { projectData } from "../../data/projectData";
import { adminFetch } from "../../utils/adminAuth";
import { resizeImageFile } from "../../utils/imageUpload";

const API_BASE = "http://localhost:3000/api/admin/projects";

const emptyForm = {
    title: "",
    desc: "",
    category: "",
    image: "",
    gallery: []
};

function toFormData(item) {
    return {
        ...emptyForm,
        ...item,
        gallery:
            item.gallery?.length > 0
                ? item.gallery
                : item.image
                  ? [{ image: item.image, alt: item.title || "" }]
                  : []
    };
}

function loadCanvasImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("照片載入失敗"));
        image.src = src;
    });
}

function getCompositeLayout(count, width, height, gap) {
    if (count <= 1) {
        return [{ x: 0, y: 0, width, height }];
    }

    if (count === 2) {
        const cellWidth = (width - gap) / 2;

        return [
            { x: 0, y: 0, width: cellWidth, height },
            { x: cellWidth + gap, y: 0, width: cellWidth, height }
        ];
    }

    if (count === 3) {
        const leftWidth = Math.round(width * 0.58);
        const rightWidth = width - leftWidth - gap;
        const rightHeight = (height - gap) / 2;

        return [
            { x: 0, y: 0, width: leftWidth, height },
            { x: leftWidth + gap, y: 0, width: rightWidth, height: rightHeight },
            {
                x: leftWidth + gap,
                y: rightHeight + gap,
                width: rightWidth,
                height: rightHeight
            }
        ];
    }

    if (count === 4) {
        const cellWidth = (width - gap) / 2;
        const cellHeight = (height - gap) / 2;

        return Array.from({ length: count }, (_, index) => ({
            x: (index % 2) * (cellWidth + gap),
            y: Math.floor(index / 2) * (cellHeight + gap),
            width: cellWidth,
            height: cellHeight
        }));
    }

    if (count === 5) {
        const topHeight = Math.round(height * 0.52);
        const topWidth = (width - gap) / 2;
        const bottomY = topHeight + gap;
        const bottomHeight = height - topHeight - gap;
        const bottomWidth = (width - gap * 2) / 3;

        return [
            { x: 0, y: 0, width: topWidth, height: topHeight },
            { x: topWidth + gap, y: 0, width: topWidth, height: topHeight },
            ...Array.from({ length: 3 }, (_, index) => ({
                x: index * (bottomWidth + gap),
                y: bottomY,
                width: bottomWidth,
                height: bottomHeight
            }))
        ];
    }

    if (count === 6) {
        const columns = 3;
        const rows = 2;
        const cellWidth = (width - gap * (columns - 1)) / columns;
        const cellHeight = (height - gap * (rows - 1)) / rows;

        return Array.from({ length: count }, (_, index) => ({
            x: (index % columns) * (cellWidth + gap),
            y: Math.floor(index / columns) * (cellHeight + gap),
            width: cellWidth,
            height: cellHeight
        }));
    }

    if (count === 7) {
        const topHeight = Math.round(height * 0.4);
        const middleHeight = Math.round(height * 0.3);
        const bottomHeight = height - topHeight - middleHeight - gap * 2;
        const topWidth = (width - gap) / 2;
        const middleWidth = (width - gap * 2) / 3;
        const bottomWidth = (width - gap) / 2;
        const middleY = topHeight + gap;
        const bottomY = middleY + middleHeight + gap;

        return [
            { x: 0, y: 0, width: topWidth, height: topHeight },
            { x: topWidth + gap, y: 0, width: topWidth, height: topHeight },
            ...Array.from({ length: 3 }, (_, index) => ({
                x: index * (middleWidth + gap),
                y: middleY,
                width: middleWidth,
                height: middleHeight
            })),
            { x: 0, y: bottomY, width: bottomWidth, height: bottomHeight },
            {
                x: bottomWidth + gap,
                y: bottomY,
                width: bottomWidth,
                height: bottomHeight
            }
        ];
    }

    const columns = 4;
    const rows = 2;
    const cellWidth = (width - gap * (columns - 1)) / columns;
    const cellHeight = (height - gap * (rows - 1)) / rows;

    return Array.from({ length: count }, (_, index) => ({
        x: (index % columns) * (cellWidth + gap),
        y: Math.floor(index / columns) * (cellHeight + gap),
        width: cellWidth,
        height: cellHeight
    }));
}

async function createCompositeImage(gallery) {
    const images = gallery.filter((item) => item.image).slice(0, 8);

    if (images.length === 0) {
        throw new Error("請先新增照片集");
    }

    const loadedImages = await Promise.all(
        images.map((item) => loadCanvasImage(item.image))
    );
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const width = 1600;
    const height = 1120;
    const gap = 12;

    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    const layout = getCompositeLayout(loadedImages.length, width, height, gap);

    function drawCover(image, x, y, cellWidth, cellHeight) {
        const imageRatio = image.width / image.height;
        const cellRatio = cellWidth / cellHeight;
        let drawWidth = cellWidth;
        let drawHeight = cellHeight;
        let drawX = x;
        let drawY = y;

        if (imageRatio > cellRatio) {
            drawHeight = cellHeight;
            drawWidth = cellHeight * imageRatio;
            drawX = x - (drawWidth - cellWidth) / 2;
        } else {
            drawWidth = cellWidth;
            drawHeight = cellWidth / imageRatio;
            drawY = y - (drawHeight - cellHeight) / 2;
        }

        context.save();
        context.beginPath();
        context.rect(x, y, cellWidth, cellHeight);
        context.clip();
        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        context.restore();
    }

    loadedImages.forEach((image, index) => {
        const cell = layout[index];
        drawCover(image, cell.x, cell.y, cell.width, cell.height);
    });

    return canvas.toDataURL("image/jpeg", 0.86);
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
    const [creatingCover, setCreatingCover] = useState(false);
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

    function updateGalleryItem(index, key, value) {
        setForm((current) => ({
            ...current,
            gallery: current.gallery.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [key]: value } : item
            )
        }));
    }

    function addGalleryItem() {
        setForm((current) => ({
            ...current,
            gallery: [...current.gallery, { image: "", alt: "" }]
        }));
    }

    function removeGalleryItem(index) {
        setForm((current) => ({
            ...current,
            gallery: current.gallery.filter((_, itemIndex) => itemIndex !== index)
        }));
    }

    async function handleImageUpload(event) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        setUploading(true);
        setMessage("");

        try {
            const imageData = await resizeImageFile(file, {
                watermarkText: "LIXMA"
            });
            updateField("image", imageData);
        } catch (err) {
            setMessage(err.message || "案場照片上傳失敗");
        } finally {
            setUploading(false);
        }
    }

    async function handleGalleryUpload(event, index) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        setMessage("");

        try {
            const imageData = await resizeImageFile(file, {
                watermarkText: "LIXMA"
            });
            updateGalleryItem(index, "image", imageData);
        } catch (err) {
            setMessage(err.message || "案場照片上傳失敗");
        }
    }

    async function handleCreateCompositeCover() {
        setCreatingCover(true);
        setMessage("");

        try {
            const coverImage = await createCompositeImage(form.gallery);
            updateField("image", coverImage);
        } catch (err) {
            setMessage(
                err.message ||
                    "產生彙整封面失敗，若使用外部 URL，請改用自行上傳照片。"
            );
        } finally {
            setCreatingCover(false);
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
                                    彙整封面
                                </Typography>

                                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                    專案實績列表先顯示這張主圖，可貼 URL、上傳照片，或由照片集產生。
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

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                            >
                                <Button
                                    type="button"
                                    variant="outlined"
                                    disabled={creatingCover || form.gallery.length === 0}
                                    onClick={handleCreateCompositeCover}
                                >
                                    {creatingCover ? "產生中..." : "產生彙整封面"}
                                </Button>
                            </Stack>

                            <Typography color="text.secondary" variant="body2">
                                彙整封面會使用照片集前 8 張，並依張數自動排列成適合封面的拼貼。
                            </Typography>

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

                    <Box
                        sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 2,
                            p: { xs: 2, sm: 2.5 },
                            bgcolor: "#ffffff"
                        }}
                    >
                        <Stack spacing={2}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                sx={{
                                    alignItems: { xs: "flex-start", sm: "center" },
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" fontWeight={800}>
                                        案場照片集
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        可增加多張照片，前台點開案場後可單張瀏覽。
                                    </Typography>
                                </Box>

                                <Button
                                    type="button"
                                    variant="outlined"
                                    startIcon={<Plus size={18} />}
                                    onClick={addGalleryItem}
                                >
                                    增加照片
                                </Button>
                            </Stack>

                            {form.gallery.length === 0 && (
                                <Typography color="text.secondary">
                                    尚未新增案場照片
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
                                            alt={item.alt || `案場照片 ${index + 1}`}
                                            sx={{
                                                width: 150,
                                                height: 96,
                                                flex: "0 0 auto",
                                                borderRadius: 1,
                                                border: "1px solid #e2e8f0",
                                                bgcolor: "#f8fafc",
                                                objectFit: "cover"
                                            }}
                                        />
                                    )}

                                    <Stack spacing={1.5} sx={{ flex: 1 }}>
                                        <TextField
                                            label={`照片 URL ${index + 1}`}
                                            value={item.image}
                                            onChange={(event) =>
                                                updateGalleryItem(
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
                                                        updateGalleryItem(
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
                                            label="照片說明"
                                            value={item.alt}
                                            onChange={(event) =>
                                                updateGalleryItem(
                                                    index,
                                                    "alt",
                                                    event.target.value
                                                )
                                            }
                                            fullWidth
                                        />
                                    </Stack>

                                    <Button
                                        type="button"
                                        color="error"
                                        variant="text"
                                        startIcon={<Trash2 size={18} />}
                                        onClick={() => removeGalleryItem(index)}
                                    >
                                        移除
                                    </Button>
                                </Stack>
                            ))}
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
