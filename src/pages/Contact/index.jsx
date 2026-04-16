import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CategoryIcon from "@mui/icons-material/Category";
import MessageIcon from "@mui/icons-material/Message";

import "./Contact.css";

export default function Contact() {
    return (
        <Box className="contact-page">
            {/* breadcrumb */}
            <Box className="contact-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="contact-breadcrumb">
                        <a href="/">首頁</a>
                        <span>/</span>
                        <span>聯絡我們</span>
                    </Box>
                </Container>
            </Box>

            {/* header */}
            <Box className="contact-header">
                <Container maxWidth="lg">
                    <Box className="contact-hero">
                        <Typography className="contact-kicker">
                            CONTACT US
                        </Typography>

                        <Typography className="contact-title">
                            歡迎與我們聯繫
                        </Typography>

                        <Typography className="contact-subtitle">
                            共同打造綠色能源未來，我們的專業團隊將依據您的需求，
                            提供太陽能系統與專業諮詢服務。
                        </Typography>
                    </Box>

                    <Box className="contact-layout">
                        {/* 左側資訊 */}
                        <Box className="contact-info-card">
                            <Typography className="contact-info-title">
                                聯絡資訊
                            </Typography>

                            <Box className="contact-info-item">
                                <span>服務項目</span>
                                <p>太陽能系統 / 雲端監控 / 維運管理</p>
                            </Box>

                            <Box className="contact-info-item">
                                <span>服務時間</span>
                                <p>週一至週五 09:00 - 18:00</p>
                            </Box>

                            <Box className="contact-info-item">
                                <span>聯繫方式</span>
                                <p>填寫表單，我們將盡快與您聯繫</p>
                            </Box>
                        </Box>

                        {/* 表單 */}
                        <Box className="contact-form-card">
                            <Typography className="contact-form-title">
                                填寫諮詢表單
                            </Typography>

                            <form className="contact-form">
                                <Box className="form-row two-cols">

                                    {/* 姓名 */}
                                    <div className="form-group">
                                        <label>姓名</label>
                                        <div className="input-wrap">
                                            <PersonIcon className="input-icon" />
                                            <input placeholder="請輸入您的姓名" />
                                        </div>
                                    </div>

                                    {/* 電話 */}
                                    <div className="form-group">
                                        <label>電話</label>
                                        <div className="input-wrap">
                                            <PhoneIcon className="input-icon" />
                                            <input placeholder="請輸入聯絡電話" />
                                        </div>
                                    </div>

                                </Box>

                                {/* Email */}
                                <div className="form-group">
                                    <label>Email</label>
                                    <div className="input-wrap">
                                        <EmailIcon className="input-icon" />
                                        <input placeholder="your@email.com" />
                                    </div>
                                </div>

                                {/* 分類 */}
                                <div className="form-group">
                                    <label>詢問分類</label>
                                    <div className="input-wrap">
                                        <CategoryIcon className="input-icon" />
                                        <select>
                                            <option>請選擇分類</option>
                                            <option>太陽能投資</option>
                                            <option>雲端監控</option>
                                            <option>產品詢問</option>
                                            <option>其他</option>
                                        </select>
                                    </div>
                                </div>

                                {/* 訊息 */}
                                <div className="form-group">
                                    <label>詢問內容</label>
                                    <div className="input-wrap textarea">
                                        <MessageIcon className="input-icon" />
                                        <textarea placeholder="請描述您的需求..." />
                                    </div>
                                </div>

                                <button className="btn btn-primary full-width">
                                    送出訊息
                                </button>
                            </form>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}