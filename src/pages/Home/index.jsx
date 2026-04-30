import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import SolarPowerIcon from "@mui/icons-material/SolarPower";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import "./Home.css";

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

const serviceAssets = [
    {
        image: "/images/topic4-bg3.jpg",
        icon: <SolarPowerIcon fontSize="large" />,
    },
    {
        image: "/images/topic4-bg2.jpg",
        icon: <EngineeringIcon fontSize="large" />,
    },
    {
        image: "/images/about_pic3.jpg",
        icon: <MonitorHeartIcon fontSize="large" />,
    },
];

export default function Home() {
    const { t } = useTranslation();
    const services = t("home.services.items", { returnObjects: true });

    return (
        <Box className="home-page">
            <Box className="home-hero">
                <Box className="home-hero-overlay" />
                <Container maxWidth="xl" className="home-hero-container">
                    <Box className="home-hero-inner">
                        <Reveal>
                            <Box className="home-hero-right">
                                <Typography className="home-brand-title">
                                    {t("home.hero.brand")}
                                </Typography>

                                <Typography className="home-brand-subtitle">
                                    {t("home.hero.subtitle")}
                                </Typography>

                                <Typography className="home-main-title">
                                    {t("home.hero.title")}
                                </Typography>

                                <Reveal delay={200}>
                                    <Typography className="home-main-desc">
                                        {t("home.hero.desc")}
                                    </Typography>
                                </Reveal>
                            </Box>
                        </Reveal>
                    </Box>
                </Container>
            </Box>

            <Box className="home-solar-section">
                <Box className="home-solar-overlay" />

                <Container maxWidth="xl" className="home-solar-container">
                    <Box className="home-solar-inner">
                        <Box className="home-solar-content">
                            <Reveal>
                                <Box className="home-solar-badge solar-fade-1">
                                    <SolarPowerIcon className="home-solar-badge-icon" />
                                    <Typography className="home-solar-badge-text">
                                        {t("home.solar.badge")}
                                    </Typography>
                                </Box>
                            </Reveal>

                            <Reveal delay={200}>
                                <Typography className="home-solar-title solar-fade-2">
                                    {t("home.solar.titleA")}
                                    <Box component="span" className="home-solar-title-green">
                                        {t("home.solar.titleB")}
                                    </Box>
                                    <br />
                                    {t("home.solar.titleC")}
                                </Typography>
                            </Reveal>

                            <Reveal delay={400}>
                                <Typography className="home-solar-desc solar-fade-3">
                                    {t("home.solar.desc")}
                                </Typography>
                            </Reveal>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Box className="home-services-section">
                <Box className="home-services-bg-glow glow-left" />
                <Box className="home-services-bg-glow glow-right" />

                <Container maxWidth="xl">
                    <Box className="home-services-header">
                        <Reveal>
                            <Typography className="home-services-title">
                                <AutoAwesomeIcon className="home-services-title-icon" />
                                {t("home.services.title")}
                            </Typography>
                        </Reveal>

                        <Reveal delay={200}>
                            <Typography className="home-services-desc">
                                {t("home.services.desc")}
                            </Typography>
                        </Reveal>
                    </Box>

                    <Box className="home-services-grid pro-layout">
                        {services.map((item, index) => (
                            <Reveal delay={index * 200} key={item.title}>
                                <Box className="service-card pro-card">
                                    <Box className="service-card-image-wrap">
                                        <img
                                            className="service-card-image"
                                            src={serviceAssets[index].image}
                                            alt={item.title}
                                        />
                                    </Box>

                                    <Box className="service-card-body">
                                        <Box className="service-card-head">
                                            <Box className="service-card-icon-wrap">
                                                {serviceAssets[index].icon}
                                            </Box>

                                            <Typography className="service-card-number">
                                                0{index + 1}
                                            </Typography>
                                        </Box>

                                        <Typography className="service-card-title">
                                            {item.title}
                                        </Typography>

                                        <Typography className="service-card-desc">
                                            {item.desc}
                                        </Typography>

                                        <Box className="service-card-footer">
                                            <Box className="service-card-link">
                                                {t("home.services.learnMore")}
                                                <ArrowOutwardIcon className="service-card-link-icon" />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Reveal>
                        ))}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
