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
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import TranslateIcon from "@mui/icons-material/Translate";

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const languages = [
    { value: "tw", label: "中文" },
    { value: "en", label: "English" },
    { value: "cn", label: "简体中文" },
    { value: "th", label: "ไทย" },
];

export default function Nav() {
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const [open, setOpen] = useState(false);
    const currentLang = i18n.resolvedLanguage || i18n.language || "tw";

    const changeLang = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    const handleLanguageChange = (event) => {
        changeLang(event.target.value);
    };

    const menus = [
        { name: t("nav.home"), path: "/" },
        { name: t("nav.about"), path: "/about" },
        { name: t("nav.news"), path: "/news" },
        { name: t("nav.projects"), path: "/projects" },
        { name: t("nav.contact"), path: "/contact" },
        { name: t("nav.solar-calculator"), path: "/solar-calculator" },
    ];

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    top: 0,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: "#4d4f4d",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#ffffff",
                }}
            >
                <Toolbar sx={{ minHeight: { xs: 52, sm: 56 } }}>
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            fontFamily: "Georgia, serif",
                            fontWeight: 800,
                            letterSpacing: 2,
                        }}
                    >
                        LIXMA
                    </Typography>

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
                                sx={{
                                    borderColor: "rgba(255, 255, 255, 0.68)",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                    "&:hover": {
                                        borderColor: "#ffffff",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                {item.name}
                            </Button>
                        ))}

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, ml: 1 }}>
                            <TranslateIcon fontSize="small" />
                            <FormControl size="small" sx={{ minWidth: 132 }}>
                                <Select
                                    value={currentLang}
                                    onChange={handleLanguageChange}
                                    displayEmpty
                                    sx={{
                                        color: "inherit",
                                        height: 36,
                                        ".MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(255, 255, 255, 0.5)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(255, 255, 255, 0.82)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#ffffff",
                                        },
                                        ".MuiSvgIcon-root": {
                                            color: "inherit",
                                        },
                                    }}
                                >
                                    {languages.map((language) => (
                                        <MenuItem key={language.value} value={language.value}>
                                            {language.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <IconButton
                        color="inherit"
                        sx={{ display: { xs: "block", md: "none" } }}
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

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

                        <ListItem sx={{ gap: 1 }}>
                            <TranslateIcon color="action" fontSize="small" />
                            <FormControl fullWidth size="small">
                                <Select
                                    value={currentLang}
                                    onChange={handleLanguageChange}
                                >
                                    {languages.map((language) => (
                                        <MenuItem key={language.value} value={language.value}>
                                            {language.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
