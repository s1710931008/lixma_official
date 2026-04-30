import { useMemo, useState } from "react";
import {
    Banknote,
    CalendarClock,
    CheckCircle2,
    Factory,
    Landmark,
    Mail,
    MapPin,
    Phone,
    Send,
    Sun,
    User,
    Wallet,
    X,
    Zap,
} from "lucide-react";

const MAIL_API = "http://localhost:3000/api/sedMail";
const MAIL_API_KEY = import.meta.env.VITE_MAIL_API_KEY || "";

const COUNTIES = [
    { name: "基隆市", sun: 2.78 },
    { name: "台北市", sun: 2.92 },
    { name: "新北市", sun: 2.92 },
    { name: "桃園市", sun: 3.0 },
    { name: "新竹市", sun: 3.05 },
    { name: "新竹縣", sun: 3.05 },
    { name: "苗栗縣", sun: 3.1 },
    { name: "南投縣", sun: 2.9 },
    { name: "彰化縣", sun: 3.2 },
    { name: "台中市", sun: 3.38 },
    { name: "雲林縣", sun: 3.4 },
    { name: "嘉義縣", sun: 3.45 },
    { name: "嘉義市", sun: 3.3 },
    { name: "台南市", sun: 3.6 },
    { name: "高雄市", sun: 3.2 },
    { name: "屏東縣", sun: 3.5 },
    { name: "花蓮縣", sun: 3.85 },
    { name: "台東縣", sun: 3.8 },
    { name: "宜蘭縣", sun: 3.12 },
    { name: "澎湖縣", sun: 3.5 },
];

const SELL_PRICE = 4.69;
const KW_PER_PING = 0.4;
const PRICE_PER_KW = 60000;
const RENT_RATIO = 0.06;

