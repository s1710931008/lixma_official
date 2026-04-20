import { useState, useMemo } from "react";
import {
    MapPin,
    Sun,
    Banknote,
    Wallet,
    CalendarClock,
    Factory,
    Zap,
    Landmark,
} from "lucide-react";

const COUNTIES = [
    { name: "基隆市", sun: 2.78 },
    { name: "台北市", sun: 2.92 },
    { name: "新北市", sun: 2.92 },
    { name: "桃園縣", sun: 3.00 },
    { name: "新竹縣", sun: 3.05 },
    { name: "新竹市", sun: 3.05 },
    { name: "苗栗縣", sun: 3.10 },
    { name: "宜蘭縣", sun: 2.90 },
    { name: "連江縣", sun: 3.20 },
    { name: "台中市", sun: 3.38 },
    { name: "彰化縣", sun: 3.40 },
    { name: "雲林縣", sun: 3.45 },
    { name: "南投縣", sun: 3.30 },
    { name: "嘉義縣", sun: 3.60 },
    { name: "花蓮縣", sun: 3.20 },
    { name: "金門縣", sun: 3.50 },
    { name: "台南縣市", sun: 3.85 },
    { name: "高雄縣市", sun: 3.80 },
    { name: "屏東縣", sun: 3.12 },
    { name: "台東縣", sun: 3.50 },
];

const SELL_PRICE = 4.69;
const KW_PER_PING = 0.4;
const PRICE_PER_KW = 60000;
const RENT_RATIO = 0.06;

function fmt(n, dec = 2) {
    return n.toLocaleString("zh-TW", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
    });
}

function fmtInt(n) {
    return Math.round(n).toLocaleString("zh-TW");
}

