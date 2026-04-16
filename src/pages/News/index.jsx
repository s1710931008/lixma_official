import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./News.css";

const newsData = [
    {
        id: 1,
        title: "台南金城國中風雨球場榮獲光鐸獎",
        date: "2024-06-21",
        award: true,
        year: "2024",
    },
    {
        id: 2,
        title: "雲林監獄屋頂太陽能榮獲光鐸獎",
        date: "2022-09-27",
        award: true,
        year: "2022",
    },
    {
        id: 3,
        title: "榮獲光電智慧建築標章",
        date: "2022-09-27",
        award: false,
        year: "2022",
    },
    {
        id: 4,
        title: "雲林監獄榮獲公共建設優質獎",
        date: "2022-09-27",
        award: true,
        year: "2022",
    },
    {
        id: 5,
        title: "再度取得太陽能直流饋線防災系統發明專利",
        date: "2022-09-27",
        award: false,
        year: "2022",
    },
    {
        id: 6,
        title: "取得太陽能防水發明專利",
        date: "2018-06-26",
        award: false,
        year: "2018",
    },
];

const mediaData = [
    {
        title: "台灣勁越集團 重押太陽能發電",
        date: "2019-01-02",
        year: "2019",
    },
    {
        title: "108年太陽光電電能躉購費率政策寒流將襲擊太陽光電產業",
        date: "2018-12-25",
        year: "2018",
    },
    {
        title: "第一金控旗下第一創投結合華南金創投等成立太陽能電廠基金公司",
        date: "2018-06-08",
        year: "2018",
    },
];

const years = ["2024", "2022", "2019", "2018"];

export default function News() {
    const [activeTab, setActiveTab] = useState("news");
    const [activeYear, setActiveYear] = useState("2024");

    const currentData =
        activeTab === "news"
            ? newsData.filter((item) => item.year === activeYear)
            : mediaData.filter((item) => item.year === activeYear);

    return (
        <Box className="news-page">

            {/* hero */}
            <Box className="news-hero">
                <Typography className="news-hero-title">最新消息</Typography>
            </Box>
            {/* breadcrumb */}
            <Box className="news-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="news-breadcrumb">
                        <a href="/">首頁</a>
                        <span>/</span>
                        <span>最新消息</span>
                    </Box>
                </Container>
            </Box>

            {/* content */}
            <Container maxWidth="lg" className="news-content-wrap">
                <Box className="news-layout">
                    {/* left */}
                    <Box className="news-sidebar">
                        <Typography className="archive-title">Archive</Typography>

                        <Box className="archive-list">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    className={`archive-item ${activeYear === year ? "active" : ""}`}
                                    onClick={() => setActiveYear(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </Box>
                    </Box>

                    {/* right */}
                    <Box className="news-main">
                        <Box className="news-tabs">
                            <button
                                className={`news-tab ${activeTab === "news" ? "active" : ""}`}
                                onClick={() => setActiveTab("news")}
                            >
                                最新消息
                            </button>
                            <button
                                className={`news-tab ${activeTab === "media" ? "active" : ""}`}
                                onClick={() => setActiveTab("media")}
                            >
                                媒體報導
                            </button>
                        </Box>

                        <Box className="news-table-head">
                            <span>標題</span>
                            <span>日期</span>
                        </Box>

                        <Box className="news-list">
                            {currentData.length > 0 ? (
                                currentData.map((item, index) => (
                                    <a href={`news/${item.id}`} className="news-card" key={index}>
                                        <Box className="news-card-left">
                                            <span className="news-card-title">{item.title}</span>

                                            {item.award && (
                                                <span className="award-badge">🏆 獲獎</span>
                                            )}
                                        </Box>

                                        <Box className="news-card-date">
                                            <span className="calendar-icon">🗓</span>
                                            <span>{item.date}</span>
                                        </Box>
                                    </a>
                                ))
                            ) : (
                                <Box className="news-empty">目前沒有資料</Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}