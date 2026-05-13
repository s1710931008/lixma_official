import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./NewsDetail.css";
import { newsData } from "../../data/newsData";
import AdminPreviewBack from "../../components/AdminPreviewBack";

const API_BASE = "/api/news";

export default function NewsDetail() {
    const { t } = useTranslation();
    const { id } = useParams();

    const localPage = useMemo(
        () =>
            newsData.find(
                (item) => String(item.id) === id || item.slug === id
            ),
        [id]
    );

    const [apiPage, setApiPage] = useState(null);
    const [loading, setLoading] = useState(!localPage);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function fetchPage() {
            const controller = new AbortController();
            const timeoutId = window.setTimeout(() => {
                controller.abort();
            }, 5000);

            setLoading(!localPage);
            setError("");

            try {
                const res = await fetch(`${API_BASE}/${id}`, {
                    signal: controller.signal
                });

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
                window.clearTimeout(timeoutId);

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
                    {t("common.loading")}
                </Box>
            </Container>
        );
    }

    if (!page) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 6 }}>
                    <h1>{t("common.notFound")}</h1>
                    {error && <p>{error}</p>}
                    <Link to="/admin/news">
                        {t("news.adminBack")}
                    </Link>
                </Box>
            </Container>
        );
    }

    return (
        <Box className="news-detail-page">
            <AdminPreviewBack />

            <Box className="detail-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <nav className="breadcrumbs">
                        <ul className="breadcrumbs-container">
                            <li>
                                <Link to="/">{t("common.home")}</Link>
                            </li>
                            <li>
                                <Link to="/news">{t("news.title")}</Link>
                            </li>
                            <li>{page.title}</li>
                        </ul>
                    </nav>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <article className="article-container">
                    <Link to="/news" className="back-button">
                        {t("news.back")}
                    </Link>

                    <header className="article-header">
                        <div className="article-category">
                            {t("common.category")} {page.category}
                        </div>

                        <Typography variant="h3" className="article-title">
                            {page.title}
                        </Typography>

                        <div className="article-meta">
                            <div className="meta-item">
                                {t("common.date")} {page.date}
                            </div>
                            <div className="meta-item">
                                {t("common.views")} {page.views ?? 0} {t("common.times")}
                            </div>
                            <div className="meta-item">
                                {t("common.readTime")}{" "}
                                {page.readMinutes ?? 3} {t("common.minutes")}
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
                                <span>{t("news.prev")}</span>
                                <strong>{prev.title}</strong>
                            </Link>
                        )}

                        {next && (
                            <Link
                                to={`/news/${next.id}`}
                                className="article-nav-card next"
                            >
                                <span>{t("news.next")}</span>
                                <strong>{next.title}</strong>
                            </Link>
                        )}
                    </div>

                    {related.length > 0 && (
                        <div className="related-articles">
                            <h2 className="related-title">
                                {t("news.related")}
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
