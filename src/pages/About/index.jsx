import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import MonitorRoundedIcon from "@mui/icons-material/MonitorRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import EmojiObjectsRoundedIcon from "@mui/icons-material/EmojiObjectsRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

import "./About.css";
import { historyData as localHistoryData } from "../../data/historyData";
import AdminPreviewBack from "../../components/AdminPreviewBack";

const HISTORY_API = "http://localhost:3000/api/history";

const valueData = [
    {
        icon: <BoltRoundedIcon fontSize="inherit" />,
        title: "有效利用能源",
        text: "整合 LED 照明、智能控制與節能系統，協助場域提升能源使用效率。"
    },
    {
        icon: <SolarPowerRoundedIcon fontSize="inherit" />,
        title: "開發再生能源",
        text: "提供太陽能系統規劃、設計施工與維運管理，打造穩定綠能方案。"
    },
    {
        icon: <MonitorRoundedIcon fontSize="inherit" />,
        title: "智慧雲平台",
        text: "透過監控平台與數據管理，即時掌握設備狀態與營運表現。"
    }
];

const serviceData = [
    {
        icon: <SolarPowerRoundedIcon fontSize="inherit" />,
        title: "太陽能系統",
        items: ["市電併聯系統", "自發自用系統", "BIPV 系統應用"]
    },
    {
        icon: <TrendingUpRoundedIcon fontSize="inherit" />,
        title: "太陽能投資",
        items: ["電廠投資規劃", "土地開發評估"]
    },
    {
        icon: <MonitorRoundedIcon fontSize="inherit" />,
        title: "監控系統",
        items: ["雲端監控平台", "維運管理系統"]
    },
    {
        icon: <ShieldRoundedIcon fontSize="inherit" />,
        title: "防災系統",
        items: ["快速關斷機制", "異常自動檢測"]
    }
];