const initialLeadForm = {
    name: "",
    phone: "",
    email: "",
    note: "",
};

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
    const [isLeadOpen, setIsLeadOpen] = useState(false);
    const [leadForm, setLeadForm] = useState(initialLeadForm);
    const [leadStatus, setLeadStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            label: "預估設置容量",
            value: fmt(r.kw),
            unit: "KW",
            icon: <Factory size={20} />,
        },
        {
            label: "售電躉購費率",
            value: fmt(SELL_PRICE),
            unit: "元 / 度",
            icon: <Landmark size={20} />,
        },
        {
            label: "日平均發電時數",
            value: fmt(r.sun),
            unit: "小時 / 日",
            icon: <Sun size={20} />,
        },
        {
            label: "年發電量",
            value: fmt(r.annualKwh),
            unit: "度",
            icon: <Zap size={20} />,
        },
    ];

    const incomeRows = [
        { label: "預估月收益", value: `NT$ ${fmt(r.monthlyIncome)}`, icon: <Wallet size={18} /> },
        { label: "預估年收益", value: `NT$ ${fmt(r.annualIncome)}`, icon: <Banknote size={18} /> },
        { label: "屋主月租金", value: `NT$ ${fmt(r.rentMonth)}`, icon: <Wallet size={18} /> },
        { label: "屋主年租金", value: `NT$ ${fmt(r.rentYear)}`, icon: <Banknote size={18} /> },
    ];

    const updateLeadField = (event) => {
        const { name, value } = event.target;
        setLeadForm((current) => ({ ...current, [name]: value }));
    };

    const buildMailMessage = () =>
        [
            "太陽能屋頂型投資試算",
            "",
            "試算內容",
            `縣市：${county}`,
            `屋頂可用坪數：${fmt(Number(ping), 0)} 坪`,
            `預估設置容量：${fmt(r.kw)} KW`,
            `售電躉購費率：NT$ ${fmt(SELL_PRICE)} / 度`,
            `日平均發電時數：${fmt(r.sun)} 小時 / 日`,
            `年發電量：${fmt(r.annualKwh)} 度`,
            `系統建置費用：NT$ ${fmtInt(r.systemCost)}`,
            `預估月收益：NT$ ${fmt(r.monthlyIncome)}`,
            `預估年收益：NT$ ${fmt(r.annualIncome)}`,
            `屋主月租金：NT$ ${fmt(r.rentMonth)}`,
            `屋主年租金：NT$ ${fmt(r.rentYear)}`,
            `預估回收年限：${fmt(r.payback)} 年`,
            "",
            `備註：${leadForm.note.trim() || "無"}`,
        ].join("\n");

    const handleLeadSubmit = async (event) => {
        event.preventDefault();
        setLeadStatus({ type: "", message: "" });
        setIsSubmitting(true);

        try {
            const res = await fetch(MAIL_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": MAIL_API_KEY,
                },
                body: JSON.stringify({
                    name: leadForm.name.trim(),
                    email: leadForm.email.trim(),
                    phone: leadForm.phone.trim(),
                    category: "太陽能屋頂型投資試算",
                    message: buildMailMessage(),
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                throw new Error(data.message || "送出失敗，請稍後再試");
            }

            setLeadForm(initialLeadForm);
            setLeadStatus({
                type: "success",
                message: "資料已送出，客服或業務人員會盡快與您聯繫。",
            });
            setIsLeadOpen(false);
        } catch (error) {
            setLeadStatus({
                type: "error",
                message: error.message || "送出失敗，請稍後再試",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <style>{`
                :root {
                    --bg-0: #eef4ff;
                    --bg-1: #f7fbff;
                    --bg-2: #eefaf4;
                    --text-1: #0f172a;
                    --text-2: #334155;
                    --text-3: #64748b;
                    --blue: #3b82f6;
                    --cyan: #22d3ee;
                    --green: #34d399;
                    --shadow-soft: 0 18px 50px rgba(15, 23, 42, 0.08);
                    --shadow-strong: 0 28px 80px rgba(15, 23, 42, 0.14);
                }

                * { box-sizing: border-box; }

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

                .fade-up { animation: fadeUp 0.8s ease both; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .hero-card {
                    position: relative;
                    overflow: hidden;
                    border-radius: 28px;
                    padding: 32px;
                    background:
                        linear-gradient(135deg, rgba(10, 92, 168, 0.96), rgba(27, 160, 127, 0.88)),
                        linear-gradient(180deg, #707070, #a3a4a5);
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
                    letter-spacing: 0;
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

                .panel,
                .finance-panel {
                    background: #fff;
                    border: 1px solid #e8eef5;
                    border-radius: 24px;
                    box-shadow: 0 14px 34px rgba(16, 24, 40, 0.06);
                }

                .panel { padding: 22px; }

                .panel-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 18px;
                    color: #17324d;
                }

                .field-group { margin-bottom: 16px; }

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

                textarea.field-control {
                    height: auto;
                    min-height: 96px;
                    padding-top: 12px;
                    resize: vertical;
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
                    padding: 24px;
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

                .solar-actions {
                    display: flex;
                    justify-content: center;
                    margin-top: 22px;
                }

                .contact-sales-btn,
                .modal-submit {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    border: none;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #0f2740, #1c7ed6);
                    color: #fff;
                    font-size: 15px;
                    font-weight: 800;
                    padding: 13px 18px;
                    cursor: pointer;
                    box-shadow: 0 12px 28px rgba(15, 39, 64, 0.2);
                }

                .contact-sales-btn {
                    min-width: 220px;
                    padding-inline: 24px;
                }

                .modal-submit {
                    background: linear-gradient(135deg, #0d6efd, #20c997);
                    box-shadow: 0 12px 28px rgba(13, 110, 253, 0.2);
                }

                .contact-sales-btn:disabled,
                .modal-submit:disabled {
                    cursor: not-allowed;
                    opacity: 0.68;
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

                .lead-backdrop {
                    position: fixed;
                    inset: 0;
                    z-index: 1200;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: rgba(15, 23, 42, 0.48);
                    backdrop-filter: blur(8px);
                }

                .lead-modal {
                    width: min(920px, 100%);
                    max-height: min(92vh, 880px);
                    overflow: auto;
                    background: #ffffff;
                    border: 1px solid #dbeafe;
                    border-radius: 24px;
                    box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
                }

                .lead-modal-head {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 16px;
                    padding: 24px 24px 18px;
                    border-bottom: 1px solid #e8eef5;
                }

                .lead-modal-title {
                    margin: 0 0 6px;
                    font-size: 24px;
                    font-weight: 850;
                    color: #0f2740;
                }

                .lead-modal-desc {
                    margin: 0;
                    color: #64748b;
                    line-height: 1.7;
                    font-size: 14px;
                }

                .modal-close {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #d7e2ee;
                    border-radius: 12px;
                    background: #fff;
                    color: #334155;
                    cursor: pointer;
                }

                .lead-modal-body {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 320px;
                    gap: 22px;
                    padding: 24px;
                }

                .lead-form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }

                .lead-form-grid .full {
                    grid-column: 1 / -1;
                }

                .summary-card {
                    border: 1px solid #e6eef8;
                    border-radius: 20px;
                    background: linear-gradient(180deg, #f8fbff, #eefaf4);
                    padding: 18px;
                    align-self: start;
                }

                .summary-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 0 0 14px;
                    font-size: 17px;
                    font-weight: 800;
                    color: #0f2740;
                }

                .summary-list {
                    display: grid;
                    gap: 10px;
                    margin: 0;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 14px;
                    font-size: 13px;
                    color: #64748b;
                }

                .summary-row strong {
                    color: #0f172a;
                    text-align: right;
                    font-weight: 800;
                }

                .lead-status {
                    margin: 16px 0 0;
                    padding: 11px 13px;
                    border-radius: 12px;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .lead-status.success {
                    background: #ecfdf5;
                    color: #047857;
                }

                .lead-status.error {
                    background: #fef2f2;
                    color: #b91c1c;
                }

                .modal-submit-row {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 18px;
                }

                @media (max-width: 900px) {
                    .main-grid,
                    .lead-modal-body {
                        grid-template-columns: 1fr;
                    }

                    .metrics-grid,
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

                    .hero-card,
                    .lead-modal-head,
                    .lead-modal-body {
                        padding: 22px;
                    }

                    .hero-title {
                        font-size: 24px;
                    }

                    .metrics-grid,
                    .income-grid,
                    .lead-form-grid {
                        grid-template-columns: 1fr;
                    }

                    .finance-amount {
                        font-size: 28px;
                    }

                    .payback-value {
                        font-size: 24px;
                    }

                    .solar-actions,
                    .modal-submit-row {
                        justify-content: stretch;
                    }

                    .contact-sales-btn,
                    .modal-submit {
                        width: 100%;
                    }
                }
            `}</style>

            <div className="solar-wrap">
                <section className="hero-card fade-up">
                    <div className="hero-badge">
                        <Sun size={16} />
                        太陽能屋頂型投資試算
                    </div>

                    <h1 className="hero-title">快速估算屋頂太陽能投資效益</h1>

                    <p className="hero-desc">
                        輸入所在地區與可用屋頂坪數，即可估算設置容量、發電量、
                        建置費用、收益與回收年限。試算結果可直接送給客服與業務人員協助評估。
                    </p>
                </section>

                <section className="main-grid">
                    <div className="panel fade-up delay-1">
                        <h2 className="panel-title">
                            <MapPin size={20} />
                            試算條件
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
                            <label className="field-label">屋頂可用坪數</label>
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
                            試算結果為初步估算，實際收益會因屋頂方向、遮蔽、設備規格、
                            施工條件與法規而不同，仍需由專人現場評估。
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

                    <div className="solar-actions">
                        <button
                            className="contact-sales-btn"
                            type="button"
                            onClick={() => {
                                setLeadStatus({ type: "", message: "" });
                                setIsLeadOpen(true);
                            }}
                        >
                            <Phone size={18} />
                            聯絡業務人員
                        </button>
                    </div>

                    <div className="formula-note">
                        公式：設置容量 = 坪數 x 0.4 KW；年發電量 = 容量 x 日照時數 x 365；
                        建置費用 = 容量 x NT$60,000 / KW；租金估算 = 售電收入 x 6%。
                    </div>
                </section>
            </div>

            {isLeadOpen && (
                <div className="lead-backdrop" role="presentation">
                    <form className="lead-modal" onSubmit={handleLeadSubmit}>
                        <div className="lead-modal-head">
                            <div>
                                <h2 className="lead-modal-title">聯絡業務人員</h2>
                                <p className="lead-modal-desc">
                                    請留下基本資料，我們會將您的試算內容一併寄給客服與業務人員。
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                type="button"
                                aria-label="關閉"
                                onClick={() => setIsLeadOpen(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="lead-modal-body">
                            <div>
                                <div className="lead-form-grid">
                                    <div className="field-group">
                                        <label className="field-label" htmlFor="lead-name">
                                            姓名
                                        </label>
                                        <input
                                            id="lead-name"
                                            className="field-control"
                                            name="name"
                                            value={leadForm.name}
                                            onChange={updateLeadField}
                                            placeholder="請輸入姓名"
                                            required
                                        />
                                    </div>

                                    <div className="field-group">
                                        <label className="field-label" htmlFor="lead-phone">
                                            電話
                                        </label>
                                        <input
                                            id="lead-phone"
                                            className="field-control"
                                            name="phone"
                                            value={leadForm.phone}
                                            onChange={updateLeadField}
                                            placeholder="請輸入聯絡電話"
                                            required
                                        />
                                    </div>

                                    <div className="field-group full">
                                        <label className="field-label" htmlFor="lead-email">
                                            Email
                                        </label>
                                        <input
                                            id="lead-email"
                                            className="field-control"
                                            type="email"
                                            name="email"
                                            value={leadForm.email}
                                            onChange={updateLeadField}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="field-group full">
                                        <label className="field-label" htmlFor="lead-note">
                                            備註
                                        </label>
                                        <textarea
                                            id="lead-note"
                                            className="field-control"
                                            name="note"
                                            value={leadForm.note}
                                            onChange={updateLeadField}
                                            placeholder="可填寫屋頂位置、可聯絡時間或其他需求"
                                        />
                                    </div>
                                </div>

                                {leadStatus.message && (
                                    <div className={`lead-status ${leadStatus.type}`}>
                                        {leadStatus.type === "success" && <CheckCircle2 size={16} />}
                                        {leadStatus.message}
                                    </div>
                                )}

                                <div className="modal-submit-row">
                                    <button
                                        className="modal-submit"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <Send size={17} />
                                        {isSubmitting ? "送出中..." : "送出給客服"}
                                    </button>
                                </div>
                            </div>

                            <aside className="summary-card">
                                <h3 className="summary-title">
                                    <CalendarClock size={18} />
                                    試算摘要
                                </h3>

                                <div className="summary-list">
                                    <div className="summary-row">
                                        <span>縣市</span>
                                        <strong>{county}</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>可用坪數</span>
                                        <strong>{fmt(Number(ping), 0)} 坪</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>設置容量</span>
                                        <strong>{fmt(r.kw)} KW</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>建置費用</span>
                                        <strong>NT$ {fmtInt(r.systemCost)}</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>年收益</span>
                                        <strong>NT$ {fmt(r.annualIncome)}</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>回收年限</span>
                                        <strong>{fmt(r.payback)} 年</strong>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
