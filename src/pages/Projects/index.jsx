import { useState } from "react";
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

const pages = {
    1: [
        {
            title: "廠房屋頂",
            desc: "大型工業廠房太陽能系統建置",
            category: "Factory",
            img: "https://www.lixma.com.tw/storage/gallery/5b1799c778a3db37754357a2/63329cd68482cafe112cc632.jpg",
        },
        {
            title: "BIPV導水型",
            desc: "建築整合型太陽能系統",
            category: "BIPV",
            img: "https://www.lixma.com.tw/storage/gallery/5b18bde978a3db153b74c5b2/633298b28482cafe32270ef2.jpg",
        },
        {
            title: "公家機關",
            desc: "政府單位太陽能發電系統",
            category: "Government",
            img: "https://www.lixma.com.tw/storage/gallery/5b304cc178a3db5be33c3442/633155f98482cad641120146.jpg",
        },
    ],
    2: [
        {
            title: "學校",
            desc: "校園太陽能發電系統建置",
            category: "School",
            img: "https://www.lixma.com.tw/storage/gallery/5b17a7a378a3db3be86c8fb2/63315c2c8482cad66b178124.jpg",
        },
        {
            title: "農畜舍",
            desc: "農業設施太陽能系統",
            category: "Agriculture",
            img: "https://www.lixma.com.tw/storage/gallery/5b31b42b78a3db3ec70f72f2/6332947d8482caf0f33002a5.jpg",
        },
        {
            title: "大型地面電站",
            desc: "地面型太陽能發電廠",
            category: "Ground Plant",
            img: "https://www.lixma.com.tw/storage/gallery/5b17a47078a3db3a36696152/6331675d8482cada84409fa3.jpg",
        },
    ],
    3: [
        {
            title: "地面型",
            desc: "地面型太陽能系統建置",
            category: "Ground Type",
            img: "https://www.lixma.com.tw/storage/gallery/6331660d8482cad74e266ca3/633172a08482cadbcc612ca2.jpg",
        },
    ],
};

export default function Projects() {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const totalPages = Object.keys(pages).length;

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
                    {pages[page].map((item, i) => (
                        <Box
                            className="gallery-card"
                            key={i}
                            onClick={() => handleOpen(item)}
                        >
                            <Box className="gallery-media-wrap">
                                <img
                                    src={item.img}
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
                        page={page}
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
                                    src={selectedItem.img}
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