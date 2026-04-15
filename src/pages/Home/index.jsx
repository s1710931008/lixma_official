import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Home() {
    return (
        <Box sx={{ bgcolor: "#f3f3f3" }}>
            {/* Hero */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: { xs: "78vh", md: "92vh" },
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    overflow: "hidden",
                }}
            >
                {/* 遮罩 */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.08) 100%)",
                    }}
                />


                <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
                    <Box
                        sx={{
                            minHeight: { xs: "78vh", md: "92vh" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Box
                            sx={{
                                color: "#fff",
                                maxWidth: 460,
                                textAlign: "right",
                                mr: { xs: 1, md: 6 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: "2.2rem", md: "4rem" },
                                    fontWeight: 700,
                                    letterSpacing: 3,
                                    fontFamily: "Georgia, serif",
                                    lineHeight: 1.1,
                                }}
                            >
                                LIXMA
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: "1rem", md: "1.5rem" },
                                    letterSpacing: 4,
                                    mb: 3,
                                    opacity: 0.9,
                                }}
                            >
                                TECH
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: "1.2rem", md: "1.7rem" },
                                    fontWeight: 600,
                                    mb: 1.5,
                                    textShadow: "0 2px 10px rgba(0,0,0,0.35)",
                                }}
                            >
                                攜手建立綠色永續生活
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: "0.95rem", md: "1.08rem" },
                                    lineHeight: 1.9,
                                    opacity: 0.92,
                                }}
                            >
                                我們致力於以科技力量推動環保解決方案，
                                為企業與下一代創造更穩定、更潔淨的未來。
                            </Typography>
                        </Box>
                    </Box>
                </Container>

                {/* 底部白帶 */}
                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: { xs: 90, md: 130 },
                        bgcolor: "#f3f3f3",
                        zIndex: 1,
                    }}
                />

                {/* Welcome 疊字 */}
                <Box
                    sx={{
                        position: "absolute",
                        right: { xs: 12, md: 80 },
                        top: { xs: "78%", md: "74%" },
                        transform: "translateY(-50%)",
                        zIndex: 3,
                        display: "flex",
                        alignItems: "flex-end",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: "3rem", md: "6.5rem" },
                            lineHeight: 0.95,
                            fontWeight: 300,
                            color: "#f4f1ea",
                            letterSpacing: 1,
                            textShadow: "0 4px 16px rgba(0,0,0,0.18)",
                        }}
                    >
                        W
                    </Typography>

                    <Box
                        sx={{
                            px: { xs: 1.5, md: 2.5 },
                            py: { xs: 0.4, md: 0.8 },
                            bgcolor: "rgba(205, 235, 242, 0.9)",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: "3rem", md: "6.5rem" },
                                lineHeight: 0.95,
                                fontWeight: 300,
                                color: "#6f97a2",
                                letterSpacing: 1,
                            }}
                        >
                            elcome
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: { xs: 36, md: 68 },
                            bgcolor: "#206d63",
                        }}
                    />
                </Box>
            </Box>

            {/* 圖壓字介紹區 */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: { xs: "56vh", md: "70vh" },
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=80")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to right, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.08) 100%)",
                    }}
                />

                <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
                    <Box
                        sx={{
                            minHeight: { xs: "56vh", md: "70vh" },
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ maxWidth: 560, color: "#fff" }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: "2rem", md: "4.2rem" },
                                    fontWeight: 800,
                                    lineHeight: 1,
                                    letterSpacing: 2,
                                    mb: 2,
                                }}
                            >
                                SOLAR
                                <Box component="span" sx={{ color: "#36d17c", ml: 1 }}>
                                    POWER
                                </Box>
                                <br />
                                SYSTEMS
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: "1rem", md: "1.1rem" },
                                    lineHeight: 1.9,
                                    opacity: 0.92,
                                    maxWidth: 520,
                                }}
                            >
                                太陽能光電發電系統，結合專業規劃、工程建置與長期維運，
                                為企業打造高效、穩定且兼具永續價值的綠能方案。
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* 服務區 */}
            <Box
                sx={{
                    bgcolor: "#f3f3f3",
                    py: { xs: 8, md: 12 },
                    px: { xs: 2, md: 6 },
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: "center" }}>
                        <Typography
                            sx={{
                                fontSize: { xs: "1.8rem", md: "3rem" },
                                fontWeight: 700,
                                color: "#1f1f1f",
                                mb: 2,
                                letterSpacing: 1,
                            }}
                        >
                            我們的服務
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                color: "#666",
                                maxWidth: 760,
                                mx: "auto",
                                lineHeight: 1.8,
                            }}
                        >
                            提供太陽能光電系統規劃、建置施工、維運管理與節能整合方案，
                            協助企業與場域打造更穩定、更高效的綠能系統。
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                            gap: 3,
                        }}
                    >
                        {[
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
                        ].map((item) => (
                            <Box
                                key={item.title}
                                sx={{
                                    bgcolor: "#fff",
                                    borderRadius: 3,
                                    p: { xs: 3, md: 4 },
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "translateY(-6px)",
                                        boxShadow: "0 16px 36px rgba(0,0,0,0.10)",
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "1.3rem",
                                        fontWeight: 700,
                                        mb: 2,
                                        color: "#1f1f1f",
                                    }}
                                >
                                    {item.title}
                                </Typography>

                                <Typography sx={{ color: "#666", lineHeight: 1.9 }}>
                                    {item.desc}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}