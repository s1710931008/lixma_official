import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import BusinessIcon from "@mui/icons-material/Business";
import BoltIcon from "@mui/icons-material/Bolt";

import "./Projects.css";
import { projectData } from "../../data/projectData";
import AdminPreviewBack from "../../components/AdminPreviewBack";

const API_BASE = "/api/projects";
const PAGE_SIZE = 3;

export default function Projects() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState("");
    const [items, setItems] = useState(projectData);

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const currentItems = useMemo(
        () => items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
        [items, safePage]
    );

    useEffect(() => {
        let active = true;

        async function fetchProjects() {
            try {
                const res = await fetch(API_BASE);

                if (!res.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const data = await res.json();

                if (active) {
                    setItems(Array.isArray(data) ? data : data.items ?? []);
                }
            } catch {
                if (active) {
                    setItems(projectData);
                }
            }
        }

        fetchProjects();

        return () => {
            active = false;
        };
    }, []);

    function getProjectPhotos(item) {
        const gallery = item.gallery?.filter((photo) => photo.image) ?? [];

        if (gallery.length > 0) return gallery;
        if (item.image) return [{ image: item.image, alt: item.title }];
        return [];
    }

    function getCoverImage(item) {
        return item.image || getProjectPhotos(item)[0]?.image || "";
    }

    const handleOpen = (item) => {
        setSelectedItem(item);
        setSelectedPhoto(getCoverImage(item));
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
        setSelectedPhoto("");
    };

    return (
        <Box className="projects-page">
            <AdminPreviewBack />

            {/* breadcrumb */}
            <Box className="projects-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="projects-breadcrumb">
                        <a href="/">{t("common.home")}</a>
                        <span>/</span>
                        <span>{t("projects.title")}</span>
                    </Box>
                </Container>
            </Box>

            {/* hero */}
            <Box className="projects-hero">
                <Container maxWidth="lg">
                    <Box className="projects-hero-inner">
                        <Typography className="projects-kicker">
                            {t("projects.kicker")}
                        </Typography>

                        <Typography className="projects-title">
                            <SolarPowerIcon className="title-icon" />
                            {t("projects.title")}
                        </Typography>

                        <Typography className="projects-subtitle">
                            {t("projects.subtitle")}
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* content */}
            <Container maxWidth="lg" className="projects-content">
                <Box className="projects-toolbar">
                    <Typography className="projects-section-title">
                        <PhotoLibraryIcon className="section-icon" />
                        {t("projects.sectionTitle")}
                    </Typography>

                    <Typography className="projects-section-desc">
                        {t("projects.sectionDesc")}
                    </Typography>
                </Box>

                <Box className="gallery-grid">
                    {currentItems.map((item) => (
                        <Box
                            className="gallery-card"
                            key={item.id}
                            onClick={() => handleOpen(item)}
                        >
                            <Box className="gallery-media-wrap">
                                <img
                                    src={getCoverImage(item)}
                                    alt={item.title}
                                    className="gallery-image"
                                />

                                <Box className="gallery-overlay">
                                    <Box className="gallery-overlay-content">
                                        <Box className="gallery-expand">
                                            <OpenInFullIcon fontSize="small" />
                                        </Box>
                                    </Box>
                                </Box>

                                <span className="gallery-badge">
                                    <BusinessIcon className="badge-icon" />
                                    {item.category}
                                </span>
                            </Box>

                            <Box className="gallery-content">
                                <Typography component="h3" className="gallery-title">
                                    {item.title}
                                </Typography>

                                <Typography component="p" className="gallery-desc">
                                    {item.desc}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Stack
                    spacing={2}
                    sx={{
                        mt: 7,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Pagination
                        count={totalPages}
                        page={safePage}
                        onChange={(event, value) => setPage(value)}
                        size="large"
                        shape="rounded"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontWeight: 700,
                                color: "#334155",
                            },
                            "& .Mui-selected": {
                                backgroundColor: "#1c7ed6 !important",
                                color: "#fff",
                            },
                        }}
                    />
                </Stack>
            </Container>

            {/* lightbox */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: "#0f2740",
                        borderRadius: 4,
                        overflow: "hidden",
                    },
                }}
            >
                <Box className="lightbox-wrap">
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            top: 14,
                            right: 14,
                            zIndex: 2,
                            color: "#fff",
                            bgcolor: "rgba(255,255,255,0.12)",
                            "&:hover": {
                                bgcolor: "rgba(255,255,255,0.2)",
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {selectedItem && (
                        <>
                            <Box className="lightbox-image-wrap">
                                <img
                                    src={selectedPhoto || getCoverImage(selectedItem)}
                                    alt={selectedItem.title}
                                    className="lightbox-image"
                                />
                            </Box>

                            <Box className="lightbox-content">
                                <Typography className="lightbox-title">
                                    <BoltIcon className="lightbox-icon" />
                                    {selectedItem.title}
                                </Typography>

                                <Typography className="lightbox-desc">
                                    {selectedItem.desc}
                                </Typography>

                                {getProjectPhotos(selectedItem).length > 1 && (
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fill, minmax(92px, 1fr))",
                                            gap: 1.25,
                                            mt: 2.5
                                        }}
                                    >
                                        {getProjectPhotos(selectedItem).map(
                                            (photo, index) => (
                                                <Box
                                                    component="button"
                                                    type="button"
                                                    key={`${photo.image}-${index}`}
                                                    onClick={() =>
                                                        setSelectedPhoto(photo.image)
                                                    }
                                                    sx={{
                                                        p: 0,
                                                        height: 70,
                                                        borderRadius: 1.5,
                                                        overflow: "hidden",
                                                        border:
                                                            selectedPhoto ===
                                                            photo.image
                                                                ? "3px solid #34d399"
                                                                : "1px solid rgba(255,255,255,0.2)",
                                                        bgcolor: "transparent",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={photo.image}
                                                        alt={
                                                            photo.alt ||
                                                            `${selectedItem.title} ${index + 1}`
                                                        }
                                                        sx={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            display: "block"
                                                        }}
                                                    />
                                                </Box>
                                            )
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            </Dialog>
        </Box>
    );
}

