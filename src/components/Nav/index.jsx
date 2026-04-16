import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Nav() {
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const [open, setOpen] = useState(false);

    const changeLang = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    const menus = [
        { name: t("nav.home"), path: "/" },
        { name: t("nav.about"), path: "/about" },
        { name: t("nav.news"), path: "/news" },
        { name: t("nav.projects"), path: "/projects" },
        { name: t("nav.contact"), path: "/contact" }
    ];

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        LIXMA
                    </Typography>

                    {/* 桌機版 */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            gap: 1,
                            alignItems: "center",
                        }}
                    >
                        {menus.map((item) => (
                            <Button
                                key={item.path}
                                color="inherit"
                                component={Link}
                                to={item.path}
                                variant={
                                    location.pathname === item.path ? "outlined" : "text"
                                }
                            >
                                {item.name}
                            </Button>
                        ))}

                        <Button onClick={() => changeLang("tw")} color="inherit">
                            中文
                        </Button>
                        <Button onClick={() => changeLang("en")} color="inherit">
                            EN
                        </Button>
                    </Box>

                    {/* 手機版 ☰ */}
                    <IconButton
                        color="inherit"
                        sx={{ display: { xs: "block", md: "none" } }}
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer 手機選單 */}
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 250 }}>
                    <List>
                        {menus.map((item) => (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    onClick={() => setOpen(false)}
                                >
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        <ListItem>
                            <Button fullWidth onClick={() => changeLang("tw")}>
                                中文
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button fullWidth onClick={() => changeLang("en")}>
                                EN
                            </Button>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}