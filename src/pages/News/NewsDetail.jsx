import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Trophy } from "lucide-react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./NewsDetail.css";
import { newsData } from "../../data/newsData";

const API_BASE = "http://localhost:3000/api/admin/news";

export default function NewsDetail() {
    const { id } = useParams();

    const localPage = useMemo(
        () =>
            newsData.find(
                (item) => String(item.id) === id || item.slug === id
            ),
        [id]
    );

    const [apiPage, setApiPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchPage() {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`${API_BASE}/${id}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch news");
                }

                const data = await res.json();

                if (active) {
                    setApiPage(data);
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Failed to fetch news");
                    setApiPage(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        fetchPage();

        return () => {
            active = false;
        };
    }, [id, localPage]);

    const page = apiPage || localPage;
    const currentIndex = page
        ? newsData.findIndex((item) => item.id === page.id)
        : -1;
    const prev = currentIndex > 0 ? newsData[currentIndex - 1] : null;
    const next =
        currentIndex >= 0 && currentIndex < newsData.length - 1
            ? newsData[currentIndex + 1]
            : null;
    const related =
        page?.relatedIds
            ?.map((relatedId) =>
                newsData.find((item) => item.id === relatedId)
            )
            .filter(Boolean) ?? [];

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 6, color: "text.secondary" }}>
                    {"\u8f09\u5165\u4e2d..."}
                </Box>
            </Container>
        );
    }

    if (!page) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 6 }}>
                    <h1>{"\u627e\u4e0d\u5230\u6b64\u6d88\u606f"}</h1>
                    {error && <p>{error}</p>}
                    <Link to="/admin/news">
                        {"\u8fd4\u56de\u6d88\u606f\u7ba1\u7406"}
                    </Link>
                </Box>
            </Container>
        );
    }

    return (
        <Box className="news-detail-page">
            <Box className="detail-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <nav className="breadcrumbs">
                        <ul className="breadcrumbs-container">
                            <li>
                                <Link to="/">{"\u9996\u9801"}</Link>
                            </li>
                            <li>
                                <Link to="/news">{"\u6700\u65b0\u6d88\u606f"}</Link>
                            </li>
                            <li>{page.title}</li>
                        </ul>
                    </nav>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <article className="article-container">
                    <Link to="/news" className="back-button">
                        {"\u8fd4\u56de\u6700\u65b0\u6d88\u606f"}
                    </Link>

                    <header className="article-header">
                        <div className="article-category">
                            {"\u5206\u985e"} {page.category}
                        </div>

                        <Typography variant="h3" className="article-title">
                            {page.title}
                        </Typography>

                        <div className="article-meta">
                            <div className="meta-item">
                                {"\u65e5\u671f"} {page.date}
                            </div>
                            <div className="meta-item">
                                {"\u700f\u89bd"} {page.views ?? 0} {"\u6b21"}
                            </div>
                            <div className="meta-item">
                                {"\u95b1\u8b80\u6642\u9593"}{" "}
                                {page.readMinutes ?? 3} {"\u5206\u9418"}
                            </div>
                        </div>
                    </header>

                    {page.award && (
                        <div className="award-banner">
                            <div className="award-icon" aria-hidden="true">
                                <Trophy size={48} strokeWidth={2.25} />
                            </div>

                            <div className="award-text">
                                <h3>{page.awardTitle}</h3>
                                <p>{page.awardDesc}</p>
                            </div>
                        </div>
                    )}

                    {page.coverImage && (
                        <div className="featured-image">
                            <img src={page.coverImage} alt={page.title} />
                        </div>
                    )}

                    <div className="article-content">
                        {page.sections?.map((item, index) => (
                            <div key={index}>
                                <h2>{item.title}</h2>
                                <p>{item.content}</p>
                            </div>
                        ))}

                        {page.stats?.length > 0 && (
                            <div className="stats-grid">
                                {page.stats.map((item, index) => (
                                    <div className="stat-card" key={index}>
                                        <div className="stat-number">
                                            {item.number}
                                        </div>
                                        <div className="stat-label">
                                            {item.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {page.features?.length > 0 && (
                            <ul>
                                {page.features.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        )}

                        {page.gallery?.length > 0 && (
                            <div className="image-gallery">
                                {page.gallery.map((img, index) => (
                                    <div className="gallery-item" key={index}>
                                        <img src={img.image} alt={img.alt} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="article-nav">
                        {prev && (
                            <Link
                                to={`/news/${prev.id}`}
                                className="article-nav-card"
                            >
                                <span>{"\u4e0a\u4e00\u7bc7"}</span>
                                <strong>{prev.title}</strong>
                            </Link>
                        )}

                        {next && (
                            <Link
                                to={`/news/${next.id}`}
                                className="article-nav-card next"
                            >
                                <span>{"\u4e0b\u4e00\u7bc7"}</span>
                                <strong>{next.title}</strong>
                            </Link>
                        )}
                    </div>

                    {related.length > 0 && (
                        <div className="related-articles">
                            <h2 className="related-title">
                                {"\u76f8\u95dc\u6d88\u606f"}
                            </h2>

                            <div className="related-grid">
                                {related.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/news/${item.id}`}
                                        className="related-card"
                                    >
                                        <img
                                            src={item.coverImage}
                                            alt={item.title}
                                            className="related-image"
                                        />

                                        <div className="related-content">
                                            <div className="related-date">
                                                {item.date}
                                            </div>
                                            <h3 className="related-card-title">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </Container>
        </Box>
    );
}
