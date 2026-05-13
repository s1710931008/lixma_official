import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { setAdminToken } from "../../utils/adminAuth";

const LOGIN_API = "/api/admin/login";

export default function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(LOGIN_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "登入失敗");
            }

            setAdminToken(data.token);
            navigate(location.state?.from?.pathname || "/admin/news", {
                replace: true
            });
        } catch (err) {
            setMessage(err.message || "登入失敗");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit} sx={{ py: 8 }}>
                <Stack
                    spacing={3}
                    sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        bgcolor: "#ffffff",
                        p: { xs: 3, sm: 4 }
                    }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={800}>
                            後台登入
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            登入後才能新增、編輯或刪除內容。
                        </Typography>
                    </Box>

                    {message && <Alert severity="warning">{message}</Alert>}

                    <TextField
                        label="帳號"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="username"
                        required
                        fullWidth
                    />

                    <TextField
                        label="密碼"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                        fullWidth
                    />

                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "登入中..." : "登入"}
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}
