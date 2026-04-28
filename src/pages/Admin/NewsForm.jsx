import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { newsData as localNewsData } from "../../data/newsData";

const API_BASE = "http://localhost:3000/api/admin/news";

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

export default function NewsForm() {
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
                ? "\u7de8\u8f2f\u6d88\u606f"
                : "\u65b0\u589e\u6d88\u606f",
        [isEdit]
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
            [name]: [...current[name], value]
        }));
    }

    function removeArrayItem(name, index) {
        setForm((current) => ({
            ...current,
            [name]: current[name].filter((_, itemIndex) => itemIndex !== index)
        }));
    }

    useEffect(() => {
        if (!isEdit) return;

        async function fetchNews() {
            setLoading(true);
            setMessage("");
            try {
                const res = await fetch(`${API_BASE}/${id}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch news");
                }

                const data = await res.json();
                setForm(toFormData(data));
            } catch (err) {
                const localItem = localNewsData.find(
                    (item) => String(item.id) === id || item.slug === id
                );

                if (localItem) {
                    setForm(toFormData(localItem));
                    setMessage(
                        "\u7121\u6cd5\u9023\u7dda\u5230 API\uff0c\u76ee\u524d\u8f09\u5165\u672c\u5730\u8cc7\u6599\u4f9b\u9810\u89bd\u3002"
                    );
                } else {
                    setMessage(
                        err.message || "Failed to fetch news"
                    );
                }
            } finally {
                setLoading(false);
            }
        }

        fetchNews();
    }, [id, isEdit]);

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            const res = await fetch(isEdit ? `${API_BASE}/${id}` : API_BASE, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                throw new Error(
                    await getResponseError(res, "Failed to save news")
                );
            }

            navigate("/admin/news");
        } catch (err) {
            setMessage(err.message || "Failed to save news");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 5, color: "text.secondary" }}>
                    {"\u8f09\u5165\u4e2d..."}
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
                            {"\u8fd4\u56de\u5217\u8868"}
                        </Button>
                    </Stack>

                    {message && <Alert severity="warning">{message}</Alert>}

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
                        label={"\u6a19\u984c"}
                        value={form.title}
                        onChange={(event) =>
                            updateField("title", event.target.value)
                        }
                        required
                        fullWidth
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label={"\u5206\u985e"}
                            value={form.category}
                            onChange={(event) =>
                                updateField("category", event.target.value)
                            }
                            fullWidth
                        />
                        <TextField
                            label={"\u5e74\u4efd"}
                            value={form.year}
                            onChange={(event) =>
                                updateField("year", event.target.value)
                            }
                            fullWidth
                        />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label={"\u65e5\u671f"}
                            type="date"
                            value={form.date}
                            onChange={(event) =>
                                updateField("date", event.target.value)
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
                            label={"\u700f\u89bd\u6b21\u6578"}
                            type="number"
                            value={form.views}
                            onChange={(event) =>
                                updateField("views", Number(event.target.value))
                            }
                            fullWidth
                        />
                        <TextField
                            label={"\u95b1\u8b80\u5206\u9418"}
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

                    <TextField
                        label={"\u5c01\u9762\u5716\u7247 URL"}
                        value={form.coverImage}
                        onChange={(event) =>
                            updateField("coverImage", event.target.value)
                        }
                        fullWidth
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.award}
                                onChange={(event) =>
                                    updateField("award", event.target.checked)
                                }
                            />
                        }
                        label={"\u986f\u793a\u734e\u9805\u5340\u584a"}
                    />

                    {form.award && (
                        <Stack spacing={2}>
                            <TextField
                                label={"\u734e\u9805\u6a19\u984c"}
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
                                label={"\u734e\u9805\u8aaa\u660e"}
                                value={form.awardDesc}
                                onChange={(event) =>
                                    updateField("awardDesc", event.target.value)
                                }
                                multiline
                                minRows={3}
                                fullWidth
                            />
                        </Stack>
                    )}

                    <Box
                        sx={{
                            borderTop: "1px solid #e2e8f0",
                            pt: 3
                        }}
                    >
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography variant="h6" fontWeight={800}>
                                    {"\u6587\u7ae0\u6bb5\u843d"}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        addArrayItem("sections", {
                                            title: "",
                                            content: ""
                                        })
                                    }
                                >
                                    {"\u65b0\u589e\u6bb5\u843d"}
                                </Button>
                            </Stack>

                            {form.sections.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 2,
                                        border: "1px solid #e2e8f0",
                                        borderRadius: 2
                                    }}
                                >
                                    <Stack spacing={2}>
                                        <TextField
                                            label={"\u6bb5\u843d\u6a19\u984c"}
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
                                            label={"\u6bb5\u843d\u5167\u5bb9"}
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
                                        <Box>
                                            <Button
                                                color="error"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "sections",
                                                        index
                                                    )
                                                }
                                            >
                                                {"\u522a\u9664\u6bb5\u843d"}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            borderTop: "1px solid #e2e8f0",
                            pt: 3
                        }}
                    >
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography variant="h6" fontWeight={800}>
                                    {"\u7d71\u8a08\u6578\u5b57"}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        addArrayItem("stats", {
                                            number: "",
                                            label: ""
                                        })
                                    }
                                >
                                    {"\u65b0\u589e\u7d71\u8a08"}
                                </Button>
                            </Stack>

                            {form.stats.map((item, index) => (
                                <Stack
                                    key={index}
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={2}
                                    sx={{ alignItems: "center" }}
                                >
                                    <TextField
                                        label={"\u6578\u5b57"}
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
                                        label={"\u6a19\u7c64"}
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
                                    <Button
                                        color="error"
                                        onClick={() =>
                                            removeArrayItem("stats", index)
                                        }
                                    >
                                        {"\u522a\u9664"}
                                    </Button>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            borderTop: "1px solid #e2e8f0",
                            pt: 3
                        }}
                    >
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography variant="h6" fontWeight={800}>
                                    {"\u6280\u8853\u7279\u8272"}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => addArrayItem("features", "")}
                                >
                                    {"\u65b0\u589e\u7279\u8272"}
                                </Button>
                            </Stack>

                            {form.features.map((item, index) => (
                                <Stack
                                    key={index}
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={2}
                                    sx={{ alignItems: "center" }}
                                >
                                    <TextField
                                        label={"\u7279\u8272\u5167\u5bb9"}
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
                                    <Button
                                        color="error"
                                        onClick={() =>
                                            removeArrayItem("features", index)
                                        }
                                    >
                                        {"\u522a\u9664"}
                                    </Button>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            borderTop: "1px solid #e2e8f0",
                            pt: 3
                        }}
                    >
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography variant="h6" fontWeight={800}>
                                    {"\u7167\u7247"}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        addArrayItem("gallery", {
                                            image: "",
                                            alt: ""
                                        })
                                    }
                                >
                                    {"\u65b0\u589e\u7167\u7247"}
                                </Button>
                            </Stack>

                            {form.gallery.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 2,
                                        border: "1px solid #e2e8f0",
                                        borderRadius: 2
                                    }}
                                >
                                    <Stack spacing={2}>
                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row"
                                            }}
                                            spacing={2}
                                            sx={{ alignItems: "center" }}
                                        >
                                            <TextField
                                                label={"\u5716\u7247 URL"}
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
                                            <TextField
                                                label="Alt"
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
                                            <Button
                                                color="error"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "gallery",
                                                        index
                                                    )
                                                }
                                            >
                                                {"\u522a\u9664"}
                                            </Button>
                                        </Stack>

                                        {item.image && (
                                            <Box
                                                component="img"
                                                src={item.image}
                                                alt={item.alt || ""}
                                                sx={{
                                                    width: 180,
                                                    maxWidth: "100%",
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 1,
                                                    border: "1px solid #e2e8f0"
                                                }}
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            borderTop: "1px solid #e2e8f0",
                            pt: 3
                        }}
                    >
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography variant="h6" fontWeight={800}>
                                    {"\u76f8\u95dc\u6d88\u606f"}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => addArrayItem("relatedIds", "")}
                                >
                                    {"\u65b0\u589e\u76f8\u95dc ID"}
                                </Button>
                            </Stack>

                            {form.relatedIds.map((item, index) => {
                                const related = localNewsData.find(
                                    (news) => String(news.id) === String(item)
                                );

                                return (
                                    <Stack
                                        key={index}
                                        direction={{
                                            xs: "column",
                                            sm: "row"
                                        }}
                                        spacing={2}
                                        sx={{ alignItems: "center" }}
                                    >
                                        <TextField
                                            label={"\u76f8\u95dc\u6d88\u606f ID"}
                                            type="number"
                                            value={item}
                                            onChange={(event) =>
                                                updateTextArrayItem(
                                                    "relatedIds",
                                                    index,
                                                    Number(event.target.value)
                                                )
                                            }
                                            fullWidth
                                        />
                                        <Typography
                                            color="text.secondary"
                                            sx={{
                                                minWidth: {
                                                    xs: "100%",
                                                    sm: 240
                                                }
                                            }}
                                        >
                                            {related?.title ||
                                                "\u627e\u4e0d\u5230\u5c0d\u61c9\u672c\u5730\u8cc7\u6599"}
                                        </Typography>
                                        <Button
                                            color="error"
                                            onClick={() =>
                                                removeArrayItem(
                                                    "relatedIds",
                                                    index
                                                )
                                            }
                                        >
                                            {"\u522a\u9664"}
                                        </Button>
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button component={Link} to="/admin/news">
                            {"\u53d6\u6d88"}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                        >
                            {saving
                                ? "\u5132\u5b58\u4e2d..."
                                : "\u5132\u5b58"}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    );
}
