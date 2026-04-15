import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#4b4949ff",
                borderTop: "1px solid #e0e0e0",
                py: { xs: 5, md: 6 },
                px: 2,
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: "auto", textAlign: "center", }}>
                <Typography
                    sx={{
                        fontSize: { xs: "1.3rem", md: "1.6rem" },
                        fontWeight: 700,
                        mb: 3,
                        letterSpacing: 2,
                        color: "#ffffffff",
                    }}
                >
                    LIXMA
                </Typography>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 1.5, md: 4 }}
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                    sx={{
                        mb: 3,
                        color: "#fff",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2" >
                            台中市南屯區新富路 68 號
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneOutlinedIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2">
                            +886-4-3504-8188
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <PrintOutlinedIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2">
                            +886-4-2359-9739
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <EmailOutlinedIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2">
                            service@lixma.com.tw
                        </Typography>
                    </Stack>
                </Stack>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#ffffffff",
                        fontSize: "0.85rem",
                    }}
                >
                    © 2026 LIXMA. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}