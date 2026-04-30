import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CategoryIcon from "@mui/icons-material/Category";
import MessageIcon from "@mui/icons-material/Message";

import "./Contact.css";

const MAIL_API = "http://localhost:3000/api/sedMail";
const MAIL_API_KEY = import.meta.env.VITE_MAIL_API_KEY || "";

function createInitialForm(categories) {
    return {
        name: "",
        phone: "",
        email: "",
        category: categories[0] || "",
        message: "",
    };
}

export default function Contact() {
    const { t, i18n } = useTranslation();
    const categories = useMemo(
        () => t("contact.categories", { returnObjects: true }),
        [t, i18n.resolvedLanguage]
    );
    const [form, setForm] = useState(() => createInitialForm(categories));
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setForm((current) => ({
            ...current,
            category: categories.includes(current.category)
                ? current.category
                : categories[0] || "",
        }));
    }, [categories]);

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ type: "", message: "" });
        setIsSubmitting(true);

        try {
            const res = await fetch(MAIL_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": MAIL_API_KEY,
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    category: form.category,
                    message: form.message.trim(),
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                throw new Error(data.message || t("contact.error"));
            }

            setForm(createInitialForm(categories));
            setStatus({
                type: "success",
                message: t("contact.success"),
            });
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message || t("contact.error"),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box className="contact-page">
            <Box className="contact-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="contact-breadcrumb">
                        <a href="/">{t("common.home")}</a>
                        <span>/</span>
                        <span>{t("nav.contact")}</span>
                    </Box>
                </Container>
            </Box>

            <Box className="contact-header">
                <Container maxWidth="lg">
                    <Box className="contact-hero">
                        <Typography className="contact-kicker">
                            {t("contact.kicker")}
                        </Typography>

                        <Typography className="contact-title">
                            {t("contact.title")}
                        </Typography>

                        <Typography className="contact-subtitle">
                            {t("contact.subtitle")}
                        </Typography>
                    </Box>

                    <Box className="contact-layout">
                        <Box className="contact-info-card">
                            <Typography className="contact-info-title">
                                {t("contact.infoTitle")}
                            </Typography>

                            <Box className="contact-info-item">
                                <span>{t("contact.serviceLabel")}</span>
                                <p>{t("contact.serviceText")}</p>
                            </Box>

                            <Box className="contact-info-item">
                                <span>{t("contact.timeLabel")}</span>
                                <p>{t("contact.timeText")}</p>
                            </Box>

                            <Box className="contact-info-item">
                                <span>{t("contact.replyLabel")}</span>
                                <p>{t("contact.replyText")}</p>
                            </Box>
                        </Box>

                        <Box className="contact-form-card">
                            <Typography className="contact-form-title">
                                {t("contact.formTitle")}
                            </Typography>

                            <form className="contact-form" onSubmit={handleSubmit}>
                                <Box className="form-row two-cols">
                                    <div className="form-group">
                                        <label htmlFor="contact-name">{t("contact.name")}</label>
                                        <div className="input-wrap">
                                            <PersonIcon className="input-icon" />
                                            <input
                                                id="contact-name"
                                                name="name"
                                                value={form.name}
                                                onChange={updateField}
                                                placeholder={t("contact.placeholders.name")}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contact-phone">{t("contact.phone")}</label>
                                        <div className="input-wrap">
                                            <PhoneIcon className="input-icon" />
                                            <input
                                                id="contact-phone"
                                                name="phone"
                                                value={form.phone}
                                                onChange={updateField}
                                                placeholder={t("contact.placeholders.phone")}
                                                required
                                            />
                                        </div>
                                    </div>
                                </Box>

                                <div className="form-group">
                                    <label htmlFor="contact-email">{t("contact.email")}</label>
                                    <div className="input-wrap">
                                        <EmailIcon className="input-icon" />
                                        <input
                                            id="contact-email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={updateField}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-category">{t("contact.category")}</label>
                                    <div className="input-wrap">
                                        <CategoryIcon className="input-icon" />
                                        <select
                                            id="contact-category"
                                            name="category"
                                            value={form.category}
                                            onChange={updateField}
                                        >
                                            {categories.map((category) => (
                                                <option key={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-message">{t("contact.message")}</label>
                                    <div className="input-wrap textarea">
                                        <MessageIcon className="input-icon" />
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            value={form.message}
                                            onChange={updateField}
                                            placeholder={t("contact.placeholders.message")}
                                            required
                                        />
                                    </div>
                                </div>

                                {status.message && (
                                    <p className={`form-status ${status.type}`}>
                                        {status.message}
                                    </p>
                                )}

                                <button
                                    className="btn btn-primary full-width"
                                    disabled={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? t("contact.submitting") : t("contact.submit")}
                                </button>
                            </form>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
