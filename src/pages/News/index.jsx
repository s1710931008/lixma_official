import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { mediaData, newsData } from "../../data/newsData";
import "./News.css";

const NEWS_API = "http://localhost:3000/api/news";
const MEDIA_API = "http://localhost:3000/api/media";

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
    const [activeTab, setActiveTab] = useState("news");
    const [activeYear, setActiveYear] = useState("");
    const [apiNewsData, setApiNewsData] = useState(newsData);
    const [apiMediaData, setApiMediaData] = useState(mediaData);

    useEffect(() => {
        async function fetchList(url, fallback, setter) {
            try {
                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error("Failed to fetch list");
                }

                const data = await res.json();
                setter(Array.isArray(data) ? data : fallback);
            } catch {
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

    useEffect(() => {
        if (!currentYears.length) {
            setActiveYear("");
            return;
        }

        if (!currentYears.includes(activeYear)) {
            setActiveYear(currentYears[0]);
        }
    }, [activeYear, currentYears]);

    const currentData = currentSource.filter(
        (item) => getItemYear(item) === activeYear
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
                    {"\u6700\u65b0\u6d88\u606f"}
                </Typography>
            </Box>

            <Box className="news-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="news-breadcrumb">
                        <Link to="/">{"\u9996\u9801"}</Link>
                        <span>/</span>
                        <span>{"\u6700\u65b0\u6d88\u606f"}</span>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" className="news-content-wrap">
                <Box className="news-layout">
                    <Box className="news-sidebar">
                        <Typography className="archive-title">
                            Archive
                        </Typography>

                        <Box className="archive-list">
                            {archiveYears.map((year) => (
                                <button
                                    key={year}
                                    className={`archive-item ${
                                        activeYear === year ? "active" : ""
                                    }`}
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
                                className={`news-tab ${
                                    activeTab === "news" ? "active" : ""
                                }`}
                                onClick={() => handleTabChange("news")}
                            >
                                {"\u6700\u65b0\u6d88\u606f"}
                            </button>
                            <button
                                className={`news-tab ${
                                    activeTab === "media" ? "active" : ""
                                }`}
                                onClick={() => handleTabChange("media")}
                            >
                                {"\u5a92\u9ad4\u5831\u5c0e"}
                            </button>
                        </Box>

                        <Box className="news-table-head">
                            <span>{"\u6a19\u984c"}</span>
                            <span>{"\u65e5\u671f"}</span>
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
                                                        {"\u7372\u734e"}
                                                    </span>
                                                )}
                                            </Box>

                                            <Box className="news-card-date">
                                                <span>{item.date}</span>
                                            </Box>
                                        </>
                                    );

                                    if (activeTab === "media") {
                                        if (item.url) {
                                            return (
                                                <a
                                                    className="news-card"
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    key={`${activeTab}-${item.id || index}`}
                                                >
                                                    {content}
                                                </a>
                                            );
                                        }

                                        return (
                                            <div
                                                className="news-card"
                                                key={`${activeTab}-${item.id || index}`}
                                            >
                                                {content}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            to={`/news/${item.id}`}
                                            className="news-card"
                                            key={`${activeTab}-${item.id}`}
                                        >
                                            {content}
                                        </Link>
                                    );
                                })
                            ) : (
                                <Box className="news-empty">
                                    {"\u76ee\u524d\u6c92\u6709\u8cc7\u6599"}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
