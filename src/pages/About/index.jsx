import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./About.css";

const historyData = [
    { year: "2003", text: "公司成立，首次導入T5螢光燈具" },
    { year: "2004", text: "自行研發LED燈具並導入市場" },
    { year: "2005", text: "投入太陽能產業" },
    { year: "2013", text: "研發感應燈控" },
    { year: "2015", text: "開發完成節能自動控制系統" },
    { year: "2016", text: "獲得BIPV太陽能導水型支架發明專利" },
    { year: "2017", text: "完成屏東監獄太陽能案場建置" },
    { year: "2018", text: "完成雲林、嘉義監獄太陽能案場建置" },
    { year: "2021", text: "🏆 雲林監獄獲得光鐸獎" },
    { year: "2023", text: "🏆 金城國中獲得光鐸獎" },
    { year: "2024", text: "獲得多國太陽能防災專利" },
];

export default function About() {
    return (
        <Box className="about-page">
            <Box className="about-hero">
                <Typography className="about-hero-title">關於我們</Typography>
            </Box>

            <Box className="about-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <Box className="about-breadcrumb">
                        <a href="/">首頁</a>
                        <span>/</span>
                        <span>關於我們</span>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <main className="main-content">
                    <section className="intro-section">
                        <div className="intro-quote">
                            "有效利用能源，開發再生能源"
                        </div>
                        <p className="intro-text">
                            力瑪科技以此理念創立於 2003年
                        </p>
                    </section>

                    <section className="timeline-section">
                        <h2 className="timeline-main-title">發展歷程</h2>

                        <div className="timeline-vertical">
                            {historyData.map((item, index) => (
                                <div
                                    className={`timeline-row ${index % 2 === 0 ? "right" : "left"}`}
                                    key={item.year + item.text}
                                >
                                    <div className="timeline-side timeline-year-side">
                                        <div className="timeline-year">{item.year}</div>
                                    </div>

                                    <div className="timeline-center">
                                        <span className="timeline-dot" />
                                    </div>

                                    <div className="timeline-side timeline-card-side">
                                        <div className="timeline-card">
                                            {item.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="core-values">
                        <h2 className="section-title">核心價值</h2>

                        <div className="values-grid">
                            <div className="value-card">
                                <h3>有效利用能源</h3>
                                <p>LED照明 / 智能控制 / 節能系統</p>
                            </div>

                            <div className="value-card">
                                <h3>開發再生能源</h3>
                                <p>太陽能系統 / 設計施工 / 維運</p>
                            </div>

                            <div className="value-card">
                                <h3>智慧雲平台</h3>
                                <p>監控系統 / 節能平台</p>
                            </div>
                        </div>
                    </section>

                    <section className="services-section">
                        <h2 className="section-title">服務項目</h2>

                        <div className="services-grid">
                            <div className="service-card">
                                <h3>太陽能系統</h3>
                                <ul>
                                    <li>市電併聯</li>
                                    <li>自發自用</li>
                                    <li>BIPV系統</li>
                                </ul>
                            </div>

                            <div className="service-card">
                                <h3>太陽能投資</h3>
                                <ul>
                                    <li>電廠投資</li>
                                    <li>土地開發</li>
                                </ul>
                            </div>

                            <div className="service-card">
                                <h3>監控系統</h3>
                                <ul>
                                    <li>雲端監控</li>
                                    <li>維運系統</li>
                                </ul>
                            </div>

                            <div className="service-card">
                                <h3>防災系統</h3>
                                <ul>
                                    <li>快速關斷</li>
                                    <li>自動檢測</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </main>
            </Container>
        </Box>
    );
}