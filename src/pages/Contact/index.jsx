import { useState } from "react";

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

const initialForm = {
    name: "",
    phone: "",
    email: "",
    category: "售後服務",
    message: "",
};

export default function Contact() {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                throw new Error(data.message || "送出失敗，請稍後再試");
            }

            setForm(initialForm);
            setStatus({
                type: "success",
                message: "訊息已送出，我們會盡快與您聯繫",
            });
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message || "送出失敗，請稍後再試",
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
                        <a href="/">首頁</a>
                        <span>/</span>
                        <span>聯絡我們</span>
                    </Box>
                </Container>
            </Box>

            <Box className="contact-header">
                <Container maxWidth="lg">
                    <Box className="contact-hero">
                        <Typography className="contact-kicker">
                            CONTACT US
                        </Typography>

                        <Typography className="contact-title">
                            與 LIXMA 聯絡
                        </Typography>

                        <Typography className="contact-subtitle">
                            歡迎留下您的需求與聯絡方式，我們將盡快安排專人回覆。
                        </Typography>
                    </Box>

                    <Box className="contact-layout">
                        <Box className="contact-info-card">
                            <Typography className="contact-info-title">
                                聯絡資訊
                            </Typography>

                            <Box className="contact-info-item">
                                <span>服務項目</span>
                                <p>產品詢問 / 售後服務 / 合作洽詢</p>
                            </Box>

                            <Box className="contact-info-item">
                                <span>服務時間</span>
                                <p>週一至週五 09:00 - 18:00</p>
                            </Box>

                            <Box className="contact-info-item">
                                <span>回覆方式</span>
                                <p>收到表單後，我們會以電話或 Email 與您聯繫。</p>
                            </Box>
                        </Box>

                        <Box className="contact-form-card">
                            <Typography className="contact-form-title">
                                填寫聯絡表單
                            </Typography>

                            <form className="contact-form" onSubmit={handleSubmit}>
                                <Box className="form-row two-cols">
                                    <div className="form-group">
                                        <label htmlFor="contact-name">姓名</label>
                                        <div className="input-wrap">
                                            <PersonIcon className="input-icon" />
                                            <input
                                                id="contact-name"
                                                name="name"
                                                value={form.name}
                                                onChange={updateField}
                                                placeholder="請輸入您的姓名"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contact-phone">電話</label>
                                        <div className="input-wrap">
                                            <PhoneIcon className="input-icon" />
                                            <input
                                                id="contact-phone"
                                                name="phone"
                                                value={form.phone}
                                                onChange={updateField}
                                                placeholder="請輸入聯絡電話"
                                                required
                                            />
                                        </div>
                                    </div>
                                </Box>

                                <div className="form-group">
                                    <label htmlFor="contact-email">Email</label>
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
                                    <label htmlFor="contact-category">詢問類型</label>
                                    <div className="input-wrap">
                                        <CategoryIcon className="input-icon" />
                                        <select
                                            id="contact-category"
                                            name="category"
                                            value={form.category}
                                            onChange={updateField}
                                        >
                                            <option>售後服務</option>
                                            <option>產品詢問</option>
                                            <option>合作洽詢</option>
                                            <option>其他問題</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-message">訊息內容</label>
                                    <div className="input-wrap textarea">
                                        <MessageIcon className="input-icon" />
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            value={form.message}
                                            onChange={updateField}
                                            placeholder="請輸入您的訊息"
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
                                    {isSubmitting ? "送出中..." : "送出訊息"}
                                </button>
                            </form>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
