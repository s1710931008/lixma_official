import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    const footerItems = [
        {
            icon: LocationOnOutlinedIcon,
            text: t("footer.address"),
        },
        {
            icon: PhoneOutlinedIcon,
            text: "+886-4-3504-8188",
        },
        {
            icon: PrintOutlinedIcon,
            text: "+886-4-2359-9739",
        },
        {
            icon: EmailOutlinedIcon,
            text: "service@lixma.com.tw",
        },
    ];

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#4d4f4d",
                borderTop: "1px solid rgba(255, 255, 255, 0.16)",
                py: { xs: 5.5, md: 2 },
                px: 2,
            }}
        >
            <Box sx={{ maxWidth: 1120, mx: "auto", textAlign: "center" }}>
                <Typography
                    sx={{
                        fontSize: { xs: "1.4rem", md: "1.7rem" },
                        fontWeight: 800,
                        mb: { xs: 3, md: 4 },
                        letterSpacing: 2,
                        color: "#ffffff",
                        fontFamily: "Georgia, serif",
                    }}
                >
                    LIXMA
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        mb: { xs: 3, md: 4 },
                    }}
                >
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 1.6, md: 3.5 }}
                        alignItems="center"
                        justifyContent="center"
                        flexWrap="wrap"
                        useFlexGap
                        sx={{
                            width: "fit-content",
                            maxWidth: "100%",
                            mx: "auto",
                            color: "rgba(255, 255, 255, 0.92)",
                        }}
                    >
                        {footerItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Stack
                                    key={item.text}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                        minWidth: 0,
                                        textAlign: "center",
                                    }}
                                >
                                    <Icon sx={{ fontSize: 19, flexShrink: 0 }} />
                                    <Typography
                                        sx={{
                                            fontSize: { xs: "0.92rem", md: "0.96rem" },
                                            lineHeight: 1.6,
                                            fontWeight: 500,
                                            color: "rgba(255, 255, 255, 0.9)",
                                            whiteSpace: { xs: "normal", md: "nowrap" },
                                        }}
                                    >
                                        {item.text}
                                    </Typography>
                                </Stack>
                            );
                        })}
                    </Stack>
                </Box>

                <Typography
                    sx={{
                        color: "rgba(255, 255, 255, 0.86)",
                        fontSize: { xs: "0.84rem", md: "0.9rem" },
                    }}
                >
                    {t("footer.rights")}
                </Typography>
            </Box>
        </Box>
    );
}
