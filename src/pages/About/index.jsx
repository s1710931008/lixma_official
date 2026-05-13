import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import MonitorRoundedIcon from "@mui/icons-material/MonitorRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

import "./About.css";
import { historyData as localHistoryData } from "../../data/historyData";
import AdminPreviewBack from "../../components/AdminPreviewBack";

const HISTORY_API = "/api/history";

function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.2 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal ${visible ? "is-visible" : ""}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export default function About() {
    const { t } = useTranslation();
    const [historyItems, setHistoryItems] = useState(localHistoryData);
    const sortedHistoryData = [...historyItems].sort(
        (a, b) => Number(b.year) - Number(a.year)
    );
    const stats = t("about.stats", { returnObjects: true });
    const values = t("about.values", { returnObjects: true });
    const services = t("about.services", { returnObjects: true });
    const valueIcons = [
        <BoltRoundedIcon fontSize="inherit" />,
        <SolarPowerRoundedIcon fontSize="inherit" />,
        <MonitorRoundedIcon fontSize="inherit" />,
    ];
    const serviceIcons = [
        <SolarPowerRoundedIcon fontSize="inherit" />,
        <TrendingUpRoundedIcon fontSize="inherit" />,
        <MonitorRoundedIcon fontSize="inherit" />,
        <ShieldRoundedIcon fontSize="inherit" />,
    ];

    useEffect(() => {
        let active = true;

        async function fetchHistory() {
            try {
                const res = await fetch(HISTORY_API);
                if (!res.ok) throw new Error("Failed to fetch history");
                const data = await res.json();
                if (active) setHistoryItems(Array.isArray(data) ? data : data.items ?? []);
            } catch {
                if (active) setHistoryItems(localHistoryData);
            }
        }

        fetchHistory();
        return () => {
            active = false;
        };
    }, []);

    return (
        <Box className="about-page">
            <AdminPreviewBack />

            <Box className="about-hero">
                <Box className="about-hero-overlay" />
                <Container maxWidth="lg" className="about-hero-container">
                    <Reveal>
                        <Box className="about-hero-content">
                            <Typography className="about-hero-kicker">
                                {t("about.kicker")}
                            </Typography>

                            <Typography className="about-hero-title">
                                {t("about.title")}
                            </Typography>

                            <Typography className="about-hero-desc">
                                {t("about.desc")}
                            </Typography>

                            <Box className="about-hero-actions">
                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardRoundedIcon />}
                                    className="about-hero-btn primary"
                                    onClick={() =>
                                        document
                                            .querySelector(".services-section")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                >
                                    {t("about.servicesButton")}
                                </Button>

                                <Button
                                    variant="outlined"
                                    className="about-hero-btn secondary"
                                    onClick={() =>
                                        document
                                            .querySelector(".timeline-section")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                >
                                    {t("about.historyButton")}
                                </Button>
                            </Box>
                        </Box>
                    </Reveal>
                </Container>
            </Box>

            <Box className="about-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="about-breadcrumb">
                        <a href="/">{t("common.home")}</a>
                        <span>/</span>
                        <span>{t("about.title")}</span>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <main className="main-content">
                    <Reveal>
                        <section className="intro-section">
                            <div className="intro-badge">
                                <WorkspacePremiumRoundedIcon />
                                <span>{t("about.introBadge")}</span>
                            </div>

                            <div className="intro-quote">
                                {t("about.introQuote")}
                            </div>

                            <p className="intro-text">
                                {t("about.introText")}
                            </p>
                        </section>
                    </Reveal>

                    <section className="about-stats-section">
                        {stats.map((item, index) => (
                            <Reveal delay={(index + 1) * 100} key={item.label}>
                                <div className="about-stat-card">
                                    <div className="about-stat-icon">
                                        {index === 0 && <VerifiedRoundedIcon />}
                                        {index === 1 && <SolarPowerRoundedIcon />}
                                        {index === 2 && <WorkspacePremiumRoundedIcon />}
                                        {index === 3 && <MonitorRoundedIcon />}
                                    </div>
                                    <h3>{item.value}</h3>
                                    <p>{item.label}</p>
                                </div>
                            </Reveal>
                        ))}
                    </section>

                    <Reveal>
                        <section className="timeline-section">
                            <div className="section-header center">
                                <div className="section-chip">
                                    <WorkspacePremiumRoundedIcon />
                                    {t("about.historyTitle")}
                                </div>
                                <h2 className="timeline-main-title">
                                    {t("about.historyTitle")}
                                </h2>
                            </div>

                            <div className="timeline-vertical">
                                {sortedHistoryData.map((item, index) => (
                                    <div className="timeline-row" key={`${item.year}-${index}`}>
                                        <div className={`timeline-col ${index % 2 === 0 ? "timeline-col-left" : "timeline-col-right"}`}>
                                            <div className="timeline-dot" />
                                            <div className="timeline-year">{item.year}</div>
                                            <div className="timeline-card">
                                                <div className="timeline-card-icon">
                                                    <SolarPowerRoundedIcon />
                                                </div>
                                                <div className="timeline-card-text">
                                                    {item.text}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    <Reveal>
                        <section className="core-values">
                            <div className="section-header center">
                                <div className="section-chip">
                                    <VerifiedRoundedIcon />
                                    {t("about.valueTitle")}
                                </div>
                                <h2 className="timeline-main-title">
                                    {t("about.valueTitle")}
                                </h2>
                            </div>

                            <div className="values-grid">
                                {values.map((item, index) => (
                                    <div className="value-card" key={item.title}>
                                        <div className="value-icon">{valueIcons[index]}</div>
                                        <h3>{item.title}</h3>
                                        <p>{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    <Reveal>
                        <section className="services-section">
                            <div className="section-header center">
                                <div className="section-chip">
                                    <SolarPowerRoundedIcon />
                                    {t("about.serviceTitle")}
                                </div>
                                <h2 className="timeline-main-title">
                                    {t("about.serviceTitle")}
                                </h2>
                            </div>

                            <div className="services-grid">
                                {services.map((item, index) => (
                                    <div className="service-card" key={item.title}>
                                        <div className="service-top">
                                            <div className="service-icon">{serviceIcons[index]}</div>
                                            <h3>{item.title}</h3>
                                        </div>
                                        <ul>
                                            {item.items.map((text) => (
                                                <li key={text}>{text}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>
                </main>
            </Container>
        </Box>
    );
}
