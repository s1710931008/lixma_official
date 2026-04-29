import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import BusinessIcon from "@mui/icons-material/Business";
import BoltIcon from "@mui/icons-material/Bolt";

import "./Projects.css";
import { projectData } from "../../data/projectData";

const API_BASE = "http://localhost:3000/api/projects";
const PAGE_SIZE = 3;

export default function Projects() {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
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

    const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    };

    return (
        <Box className="projects-page">
            {/* breadcrumb */}
            <Box className="projects-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="projects-breadcrumb">
                        <a href="/">首頁</a>
                        <span>/</span>
                        <span>專案實績</span>
                    </Box>
                </Container>
            </Box>

            {/* hero */}
            <Box className="projects-hero">
                <Container maxWidth="lg">
                    <Box className="projects-hero-inner">
                        <Typography className="projects-kicker">
                            PROJECTS
                        </Typography>

                        <Typography className="projects-title">
                            <SolarPowerIcon className="title-icon" />
                            專案實績
                        </Typography>

                        <Typography className="projects-subtitle">
                            從廠房屋頂、校園案場到大型地面電站，
                            我們持續累積多元場域的建置經驗，
                            以設計、施工與整合能力，打造兼具效益與美感的綠能作品。
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* content */}
            <Container maxWidth="lg" className="projects-content">
                <Box className="projects-toolbar">
                    <Typography className="projects-section-title">
                        <PhotoLibraryIcon className="section-icon" />
                        案場照片
                    </Typography>

                    <Typography className="projects-section-desc">
                        點擊照片可查看放大圖片
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
                                    src={item.image}
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
                                backgroundColor: "#10b981 !important",
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
                        backgroundColor: "#08111f",
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
                                    src={selectedItem.image}
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
                            </Box>
                        </>
                    )}
                </Box>
            </Dialog>
        </Box>
    );
}