/* 👇 捲動動畫元件 */
function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
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
    const [historyItems, setHistoryItems] = useState(localHistoryData);
    const sortedHistoryData = [...historyItems].sort(
        (a, b) => Number(b.year) - Number(a.year)
    );

    useEffect(() => {
        let active = true;

        async function fetchHistory() {
            try {
                const res = await fetch(HISTORY_API);

                if (!res.ok) {
                    throw new Error("Failed to fetch history");
                }

                const data = await res.json();

                if (active) {
                    setHistoryItems(Array.isArray(data) ? data : data.items ?? []);
                }
            } catch {
                if (active) {
                    setHistoryItems(localHistoryData);
                }
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
                                LIXMA TECH
                            </Typography>

                            <Typography className="about-hero-title">
                                關於我們
                            </Typography>

                            <Typography className="about-hero-desc">
                                以能源科技為核心，整合節能、太陽能與智慧監控，
                                持續為企業與公共場域打造更穩定、更安全、更永續的解決方案。
                            </Typography>

                            <Box className="about-hero-actions">
                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardRoundedIcon />}
                                    className="about-hero-btn primary"
                                    onClick={() => {
                                        document
                                            .querySelector(".services-section")
                                            ?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                >
                                    了解服務
                                </Button>

                                <Button
                                    variant="outlined"
                                    className="about-hero-btn secondary"
                                    onClick={() => {
                                        document
                                            .querySelector(".timeline-section")
                                            ?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                >
                                    發展歷程
                                </Button>
                            </Box>
                        </Box>
                    </Reveal>
                </Container>
            </Box>

            <Box className="about-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="about-breadcrumb">
                        <a href="/">首頁</a>
                        <span>/</span>
                        <span>關於我們</span>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <main className="main-content">
                    <Reveal>
                        <section className="intro-section">
                            <div className="intro-badge">
                                <WorkspacePremiumRoundedIcon />
                                <span>專業綠能整合品牌</span>
                            </div>

                            <div className="intro-quote">
                                「有效利用能源，開發再生能源」
                            </div>

                            <p className="intro-text">
                                力瑪科技創立於 2003 年，持續深耕節能照明、太陽能應用、
                                智慧監控與防災系統，從規劃、施工到維運，提供完整且可靠的整合服務。
                            </p>
                        </section>
                    </Reveal>

                    <section className="about-stats-section">
                        <Reveal delay={100}>
                            <div className="about-stat-card">
                                <div className="about-stat-icon">
                                    <VerifiedRoundedIcon />
                                </div>
                                <h3>20+</h3>
                                <p>年以上產業經驗</p>
                            </div>
                        </Reveal>

                        <Reveal delay={200}>
                            <div className="about-stat-card">
                                <div className="about-stat-icon">
                                    <SolarPowerRoundedIcon />
                                </div>
                                <h3>多元</h3>
                                <p>綠能系統整合能力</p>
                            </div>
                        </Reveal>

                        <Reveal delay={300}>
                            <div className="about-stat-card">
                                <div className="about-stat-icon">
                                    <WorkspacePremiumRoundedIcon />
                                </div>
                                <h3>多項</h3>
                                <p>專利與獎項肯定</p>
                            </div>
                        </Reveal>

                        <Reveal delay={400}>
                            <div className="about-stat-card">
                                <div className="about-stat-icon">
                                    <MonitorRoundedIcon />
                                </div>
                                <h3>完整</h3>
                                <p>監控與維運平台服務</p>
                            </div>
                        </Reveal>
                    </section>

                    <Reveal>
                        <section className="timeline-section">
                            <div className="section-header center">
                                <div className="section-chip">
                                    <EmojiObjectsRoundedIcon />
                                    <span>Company Journey</span>
                                </div>

                                <h2 className="timeline-main-title">發展歷程</h2>

                                <p className="section-desc">
                                    從節能照明起步，延伸至太陽能、智慧控制與防災系統，
                                    持續累積技術實力與案場經驗。
                                </p>
                            </div>

                            <div className="timeline-vertical">
                                {sortedHistoryData.map((item, index) => (
                                    <Reveal key={item.year + item.text} delay={index * 80}>
                                        <div
                                            className={`timeline-row ${index % 2 === 0 ? "right" : "left"}`}
                                        >
                                            <div className="timeline-col timeline-col-left">
                                                {index % 2 !== 0 && (
                                                    <div className="timeline-card">
                                                        <div className="timeline-card-icon">
                                                            <PrecisionManufacturingRoundedIcon />
                                                        </div>
                                                        <div className="timeline-card-text">
                                                            {item.text}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="timeline-col timeline-col-right">
                                                {index % 2 === 0 && (
                                                    <div className="timeline-card">
                                                        <div className="timeline-card-icon">
                                                            <PrecisionManufacturingRoundedIcon />
                                                        </div>
                                                        <div className="timeline-card-text">
                                                            {item.text}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`timeline-year timeline-year-${index % 2 === 0 ? "left" : "right"}`}>
                                                {item.year}
                                            </div>

                                            <span className="timeline-dot" />
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    <section className="core-values">
                        <Reveal>
                            <div className="section-header">
                                <div className="section-chip">
                                    <BoltRoundedIcon />
                                    <span>Core Value</span>
                                </div>
                                <h2 className="section-title">核心價值</h2>
                            </div>
                        </Reveal>

                        <div className="values-grid">
                            {valueData.map((item, index) => (
                                <Reveal key={item.title} delay={index * 120}>
                                    <div className="value-card">
                                        <div className="value-icon">{item.icon}</div>
                                        <h3>{item.title}</h3>
                                        <p>{item.text}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </section>

                    <section className="services-section">
                        <Reveal>
                            <div className="section-header">
                                <div className="section-chip">
                                    <MonitorRoundedIcon />
                                    <span>Service</span>
                                </div>
                                <h2 className="section-title">服務項目</h2>
                            </div>
                        </Reveal>

                        <div className="services-grid">
                            {serviceData.map((item, index) => (
                                <Reveal key={item.title} delay={index * 100}>
                                    <div className="service-card">
                                        <div className="service-top">
                                            <div className="service-icon">{item.icon}</div>
                                            <h3>{item.title}</h3>
                                        </div>

                                        <ul>
                                            {item.items.map((serviceItem) => (
                                                <li key={serviceItem}>{serviceItem}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                </main>
            </Container>
        </Box>
    );
}
