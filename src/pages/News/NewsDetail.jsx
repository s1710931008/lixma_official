import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./NewsDetail.css";

export default function NewsDetail() {
    return (
        <Box className="news-detail-page">
            {/* breadcrumb */}
            <Box className="detail-breadcrumb-wrap">
                <Container maxWidth="lg">
                    <nav className="breadcrumbs">
                        <ul className="breadcrumbs-container">
                            <li><a href="/">首頁</a></li>
                            <li><a href="/news">最新消息</a></li>
                            <li>台南金城國中風雨球場榮獲光鐸獎</li>
                        </ul>
                    </nav>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Article Container */}
                <article className="article-container">
                    <a href="/news" className="back-button">
                        ← 返回消息列表
                    </a>

                    {/* Article Header */}
                    <header className="article-header">
                        <div className="article-category">📰 最新消息</div>

                        <Typography variant="h3" className="article-title">
                            台南金城國中風雨球場榮獲光鐸獎
                        </Typography>

                        <div className="article-meta">
                            <div className="meta-item">
                                <span className="meta-icon">📅</span>
                                <span>2024-06-21</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-icon">👁️</span>
                                <span>1,234 次瀏覽</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-icon">⏱️</span>
                                <span>閱讀時間 3 分鐘</span>
                            </div>
                        </div>
                    </header>

                    {/* Award Banner */}
                    <div className="award-banner">
                        <div className="award-icon">🏆</div>
                        <div className="award-text">
                            <h3>榮獲光鐸獎殊榮</h3>
                            <p>
                                力瑪科技建置的台南金城國中風雨球場太陽能系統，
                                以其卓越的設計與施工品質，榮獲台灣太陽光電產業最高榮譽
                                「光鐸獎」肯定。
                            </p>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="featured-image">
                        <img
                            src="https://www.lixma.com.tw/storage/gallery/5b17a7a378a3db3be86c8fb2/63315c2c8482cad66b178124.jpg"
                            alt="台南金城國中風雨球場"
                        />
                    </div>

                    {/* Article Content */}
                    <div className="article-content">
                        <h2>專案概述</h2>
                        <p>
                            台南市金城國中風雨球場太陽能發電系統，是力瑪科技在學校場域建置的重要里程碑。
                            本案場不僅提供學生優質的運動環境，更透過屋頂太陽能板的建置，
                            實踐綠色能源教育，讓學生在日常生活中體驗永續發展的重要性。
                        </p>

                        <div className="highlight-box">
                            <h4>專案亮點</h4>
                            <p>
                                本案場採用創新的 BIPV（建築整合型太陽能）技術，
                                將太陽能系統完美融入建築設計中，不僅具備發電功能，
                                更兼顧美觀與實用性。透過精密的結構計算與施工技術，
                                確保系統安全穩定運作。
                            </p>
                        </div>

                        <h2>系統規格與效益</h2>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-number">499</div>
                                <div className="stat-label">裝置容量 (kW)</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">650</div>
                                <div className="stat-label">年發電量 (MWh)</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">325</div>
                                <div className="stat-label">年減碳量 (噸)</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">20</div>
                                <div className="stat-label">使用年限 (年)</div>
                            </div>
                        </div>

                        <h2>技術特色</h2>
                        <p>
                            金城國中風雨球場太陽能系統採用最新的太陽能技術，
                            搭配力瑪科技自主研發的智慧監控系統，能即時監測發電效能，
                            並透過大數據分析優化系統運作。主要技術特色包括：
                        </p>

                        <ul>
                            <li><strong>高效能模組：</strong>採用高轉換效率的太陽能模組，確保最佳發電效益</li>
                            <li><strong>智慧監控：</strong>整合雲端監控系統，可遠端管理並即時掌握系統狀態</li>
                            <li><strong>防災系統：</strong>配備力瑪專利的太陽能防災系統，確保使用安全</li>
                            <li><strong>結構安全：</strong>通過嚴格的結構安全評估，可承受強風及地震考驗</li>
                            <li><strong>環境友善：</strong>採用環保材料，施工過程零污染</li>
                        </ul>

                        <h2>榮獲光鐸獎肯定</h2>
                        <p>
                            「光鐸獎」是台灣太陽光電產業的最高榮譽，由經濟部能源署主辦，
                            表彰在太陽能發電系統規劃、設計、施工及維運等方面有卓越表現的案場。
                            金城國中案場能夠獲此殊榮，不僅肯定了力瑪科技的專業能力，
                            更彰顯我們對品質的堅持。
                        </p>

                        <blockquote>
                            「這個獎項是對團隊所有成員辛勤付出的最佳肯定。我們始終相信，
                            只有將每個細節都做到最好，才能為客戶創造真正的價值。」
                            — 力瑪科技 工程部經理
                        </blockquote>

                        <h2>教育意義與社會影響</h2>
                        <p>
                            除了發電效益，本案場更重要的意義在於環境教育。
                            金城國中將太陽能系統納入教學課程，讓學生透過實際觀察與數據分析，
                            了解再生能源的重要性。這不僅是一座太陽能電廠，
                            更是一座活生生的綠能教室。
                        </p>

                        <div className="image-gallery">
                            <div className="gallery-item">
                                <img
                                    src="https://www.lixma.com.tw/storage/gallery/5b17a7a378a3db3be86c8fb2/63315ba68482cad7a3434042.jpg"
                                    alt="施工照片1"
                                />
                            </div>
                            <div className="gallery-item">
                                <img
                                    src="https://www.lixma.com.tw/storage/gallery/5b17a7a378a3db3be86c8fb2/63315be38482cad74e266ca2.jpg"
                                    alt="施工照片2"
                                />
                            </div>
                            <div className="gallery-item">
                                <img
                                    src="https://www.lixma.com.tw/storage/gallery/5b17a7a378a3db3be86c8fb2/63315ba68482cad7a3434045.jpg"
                                    alt="完工照片"
                                />
                            </div>
                        </div>

                        <h2>未來展望</h2>
                        <p>
                            力瑪科技將持續秉持「有效利用能源，開發再生能源」的理念，
                            為更多學校、企業及公共機關建置高品質的太陽能系統。
                            我們相信，透過一座座優質的太陽能電廠，
                            能夠為台灣的能源轉型與永續發展做出更多貢獻。
                        </p>
                    </div>

                    {/* Share Section */}
                    <div className="share-section">
                        <h3 className="share-title">分享此文章</h3>
                        <div className="share-buttons">
                            <a href="#" className="share-btn">
                                <span>📘</span>
                                Facebook
                            </a>
                            <a href="#" className="share-btn">
                                <span>🐦</span>
                                Twitter
                            </a>
                            <a href="#" className="share-btn">
                                <span>💼</span>
                                LinkedIn
                            </a>
                            <a href="#" className="share-btn">
                                <span>📧</span>
                                Email
                            </a>
                        </div>
                    </div>

                    {/* Related Articles */}
                    <div className="related-articles">
                        <h2 className="related-title">相關消息</h2>

                        <div className="related-grid">
                            <a href="#" className="related-card">
                                <img
                                    src="https://www.lixma.com.tw/storage/gallery/5b18bde978a3db153b74c5b2/633298b28482cafe32270ef2.jpg"
                                    alt="雲林監獄"
                                    className="related-image"
                                />
                                <div className="related-content">
                                    <div className="related-date">2022-09-27</div>
                                    <h3 className="related-card-title">雲林監獄屋頂太陽能榮獲光鐸獎</h3>
                                </div>
                            </a>

                            <a href="#" className="related-card">
                                <img
                                    src="https://www.lixma.com.tw/storage/gallery/5b304cc178a3db5be33c3442/633155f98482cad641120146.jpg"
                                    alt="公共建設"
                                    className="related-image"
                                />
                                <div className="related-content">
                                    <div className="related-date">2022-09-27</div>
                                    <h3 className="related-card-title">雲林監獄榮獲公共建設優質獎</h3>
                                </div>
                            </a>

                            <a href="#" className="related-card">
                                <img
                                    src="https://www.lixma.com.tw/storage/gallery/5b1799c778a3db37754357a2/63329cd68482cafe112cc632.jpg"
                                    alt="智慧建築"
                                    className="related-image"
                                />
                                <div className="related-content">
                                    <div className="related-date">2022-09-27</div>
                                    <h3 className="related-card-title">榮獲光電智慧建築標章</h3>
                                </div>
                            </a>
                        </div>
                    </div>
                </article>
            </Container>
        </Box>
    );
}