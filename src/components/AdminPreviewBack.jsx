import { Link, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function AdminPreviewBack() {
    const [searchParams] = useSearchParams();
    const adminReturn = searchParams.get("adminReturn");

    if (!adminReturn?.startsWith("/admin")) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                right: { xs: 16, sm: 24 },
                bottom: { xs: 16, sm: 24 },
                zIndex: 1300
            }}
        >
            <Button
                component={Link}
                to={adminReturn}
                variant="contained"
                sx={{
                    borderRadius: 999,
                    px: 2.5,
                    py: 1.2,
                    fontWeight: 800,
                    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.22)"
                }}
            >
                返回後台管理
            </Button>
        </Box>
    );
}
