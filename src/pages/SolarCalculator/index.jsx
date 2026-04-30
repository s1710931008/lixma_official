import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Banknote,
    CalendarClock,
    Factory,
    Landmark,
    MapPin,
    Phone,
    Send,
    Sun,
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

const emptyLeadForm = {
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
    const { t } = useTranslation();
    const [county, setCounty] = useState("台中市");
    const [ping, setPing] = useState(50);
    const [isLeadOpen, setIsLeadOpen] = useState(false);
    const [leadForm, setLeadForm] = useState(emptyLeadForm);
    const [leadStatus, setLeadStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const result = useMemo(() => {
        const selectedCounty = COUNTIES.find((item) => item.name === county) || COUNTIES[9];
        const kw = ping * KW_PER_PING;
        const annualKwh = kw * selectedCounty.sun * 365;
        const systemCost = kw * PRICE_PER_KW;
        const annualIncome = annualKwh * SELL_PRICE;
        const monthlyIncome = annualIncome / 12;
        const payback = systemCost / annualIncome;
        const rentMonth = monthlyIncome * RENT_RATIO;
        const rentYear = annualIncome * RENT_RATIO;

        return {
            kw,
            sun: selectedCounty.sun,
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
            label: t("solar.metrics.kw"),
            value: fmt(result.kw),
            unit: t("solar.units.kw"),
            icon: <Factory size={20} />,
        },
        {
            label: t("solar.metrics.price"),
            value: fmt(SELL_PRICE),
            unit: t("solar.units.price"),
            icon: <Landmark size={20} />,
        },
        {
            label: t("solar.metrics.sun"),
            value: fmt(result.sun),
            unit: t("solar.units.sun"),
            icon: <Sun size={20} />,
        },
        {
            label: t("solar.metrics.kwh"),
            value: fmt(result.annualKwh),
            unit: t("solar.units.kwh"),
            icon: <Zap size={20} />,
        },
    ];

    const incomeRows = [
        { label: t("solar.income.month"), value: `NT$ ${fmt(result.monthlyIncome)}`, icon: <Wallet size={18} /> },
        { label: t("solar.income.year"), value: `NT$ ${fmt(result.annualIncome)}`, icon: <Banknote size={18} /> },
        { label: t("solar.income.rentMonth"), value: `NT$ ${fmt(result.rentMonth)}`, icon: <Wallet size={18} /> },
        { label: t("solar.income.rentYear"), value: `NT$ ${fmt(result.rentYear)}`, icon: <Banknote size={18} /> },
    ];

    const updateLeadField = (event) => {
        const { name, value } = event.target;
        setLeadForm((current) => ({ ...current, [name]: value }));
    };

    const buildMailMessage = () =>
        [
            t("solar.heroBadge"),
            "",
            t("solar.summary"),
            `${t("solar.county")}: ${county}`,
            `${t("solar.ping")}: ${fmt(Number(ping), 0)} ${t("solar.units.ping")}`,
            `${t("solar.metrics.kw")}: ${fmt(result.kw)} ${t("solar.units.kw")}`,
            `${t("solar.metrics.price")}: NT$ ${fmt(SELL_PRICE)} / ${t("solar.units.kwh")}`,
            `${t("solar.metrics.sun")}: ${fmt(result.sun)} ${t("solar.units.sun")}`,
            `${t("solar.metrics.kwh")}: ${fmt(result.annualKwh)} ${t("solar.units.kwh")}`,
            `${t("solar.financeTitle")}: NT$ ${fmtInt(result.systemCost)}`,
            `${t("solar.income.month")}: NT$ ${fmt(result.monthlyIncome)}`,
            `${t("solar.income.year")}: NT$ ${fmt(result.annualIncome)}`,
            `${t("solar.income.rentMonth")}: NT$ ${fmt(result.rentMonth)}`,
            `${t("solar.income.rentYear")}: NT$ ${fmt(result.rentYear)}`,
            `${t("solar.payback")}: ${fmt(result.payback)} ${t("solar.units.year")}`,
            "",
            `${t("solar.remark")}: ${leadForm.note.trim() || t("solar.noRemark")}`,
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
                    category: t("solar.heroBadge"),
                    message: buildMailMessage(),
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                throw new Error(data.message || t("solar.error"));
            }

            setLeadForm(emptyLeadForm);
            setLeadStatus({ type: "success", message: t("solar.success") });
            setIsLeadOpen(false);
        } catch (error) {
            setLeadStatus({
                type: "error",
                message: error.message || t("solar.error"),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <style>{`
                .solar-wrap {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 32px 20px 60px;
                    color: #0f172a;
                }

                .solar-hero {
                    border-radius: 28px;
                    padding: 32px;
                    margin-bottom: 24px;
                    color: #fff;
                    background: linear-gradient(135deg, rgba(10, 92, 168, 0.96), rgba(27, 160, 127, 0.88));
                    box-shadow: 0 24px 60px rgba(15, 52, 96, 0.18);
                }

                .solar-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 14px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.14);
                    border: 1px solid rgba(255,255,255,0.18);
                    font-size: 13px;
                    margin-bottom: 18px;
                }

                .solar-title {
                    margin: 0 0 12px;
                    font-size: 34px;
                    line-height: 1.25;
                    font-weight: 800;
                }

                .solar-desc {
                    max-width: 760px;
                    margin: 0;
                    color: rgba(255,255,255,0.92);
                    line-height: 1.8;
                }

                .solar-main-grid {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 22px;
                    margin-bottom: 22px;
                }

                .solar-panel,
                .solar-finance-panel {
                    background: #fff;
                    border: 1px solid #e8eef5;
                    border-radius: 24px;
                    box-shadow: 0 14px 34px rgba(16, 24, 40, 0.06);
                }

                .solar-panel {
                    padding: 22px;
                }

                .solar-panel-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 0 0 18px;
                    color: #17324d;
                    font-size: 18px;
                    font-weight: 700;
                }

                .solar-field {
                    margin-bottom: 16px;
                }

                .solar-label {
                    display: block;
                    margin-bottom: 8px;
                    color: #4e647a;
                    font-size: 13px;
                    font-weight: 600;
                }

                .solar-control {
                    width: 100%;
                    height: 48px;
                    border: 1px solid #d7e2ee;
                    border-radius: 14px;
                    padding: 0 14px;
                    background: #f9fbfd;
                    font-size: 15px;
                    outline: none;
                }

                textarea.solar-control {
                    height: auto;
                    min-height: 96px;
                    padding-top: 12px;
                    resize: vertical;
                }

                .solar-note,
                .solar-formula {
                    margin-top: 14px;
                    padding: 12px 14px;
                    border-radius: 14px;
                    background: #f7fafc;
                    color: #73879b;
                    font-size: 12px;
                    line-height: 1.7;
                }

                .solar-metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }

                .solar-metric-card,
                .solar-income-card {
                    background: linear-gradient(180deg, #ffffff, #f7fbff);
                    border: 1px solid #e6eef8;
                    border-radius: 22px;
                    padding: 18px;
                }

                .solar-metric-icon {
                    width: 42px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 14px;
                    border-radius: 14px;
                    color: #1565c0;
                    background: linear-gradient(135deg, #e6f4ff, #dff8ef);
                }

                .solar-metric-label,
                .solar-income-head {
                    color: #66788a;
                    font-size: 13px;
                    font-weight: 600;
                }

                .solar-metric-value {
                    margin-top: 8px;
                    color: #152536;
                    font-size: 28px;
                    line-height: 1.2;
                    font-weight: 800;
                }

                .solar-metric-unit {
                    margin-top: 4px;
                    color: #8a9aac;
                    font-size: 12px;
                }

                .solar-finance-panel {
                    padding: 24px;
                    background: linear-gradient(180deg, #ffffff, #f8fbff);
                }

                .solar-finance-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin-bottom: 20px;
                }

                .solar-finance-title {
                    margin-bottom: 6px;
                    color: #5e7388;
                    font-size: 14px;
                    font-weight: 600;
                }

                .solar-finance-amount {
                    color: #0f2740;
                    font-size: 34px;
                    line-height: 1.2;
                    font-weight: 800;
                }

                .solar-payback {
                    min-width: 220px;
                    padding: 16px 18px;
                    border-radius: 20px;
                    color: #fff;
                    background: linear-gradient(135deg, #0d6efd, #20c997);
                }

                .solar-payback-label {
                    margin-bottom: 6px;
                    opacity: 0.9;
                    font-size: 12px;
                }

                .solar-payback-value {
                    font-size: 28px;
                    font-weight: 800;
                }

                .solar-income-grid {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 14px;
                }

                .solar-income-head {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 10px;
                }

                .solar-income-value {
                    color: #13263a;
                    font-size: 20px;
                    line-height: 1.35;
                    font-weight: 700;
                }

                .solar-actions {
                    display: flex;
                    justify-content: center;
                    margin-top: 22px;
                }

                .solar-cta,
                .solar-submit {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    border: none;
                    border-radius: 14px;
                    padding: 13px 24px;
                    color: #fff;
                    background: linear-gradient(135deg, #0f2740, #1c7ed6);
                    font-weight: 800;
                    cursor: pointer;
                }

                .solar-submit {
                    background: linear-gradient(135deg, #0d6efd, #20c997);
                }

                .solar-backdrop {
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

                .solar-modal {
                    width: min(920px, 100%);
                    max-height: 92vh;
                    overflow: auto;
                    border: 1px solid #dbeafe;
                    border-radius: 24px;
                    background: #fff;
                    box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
                }

                .solar-modal-head,
                .solar-modal-body {
                    padding: 24px;
                }

                .solar-modal-head {
                    display: flex;
                    justify-content: space-between;
                    gap: 16px;
                    border-bottom: 1px solid #e8eef5;
                }

                .solar-modal-title {
                    margin: 0 0 6px;
                    color: #0f2740;
                    font-size: 24px;
                    font-weight: 850;
                }

                .solar-modal-desc {
                    margin: 0;
                    color: #64748b;
                    line-height: 1.7;
                }

                .solar-close {
                    width: 38px;
                    height: 38px;
                    border: 1px solid #d7e2ee;
                    border-radius: 12px;
                    background: #fff;
                    cursor: pointer;
                }

                .solar-modal-body {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 320px;
                    gap: 22px;
                }

                .solar-lead-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }

                .solar-lead-grid .full {
                    grid-column: 1 / -1;
                }

                .solar-summary {
                    align-self: start;
                    padding: 18px;
                    border: 1px solid #e6eef8;
                    border-radius: 20px;
                    background: linear-gradient(180deg, #f8fbff, #eefaf4);
                }

                .solar-summary-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 0 0 14px;
                    color: #0f2740;
                    font-size: 17px;
                    font-weight: 800;
                }

                .solar-summary-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 14px;
                    margin-bottom: 10px;
                    color: #64748b;
                    font-size: 13px;
                }

                .solar-summary-row strong {
                    color: #0f172a;
                    text-align: right;
                }

                .solar-status {
                    margin: 16px 0 0;
                    padding: 11px 13px;
                    border-radius: 12px;
                    font-size: 14px;
                }

                .solar-status.error {
                    background: #fef2f2;
                    color: #b91c1c;
                }

                .solar-submit-row {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 18px;
                }

                @media (max-width: 900px) {
                    .solar-main-grid,
                    .solar-modal-body {
                        grid-template-columns: 1fr;
                    }

                    .solar-metrics-grid,
                    .solar-income-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 640px) {
                    .solar-wrap {
                        padding: 20px 14px 40px;
                    }

                    .solar-title {
                        font-size: 26px;
                    }

                    .solar-metrics-grid,
                    .solar-income-grid,
                    .solar-lead-grid {
                        grid-template-columns: 1fr;
                    }

                    .solar-cta,
                    .solar-submit {
                        width: 100%;
                    }
                }
            `}</style>

            <div className="solar-wrap">
                <section className="solar-hero">
                    <div className="solar-badge">
                        <Sun size={16} />
                        {t("solar.heroBadge")}
                    </div>
                    <h1 className="solar-title">{t("solar.heroTitle")}</h1>
                    <p className="solar-desc">{t("solar.heroDesc")}</p>
                </section>

                <section className="solar-main-grid">
                    <div className="solar-panel">
                        <h2 className="solar-panel-title">
                            <MapPin size={20} />
                            {t("solar.conditionTitle")}
                        </h2>

                        <div className="solar-field">
                            <label className="solar-label">{t("solar.county")}</label>
                            <select
                                className="solar-control"
                                value={county}
                                onChange={(event) => setCounty(event.target.value)}
                            >
                                {COUNTIES.map((item) => (
                                    <option key={item.name} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="solar-field">
                            <label className="solar-label">{t("solar.ping")}</label>
                            <input
                                className="solar-control"
                                type="number"
                                value={ping}
                                min={1}
                                max={99999}
                                step={1}
                                onChange={(event) =>
                                    setPing(Math.max(1, Number(event.target.value) || 1))
                                }
                            />
                        </div>

                        <div className="solar-note">{t("solar.note")}</div>
                    </div>

                    <div className="solar-metrics-grid">
                        {metrics.map((item) => (
                            <div className="solar-metric-card" key={item.label}>
                                <div className="solar-metric-icon">{item.icon}</div>
                                <div className="solar-metric-label">{item.label}</div>
                                <div className="solar-metric-value">{item.value}</div>
                                <div className="solar-metric-unit">{item.unit}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="solar-finance-panel">
                    <div className="solar-finance-top">
                        <div>
                            <div className="solar-finance-title">{t("solar.financeTitle")}</div>
                            <div className="solar-finance-amount">NT$ {fmtInt(result.systemCost)}</div>
                        </div>

                        <div className="solar-payback">
                            <div className="solar-payback-label">{t("solar.payback")}</div>
                            <div className="solar-payback-value">
                                {fmt(result.payback)} {t("solar.units.year")}
                            </div>
                        </div>
                    </div>

                    <div className="solar-income-grid">
                        {incomeRows.map((item) => (
                            <div className="solar-income-card" key={item.label}>
                                <div className="solar-income-head">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                <div className="solar-income-value">{item.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="solar-actions">
                        <button
                            className="solar-cta"
                            type="button"
                            onClick={() => {
                                setLeadStatus({ type: "", message: "" });
                                setIsLeadOpen(true);
                            }}
                        >
                            <Phone size={18} />
                            {t("solar.contactSales")}
                        </button>
                    </div>

                    <div className="solar-formula">{t("solar.formula")}</div>
                </section>
            </div>

            {isLeadOpen && (
                <div className="solar-backdrop">
                    <form className="solar-modal" onSubmit={handleLeadSubmit}>
                        <div className="solar-modal-head">
                            <div>
                                <h2 className="solar-modal-title">{t("solar.modalTitle")}</h2>
                                <p className="solar-modal-desc">{t("solar.modalDesc")}</p>
                            </div>
                            <button
                                className="solar-close"
                                type="button"
                                aria-label="Close"
                                onClick={() => setIsLeadOpen(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="solar-modal-body">
                            <div>
                                <div className="solar-lead-grid">
                                    <div className="solar-field">
                                        <label className="solar-label">{t("solar.name")}</label>
                                        <input
                                            className="solar-control"
                                            name="name"
                                            value={leadForm.name}
                                            onChange={updateLeadField}
                                            required
                                        />
                                    </div>
                                    <div className="solar-field">
                                        <label className="solar-label">{t("solar.phone")}</label>
                                        <input
                                            className="solar-control"
                                            name="phone"
                                            value={leadForm.phone}
                                            onChange={updateLeadField}
                                            required
                                        />
                                    </div>
                                    <div className="solar-field full">
                                        <label className="solar-label">{t("solar.email")}</label>
                                        <input
                                            className="solar-control"
                                            type="email"
                                            name="email"
                                            value={leadForm.email}
                                            onChange={updateLeadField}
                                            required
                                        />
                                    </div>
                                    <div className="solar-field full">
                                        <label className="solar-label">{t("solar.remark")}</label>
                                        <textarea
                                            className="solar-control"
                                            name="note"
                                            value={leadForm.note}
                                            onChange={updateLeadField}
                                        />
                                    </div>
                                </div>

                                {leadStatus.message && (
                                    <div className={`solar-status ${leadStatus.type}`}>
                                        {leadStatus.message}
                                    </div>
                                )}

                                <div className="solar-submit-row">
                                    <button
                                        className="solar-submit"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <Send size={17} />
                                        {isSubmitting ? t("solar.submitting") : t("solar.submit")}
                                    </button>
                                </div>
                            </div>

                            <aside className="solar-summary">
                                <h3 className="solar-summary-title">
                                    <CalendarClock size={18} />
                                    {t("solar.summary")}
                                </h3>
                                {[
                                    [t("solar.county"), county],
                                    [t("solar.ping"), `${fmt(Number(ping), 0)} ${t("solar.units.ping")}`],
                                    [t("solar.metrics.kw"), `${fmt(result.kw)} ${t("solar.units.kw")}`],
                                    [t("solar.financeTitle"), `NT$ ${fmtInt(result.systemCost)}`],
                                    [t("solar.income.year"), `NT$ ${fmt(result.annualIncome)}`],
                                    [t("solar.payback"), `${fmt(result.payback)} ${t("solar.units.year")}`],
                                ].map(([label, value]) => (
                                    <div className="solar-summary-row" key={label}>
                                        <span>{label}</span>
                                        <strong>{value}</strong>
                                    </div>
                                ))}
                            </aside>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
