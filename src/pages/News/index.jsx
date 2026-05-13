import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { mediaData, newsData } from "../../data/newsData";
import "./News.css";

const NEWS_API = "/api/news";
const MEDIA_API = "/api/media";

function getItemYear(item) {
    return item.year || String(item.date || "").slice(0, 4);
}

function getYears(items) {
    return [...new Set(items.map(getItemYear).filter(Boolean))].sort(
        (a, b) => Number(b) - Number(a)
    );
}

function hasYear(items, year) {
    return items.some((item) => getItemYear(item) === year);
}

export default function News() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("news");
    const [activeYear, setActiveYear] = useState("");
    const [apiNewsData, setApiNewsData] = useState(newsData);
    const [apiMediaData, setApiMediaData] = useState(mediaData);

    useEffect(() => {
        async function fetchList(url, fallback, setter) {
            try {
                const res = await axios.get(url);

                setter(Array.isArray(res.data) ? res.data : fallback);
            } catch (error) {
                console.error("API Error:", error);
                setter(fallback);
            }
        }

        fetchList(NEWS_API, newsData, setApiNewsData);
        fetchList(MEDIA_API, mediaData, setApiMediaData);
    }, []);

    const currentSource = activeTab === "news" ? apiNewsData : apiMediaData;
    const currentYears = useMemo(() => getYears(currentSource), [currentSource]);
    const archiveYears = useMemo(
        () => getYears([...apiNewsData, ...apiMediaData]),
        [apiNewsData, apiMediaData]
    );

    const selectedYear = currentYears.includes(activeYear)
        ? activeYear
        : currentYears[0] || "";
    const currentData = currentSource.filter(
        (item) => getItemYear(item) === selectedYear
    );

    function handleTabChange(tab) {
        setActiveTab(tab);
    }

    function handleYearChange(year) {
        if (!hasYear(currentSource, year)) {
            if (hasYear(apiNewsData, year)) {
                setActiveTab("news");
            } else if (hasYear(apiMediaData, year)) {
                setActiveTab("media");
            }
        }

        setActiveYear(year);
    }

    return (
        <Box className="news-page">
            <Box className="news-hero">
                <Typography className="news-hero-title">
                    {t("news.title")}
                </Typography>
            </Box>

            <Box className="news-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="news-breadcrumb">
                        <Link to="/">{t("common.home")}</Link>
                        <span>/</span>
                        <span>{t("news.title")}</span>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" className="news-content-wrap">
                <Box className="news-layout">
                    <Box className="news-sidebar">
                        <Typography className="archive-title">
                            {t("news.archive")}
                        </Typography>

                        <Box className="archive-list">
                            {archiveYears.map((year) => (
                                <button
                                    key={year}
                                    className={`archive-item ${selectedYear === year ? "active" : ""}`}
                                    onClick={() => handleYearChange(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </Box>
                    </Box>

                    <Box className="news-main">
                        <Box className="news-tabs">
                            <button
                                className={`news-tab ${activeTab === "news" ? "active" : ""}`}
                                onClick={() => handleTabChange("news")}
                            >
                                {t("news.newsTab")}
                            </button>

                            <button
                                className={`news-tab ${activeTab === "media" ? "active" : ""}`}
                                onClick={() => handleTabChange("media")}
                            >
                                {t("news.mediaTab")}
                            </button>
                        </Box>

                        <Box className="news-table-head">
                            <span>{t("news.tableTitle")}</span>
                            <span>{t("news.tableDate")}</span>
                        </Box>

                        <Box className="news-list">
                            {currentData.length > 0 ? (
                                currentData.map((item, index) => {
                                    const content = (
                                        <>
                                            <Box className="news-card-left">
                                                <span className="news-card-title">
                                                    {item.title}
                                                </span>

                                                {item.award && (
                                                    <span className="award-badge">
                                                        {t("news.award")}
                                                    </span>
                                                )}
                                            </Box>

                                            <Box className="news-card-date">
                                                <span>{item.date}</span>
                                            </Box>
                                        </>
                                    );

                                    if (activeTab === "media") {
                                        return item.url ? (
                                            <a
                                                key={`${activeTab}-${item.id || index}`}
                                                className="news-card"
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {content}
                                            </a>
                                        ) : (
                                            <div
                                                key={`${activeTab}-${item.id || index}`}
                                                className="news-card"
                                            >
                                                {content}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={`${activeTab}-${item.id}`}
                                            to={`/news/${item.id}`}
                                            className="news-card"
                                        >
                                            {content}
                                        </Link>
                                    );
                                })
                            ) : (
                                <Box className="news-empty">
                                    {t("news.empty")}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