export default function SolarCalculator() {
    const [county, setCounty] = useState("台中市");
    const [ping, setPing] = useState(50);

    const r = useMemo(() => {
        const c = COUNTIES.find((x) => x.name === county) || COUNTIES[9];
        const kw = ping * KW_PER_PING;
        const annualKwh = kw * c.sun * 365;
        const systemCost = kw * PRICE_PER_KW;
        const annualIncome = annualKwh * SELL_PRICE;
        const monthlyIncome = annualIncome / 12;
        const payback = systemCost / annualIncome;
        const rentMonth = monthlyIncome * RENT_RATIO;
        const rentYear = annualIncome * RENT_RATIO;

        return {
            kw,
            sun: c.sun,
            annualKwh,
            systemCost,
            annualIncome,
            monthlyIncome,
            payback,
            rentMonth,
            rentYear,
        };
    }, [county, ping]);

    const metrics = [
        {
            label: "可建置容量",
            value: fmt(r.kw),
            unit: "KW",
            icon: <Factory size={20} />,
        },
        {
            label: "躉售價格",
            value: fmt(SELL_PRICE),
            unit: "元/度",
            icon: <Landmark size={20} />,
        },
        {
            label: "預估平均日照",
            value: fmt(r.sun),
            unit: "小時/日",
            icon: <Sun size={20} />,
        },
        {
            label: "預估年發電量",
            value: fmt(r.annualKwh),
            unit: "度",
            icon: <Zap size={20} />,
        },
    ];

    const incomeRows = [
        { label: "躉售月收入", value: `NT$ ${fmt(r.monthlyIncome)}`, icon: <Wallet size={18} /> },
        { label: "躉售年收入", value: `NT$ ${fmt(r.annualIncome)}`, icon: <Banknote size={18} /> },
        { label: "租金月收入", value: `NT$ ${fmt(r.rentMonth)}`, icon: <Wallet size={18} /> },
        { label: "租金年收入", value: `NT$ ${fmt(r.rentYear)}`, icon: <Banknote size={18} /> },
    ];

    return (
        <>
            <style>{`
                :root {
                    --bg-0: #eef4ff;
                    --bg-1: #f7fbff;
                    --bg-2: #eefaf4;
                    --line-soft: rgba(255,255,255,0.55);
                    --line-card: rgba(255,255,255,0.6);
                    --text-1: #0f172a;
                    --text-2: #334155;
                    --text-3: #64748b;
                    --blue: #3b82f6;
                    --cyan: #22d3ee;
                    --green: #34d399;
                    --shadow-soft: 0 18px 50px rgba(15, 23, 42, 0.08);
                    --shadow-strong: 0 28px 80px rgba(15, 23, 42, 0.14);
                    --radius-xl: 32px;
                    --radius-lg: 24px;
                    --radius-md: 18px;
                }

                * {
                    box-sizing: border-box;
                }
                
                html, body, #root {
                    margin: 0;
                    min-height: 100%;
                }
                
                body {
                    font-family: "SF Pro Display", "SF Pro Text", "Noto Sans TC", system-ui, sans-serif;
                    color: var(--text-1);
                    background:
                        radial-gradient(circle at 10% 10%, rgba(96, 165, 250, 0.20), transparent 26%),
                        radial-gradient(circle at 90% 12%, rgba(45, 212, 191, 0.18), transparent 24%),
                        radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.85), transparent 38%),
                        linear-gradient(180deg, #edf4ff 0%, #f6fbff 38%, #effaf5 100%);
                    background-attachment: fixed;
                }

                .solar-wrap {
                    font-family: "Noto Sans TC", sans-serif;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 32px 20px 60px;
                    color: #1b1f23;
                }

                .fade-up {
                    animation: fadeUp 0.8s ease both;
                }

                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }
                .delay-4 { animation-delay: 0.4s; }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hero-card {
                    position: relative;
                    overflow: hidden;
                    border-radius: 28px;
                    padding: 32px;
                    background:
                        linear-gradient(135deg, rgba(10, 92, 168, 0.96), rgba(27, 160, 127, 0.88)),
                        linear-gradient(180deg, #707070ff, #a3a4a5ff);
                    color: #fff;
                    box-shadow: 0 24px 60px rgba(15, 52, 96, 0.18);
                    margin-bottom: 24px;
                }

                .hero-card::after {
                    content: "";
                    position: absolute;
                    right: -60px;
                    top: -60px;
                    width: 220px;
                    height: 220px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.10);
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 14px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.14);
                    backdrop-filter: blur(8px);
                    font-size: 13px;
                    margin-bottom: 18px;
                    border: 1px solid rgba(255,255,255,0.18);
                }

                .hero-title {
                    font-size: 34px;
                    font-weight: 800;
                    line-height: 1.25;
                    margin: 0 0 12px;
                    letter-spacing: 0.5px;
                }

                .hero-desc {
                    font-size: 14px;
                    line-height: 1.8;
                    color: rgba(255,255,255,0.92);
                    max-width: 760px;
                    margin: 0;
                }

                .main-grid {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 22px;
                    margin-bottom: 22px;
                }

                .panel {
                    background: #fff;
                    border: 1px solid #e8eef5;
                    border-radius: 24px;
                    padding: 22px;
                    box-shadow: 0 14px 34px rgba(16, 24, 40, 0.06);
                }

                .panel-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 18px;
                    color: #17324d;
                }

                .field-group {
                    margin-bottom: 16px;
                }

                .field-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: #4e647a;
                    margin-bottom: 8px;
                }

                .field-control {
                    width: 100%;
                    height: 48px;
                    border: 1px solid #d7e2ee;
                    border-radius: 14px;
                    padding: 0 14px;
                    font-size: 15px;
                    outline: none;
                    background: #f9fbfd;
                    transition: all 0.25s ease;
                }

                .field-control:focus {
                    border-color: #1c7ed6;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(28, 126, 214, 0.10);
                }

                .sub-note {
                    margin-top: 14px;
                    font-size: 12px;
                    line-height: 1.7;
                    color: #73879b;
                    background: #f7fafc;
                    border-radius: 14px;
                    padding: 12px 14px;
                }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }

                .metric-card {
                    background: linear-gradient(180deg, #ffffff, #f7fbff);
                    border: 1px solid #e6eef8;
                    border-radius: 22px;
                    padding: 18px;
                    min-height: 140px;
                    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
                    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
                }

                .metric-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.10);
                    border-color: #cfe1f6;
                }

                .metric-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #e6f4ff, #dff8ef);
                    color: #1565c0;
                    margin-bottom: 14px;
                }

                .metric-label {
                    font-size: 13px;
                    color: #66788a;
                    margin-bottom: 8px;
                }

                .metric-value {
                    font-size: 28px;
                    font-weight: 800;
                    color: #152536;
                    line-height: 1.2;
                }

                .metric-unit {
                    font-size: 12px;
                    color: #8a9aac;
                    margin-top: 4px;
                }

                .finance-panel {
                    background: linear-gradient(180deg, #ffffff, #f8fbff);
                    border: 1px solid #e7eef8;
                    border-radius: 24px;
                    padding: 24px;
                    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
                }

                .finance-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 18px;
                    flex-wrap: wrap;
                }

                .finance-title {
                    font-size: 14px;
                    color: #5e7388;
                    font-weight: 600;
                    margin-bottom: 6px;
                }

                .finance-amount {
                    font-size: 34px;
                    font-weight: 800;
                    color: #0f2740;
                    line-height: 1.2;
                }

                .payback-box {
                    min-width: 220px;
                    background: linear-gradient(135deg, #0d6efd, #20c997);
                    color: white;
                    border-radius: 20px;
                    padding: 16px 18px;
                    box-shadow: 0 12px 28px rgba(13, 110, 253, 0.22);
                }

                .payback-label {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-bottom: 6px;
                }

                .payback-value {
                    font-size: 28px;
                    font-weight: 800;
                }

                .income-grid {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 14px;
                    margin-top: 20px;
                }

                .income-item {
                    background: #fff;
                    border: 1px solid #e8eef5;
                    border-radius: 18px;
                    padding: 16px;
                    transition: all 0.25s ease;
                }

                .income-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
                }

                .income-head {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 10px;
                    color: #4d657d;
                    font-size: 13px;
                    font-weight: 600;
                }

                .income-value {
                    font-size: 20px;
                    font-weight: 700;
                    color: #13263a;
                    line-height: 1.35;
                    word-break: break-word;
                }

                .formula-note {
                    margin-top: 18px;
                    font-size: 12px;
                    color: #7a8b9b;
                    line-height: 1.8;
                    background: #f8fafc;
                    border: 1px dashed #d8e2eb;
                    border-radius: 16px;
                    padding: 14px 16px;
                }

                @media (max-width: 900px) {
                    .main-grid {
                        grid-template-columns: 1fr;
                    }

                    .metrics-grid {
                        grid-template-columns: 1fr 1fr;
                    }

                    .income-grid {
                        grid-template-columns: 1fr 1fr;
                    }

                    .hero-title {
                        font-size: 28px;
                    }
                }

                @media (max-width: 640px) {
                    .solar-wrap {
                        padding: 20px 14px 40px;
                    }

                    .hero-card {
                        padding: 22px;
                        border-radius: 22px;
                    }

                    .hero-title {
                        font-size: 24px;
                    }

                    .metrics-grid,
                    .income-grid {
                        grid-template-columns: 1fr;
                    }

                    .finance-amount {
                        font-size: 28px;
                    }

                    .payback-value {
                        font-size: 24px;
                    }
                }
            `}</style>

            <div className="solar-wrap">
                <section className="hero-card fade-up">
                    <div className="hero-badge">
                        <Sun size={16} />
                        太陽能屋頂型投資評估系統
                    </div>

                    <h1 className="hero-title">太陽能屋頂型投資試算</h1>

                    <p className="hero-desc">
                        依據地區日照條件、可用坪數與躉售條件，快速估算可建置容量、年發電量、
                        預估收入、建置成本與回收年限，協助初步評估投資可行性。
                    </p>
                </section>

                <section className="main-grid">
                    <div className="panel fade-up delay-1">
                        <h2 className="panel-title">
                            <MapPin size={20} />
                            基本條件設定
                        </h2>

                        <div className="field-group">
                            <label className="field-label">縣市地區</label>
                            <select
                                className="field-control"
                                value={county}
                                onChange={(e) => setCounty(e.target.value)}
                            >
                                {COUNTIES.map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label className="field-label">可用屋頂坪數</label>
                            <input
                                className="field-control"
                                type="number"
                                value={ping}
                                min={1}
                                max={99999}
                                step={1}
                                onChange={(e) =>
                                    setPing(Math.max(1, Number(e.target.value) || 1))
                                }
                            />
                        </div>

                        <div className="sub-note">
                            此試算為初步估算，未納入實際場址遮蔭、結構補強、施工方式、
                            逆變器配置、維運成本與融資條件等因素，正式規劃仍需依現場條件評估。
                        </div>
                    </div>

                    <div className="metrics-grid fade-up delay-2">
                        {metrics.map(({ label, value, unit, icon }) => (
                            <div key={label} className="metric-card">
                                <div className="metric-icon">{icon}</div>
                                <div className="metric-label">{label}</div>
                                <div className="metric-value">{value}</div>
                                <div className="metric-unit">{unit}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="finance-panel fade-up delay-3">
                    <div className="finance-top">
                        <div>
                            <div className="finance-title">預估系統建置費用</div>
                            <div className="finance-amount">
                                NT$ {fmtInt(r.systemCost)}
                            </div>
                        </div>

                        <div className="payback-box">
                            <div className="payback-label">預估回收年限</div>
                            <div className="payback-value">{fmt(r.payback)} 年</div>
                        </div>
                    </div>

                    <div className="income-grid">
                        {incomeRows.map(({ label, value, icon }) => (
                            <div key={label} className="income-item">
                                <div className="income-head">
                                    {icon}
                                    <span>{label}</span>
                                </div>
                                <div className="income-value">{value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="formula-note">
                        試算公式：可建置容量 = 坪數 × 0.4 KW；年發電量 = 容量 × 日照時數 × 365；
                        系統建置費用 = 容量 × 60,000 元/KW；租金 = 躉售收入 × 6%
                    </div>
                </section>
            </div>
        </>
    );
}