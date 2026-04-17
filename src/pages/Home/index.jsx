import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useRef, useState } from "react";

import SolarPowerIcon from "@mui/icons-material/SolarPower";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import "./Home.css";

/* 👇 捲動動畫元件 <Reveal delay={200}> */
function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false); //一開始是false，還沒進入畫面

    useEffect(() => {
        const observer = new IntersectionObserver( //監聽元素有沒有出現在畫面裡
            ([entry]) => { //entry就是被監聽的元素
                if (entry.isIntersecting) { //是否進入可視區
                    setVisible(true); //如果是，就變成true，加上is-visible這個class
                }
            },
            { threshold: 0.2 } //0.2代表當元素有20%進入畫面時，就觸發
        );

        if (ref.current) observer.observe(ref.current); //開始監聽

        return () => observer.disconnect(); //停止監聽
    }, []);

    return (
        <div
            ref={ref} //把這個div掛到ref上，讓observer可以監聽
            className={`reveal ${visible ? "is-visible" : ""}`} //如果visible是true，就加上is-visible這個class
            style={{ transitionDelay: `${delay}ms` }} //延遲時間
        >
            {children} {/* 傳進來的東西 */}
        </div>
    );
}


const services = [
    {
        title: "系統規劃",
        desc: "依據場域條件、用電需求與預算配置，提供完整的太陽能發電系統規劃與效益評估。",
        icon: <SolarPowerIcon fontSize="large" />,
    },
    {
        title: "工程建置",
        desc: "從設計、施工到併網流程，由專業團隊執行，確保品質、效率與安全性。",
        icon: <EngineeringIcon fontSize="large" />,
    },
    {
        title: "維運管理",
        desc: "持續監控設備運作狀態，提供維護與效能優化建議，讓系統長期穩定發電。",
        icon: <MonitorHeartIcon fontSize="large" />,
    },
];

export default function Home() {
    return (
        <Box className="home-page">
            {/* Hero */}
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
                                    攜手建立綠色永續生活
                                </Typography>
                                <Reveal delay={200}>
                                    <Typography className="home-main-desc">
                                        我們致力於以科技力量推動環保解決方案，
                                        為企業與下一代創造更穩定、更潔淨的未來，
                                        以整合型綠能規劃打造高效率、可持續的場域價值。
                                    </Typography>
                                </Reveal>

                            </Box>
                        </Reveal>
                    </Box>
                </Container>
            </Box>

            {/* Solar section */}
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
                                    太陽能光電發電系統，結合專業規劃、工程建置與長期維運，
                                    為企業打造高效、穩定且兼具永續價值的綠能方案，
                                    讓能源管理不只是成本控制，更是未來競爭力。
                                </Typography>
                            </Reveal>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Services */}
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
                                提供太陽能光電系統規劃、建置施工、維運管理與節能整合方案，
                                協助企業與場域打造更穩定、更高效的綠能系統。
                            </Typography>
                        </Reveal>
                    </Box>

                    <Box className="home-services-grid pro-layout">
                        {services.map((item, index) => (
                            <Reveal delay={index * 200}>
                                <Box className="service-card pro-card" key={item.title}>
                                    <Box className="service-card-top-line" />

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
                                            查看更多
                                            <ArrowOutwardIcon className="service-card-link-icon" />
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