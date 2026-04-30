import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useRef, useState } from "react";

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

const services = [
    {
        title: "太陽能系統規劃",
        desc: "依據場域條件、用電需求與投資目標，提供案場評估、配置規劃與效益試算。",
        image: "/images/topic4-bg3.jpg",
        icon: <SolarPowerIcon fontSize="large" />,
    },
    {
        title: "工程設計與施工",
        desc: "整合結構、機電與施工管理，確保系統安全、穩定並符合長期營運需求。",
        image: "/images/topic4-bg2.jpg",
        icon: <EngineeringIcon fontSize="large" />,
    },
    {
        title: "維運監控服務",
        desc: "透過監控與維護流程追蹤發電表現，協助案場維持穩定收益與設備壽命。",
        image: "/images/about_pic3.jpg",
        icon: <MonitorHeartIcon fontSize="large" />,
    },
];

export default function Home() {
    return (
        <Box className="home-page">
            <Box className="home-hero">
                <Box className="home-hero-overlay" />
                <Container maxWidth="xl" className="home-hero-container">
                    <Box className="home-hero-inner">
                        <Reveal>
                            <Box className="home-hero-right">
                                <Typography className="home-brand-title">
                                    LIXMA
                                </Typography>

                                <Typography className="home-brand-subtitle">
                                    TECH
                                </Typography>

                                <Typography className="home-main-title">
                                    打造穩定可靠的太陽能系統
                                </Typography>

                                <Reveal delay={200}>
                                    <Typography className="home-main-desc">
                                        LIXMA 專注於太陽能系統規劃、工程施工與後續維運，
                                        協助企業、學校與公共場域導入乾淨能源，創造長期穩定效益。
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
                                        SOLAR ENERGY
                                    </Typography>
                                </Box>
                            </Reveal>

                            <Reveal delay={200}>
                                <Typography className="home-solar-title solar-fade-2">
                                    SOLAR
                                    <Box component="span" className="home-solar-title-green">
                                        POWER
                                    </Box>
                                    <br />
                                    SYSTEMS
                                </Typography>
                            </Reveal>

                            <Reveal delay={400}>
                                <Typography className="home-solar-desc solar-fade-3">
                                    從屋頂型、地面型到建築整合型太陽能系統，
                                    我們以專業設計與施工品質，協助客戶完成高效穩定的再生能源建置。
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
                                我們的服務
                            </Typography>
                        </Reveal>

                        <Reveal delay={200}>
                            <Typography className="home-services-desc">
                                從前期評估、系統設計、工程施工到後續維運，
                                LIXMA 以完整服務流程協助客戶建置可靠的太陽能系統。
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
                                            src={item.image}
                                            alt={item.title}
                                        />
                                    </Box>

                                    <Box className="service-card-body">
                                        <Box className="service-card-head">
                                            <Box className="service-card-icon-wrap">
                                                {item.icon}
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
                                                了解更多
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
