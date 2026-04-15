import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const services = [
    {
        title: "系統規劃",
        desc: "依據場域條件、用電需求與預算配置，提供完整的太陽能發電系統規劃與效益評估。",
    },
    {
        title: "工程建置",
        desc: "從設計、施工到併網流程，由專業團隊執行，確保品質、效率與安全性。",
    },
    {
        title: "維運管理",
        desc: "持續監控設備運作狀態，提供維護與效能優化建議，讓系統長期穩定發電。",
    },
];

export default function Home() {
    return (
        <Box sx={{ bgcolor: "#f3f3f3", overflow: "hidden" }}>
            {/* 全域動畫 */}
            <Box
                sx={{
                    "@keyframes fadeUp": {
                        "0%": {
                            opacity: 0,
                            transform: "translateY(40px)",
                        },
                        "100%": {
                            opacity: 1,
                            transform: "translateY(0)",
                        },
                    },
                    "@keyframes zoomBg": {
                        "0%": {
                            transform: "scale(1.08)",
                        },
                        "100%": {
                            transform: "scale(1)",
                        },
                    },
                    "@keyframes floatCard": {
                        "0%, 100%": {
                            transform: "translateY(0px)",
                        },
                        "50%": {
                            transform: "translateY(-6px)",
                        },
                    },
                }}
            />

            {/* Hero */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: { xs: "68vh", md: "88vh" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                {/* 背景圖 */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=80")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        animation: "zoomBg 1.8s ease-out both",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(120deg, rgba(8,18,26,0.72) 0%, rgba(10,22,30,0.48) 42%, rgba(22,36,32,0.32) 100%)",
                        },
                    }}
                />

                {/* 漸層光感 */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "-12%",
                        right: "-10%",
                        width: { xs: 240, md: 420 },
                        height: { xs: 240, md: 420 },
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(70,210,160,0.30) 0%, rgba(70,210,160,0.08) 40%, rgba(70,210,160,0) 70%)",
                        filter: "blur(10px)",
                        zIndex: 1,
                    }}
                />

                <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
                    <Box
                        sx={{
                            minHeight: { xs: "68vh", md: "88vh" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "center", md: "flex-end" },
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: 620,
                                color: "#fff",
                                textAlign: { xs: "center", md: "right" },
                                pr: { xs: 0, md: 4 },
                                animation: "fadeUp 1s ease both",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: "2.5rem", md: "4.5rem" },
                                    fontWeight: 800,
                                    letterSpacing: 4,
                                    lineHeight: 1,
                                    mb: 1,
                                }}
                            >
                                LIXMA
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: "1rem", md: "1.25rem" },
                                    letterSpacing: 6,
                                    color: "rgba(255,255,255,0.8)",
                                    mb: 3,
                                }}
                            >
                                TECH
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: "1.35rem", md: "2rem" },
                                    fontWeight: 700,
                                    lineHeight: 1.4,
                                    mb: 2,
                                    textShadow: "0 4px 18px rgba(0,0,0,0.35)",
                                }}
                            >
                                攜手建立綠色永續生活
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: "0.98rem", md: "1.08rem" },
                                    lineHeight: 1.95,
                                    color: "rgba(255,255,255,0.9)",
                                    maxWidth: { xs: "100%", md: 540 },
                                    ml: { xs: 0, md: "auto" },
                                }}
                            >
                                我們致力於以科技力量推動環保解決方案，
                                為企業與下一代創造更穩定、更潔淨的未來。
                            </Typography>
                        </Box>
                    </Box>
                </Container>

                {/* 底部淡色過渡 */}
                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: { xs: 60, md: 90 },
                        background:
                            "linear-gradient(to bottom, rgba(243,243,243,0) 0%, #f3f3f3 100%)",
                        zIndex: 2,
                    }}
                />
            </Box>

            {/* 服務卡片區：上移貼近 hero */}
            <Box
                sx={{
                    position: "relative",
                    mt: { xs: -6, md: -10 },
                    zIndex: 3,
                    px: { xs: 2, md: 4 },
                    pb: { xs: 6, md: 10 },
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                            gap: { xs: 2, md: 3 },
                        }}
                    >
                        {services.map((item, index) => (
                            <Box
                                key={item.title}
                                sx={{
                                    bgcolor: "#fff",
                                    borderRadius: "18px",
                                    p: { xs: 3, md: 4.5 },
                                    minHeight: { xs: 180, md: 200 },
                                    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
                                    border: "1px solid rgba(0,0,0,0.03)",
                                    animation: `fadeUp 0.8s ease both`,
                                    animationDelay: `${0.15 * index}s`,
                                    transition: "all 0.35s ease",
                                    "&:hover": {
                                        transform: "translateY(-10px)",
                                        boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: { xs: "1.45rem", md: "1.6rem" },
                                        fontWeight: 800,
                                        color: "#111",
                                        mb: 2.5,
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    {item.title}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#6d6d6d",
                                        lineHeight: 2,
                                        fontSize: { xs: "0.98rem", md: "1rem" },
                                    }}
                                >
                                    {item.desc}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Footer 區 */}
            <Box
                sx={{
                    bgcolor: "#4b494c",
                    color: "#fff",
                    pt: { xs: 6, md: 7 },
                    pb: { xs: 4, md: 5 },
                    mt: 0,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            sx={{
                                fontSize: { xs: "2rem", md: "2.3rem" },
                                fontWeight: 800,
                                letterSpacing: 2,
                                mb: 3,
                            }}
                        >
                            LIXMA
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: { xs: 2, md: 4 },
                                color: "rgba(255,255,255,0.9)",
                                fontSize: { xs: "0.95rem", md: "1rem" },
                                mb: 3,
                            }}
                        >
                            <Typography>台中市南屯區新富路 68 號</Typography>
                            <Typography>+886-4-3504-8188</Typography>
                            <Typography>+886-4-2359-9739</Typography>
                            <Typography>service@lixma.com.tw</Typography>
                        </Box>

                        <Typography sx={{ color: "rgba(255,255,255,0.82)" }}>
                            © 2026 LIXMA. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}