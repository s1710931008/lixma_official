// SolarCalculator.jsx

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./SolarCalculator.css";

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

const MAIL_API = "/api/sedMail";
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

    const [leadStatus, setLeadStatus] = useState({
        type: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const result = useMemo(() => {
        const selectedCounty =
            COUNTIES.find((item) => item.name === county) || COUNTIES[9];

        const kw = ping * KW_PER_PING;

        const annualKwh =
            kw * selectedCounty.sun * 365;

        const systemCost =
            kw * PRICE_PER_KW;

        const annualIncome =
            annualKwh * SELL_PRICE;

        const monthlyIncome =
            annualIncome / 12;

        const payback =
            systemCost / annualIncome;

        const rentMonth =
            monthlyIncome * RENT_RATIO;

        const rentYear =
            annualIncome * RENT_RATIO;

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
        {
            label: t("solar.income.month"),
            value: `NT$ ${fmt(result.monthlyIncome)}`,
            icon: <Wallet size={18} />,
        },
        {
            label: t("solar.income.year"),
            value: `NT$ ${fmt(result.annualIncome)}`,
            icon: <Banknote size={18} />,
        },
        {
            label: t("solar.income.rentMonth"),
            value: `NT$ ${fmt(result.rentMonth)}`,
            icon: <Wallet size={18} />,
        },
        {
            label: t("solar.income.rentYear"),
            value: `NT$ ${fmt(result.rentYear)}`,
            icon: <Banknote size={18} />,
        },
    ];

    const updateLeadField = (event) => {
        const { name, value } = event.target;

        setLeadForm((current) => ({
            ...current,
            [name]: value,
        }));
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
            `${t("solar.remark")}: ${leadForm.note.trim() || t("solar.noRemark")
            }`,
        ].join("\n");

    const handleLeadSubmit = async (event) => {
        event.preventDefault();

        setLeadStatus({
            type: "",
            message: "",
        });

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
                throw new Error(
                    data.message || t("solar.error")
                );
            }

            setLeadForm(emptyLeadForm);

            setLeadStatus({
                type: "success",
                message: t("solar.success"),
            });

            setIsLeadOpen(false);
        } catch (error) {
            setLeadStatus({
                type: "error",
                message:
                    error.message || t("solar.error"),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="solar-wrap">
                <section className="solar-hero">
                    <div className="solar-badge">
                        <Sun size={16} />
                        {t("solar.heroBadge")}
                    </div>

                    <h1 className="solar-title">
                        {t("solar.heroTitle")}
                    </h1>

                    <p className="solar-desc">
                        {t("solar.heroDesc")}
                    </p>
                </section>

                <section className="solar-main-grid">
                    <div className="solar-panel">
                        <h2 className="solar-panel-title">
                            <MapPin size={20} />
                            {t("solar.conditionTitle")}
                        </h2>

                        <div className="solar-field">
                            <label className="solar-label">
                                {t("solar.county")}
                            </label>

                            <select
                                className="solar-control"
                                value={county}
                                onChange={(event) =>
                                    setCounty(event.target.value)
                                }
                            >
                                {COUNTIES.map((item) => (
                                    <option
                                        key={item.name}
                                        value={item.name}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="solar-field">
                            <label className="solar-label">
                                {t("solar.ping")}
                            </label>

                            <input
                                className="solar-control"
                                type="number"
                                value={ping}
                                min={1}
                                max={99999}
                                step={1}
                                onChange={(event) =>
                                    setPing(
                                        Math.max(
                                            1,
                                            Number(event.target.value) || 1
                                        )
                                    )
                                }
                            />
                        </div>

                        <div className="solar-note">
                            {t("solar.note")}
                        </div>
                    </div>

                    <div className="solar-metrics-grid">
                        {metrics.map((item) => (
                            <div
                                className="solar-metric-card"
                                key={item.label}
                            >
                                <div className="solar-metric-icon">
                                    {item.icon}
                                </div>

                                <div className="solar-metric-label">
                                    {item.label}
                                </div>

                                <div className="solar-metric-value">
                                    {item.value}
                                </div>

                                <div className="solar-metric-unit">
                                    {item.unit}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="solar-finance-panel">
                    <div className="solar-finance-top">
                        <div>
                            <div className="solar-finance-title">
                                {t("solar.financeTitle")}
                            </div>

                            <div className="solar-finance-amount">
                                NT$ {fmtInt(result.systemCost)}
                            </div>
                        </div>

                        <div className="solar-payback">
                            <div className="solar-payback-label">
                                {t("solar.payback")}
                            </div>

                            <div className="solar-payback-value">
                                {fmt(result.payback)}{" "}
                                {t("solar.units.year")}
                            </div>
                        </div>
                    </div>

                    <div className="solar-income-grid">
                        {incomeRows.map((item) => (
                            <div
                                className="solar-income-card"
                                key={item.label}
                            >
                                <div className="solar-income-head">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>

                                <div className="solar-income-value">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="solar-actions">
                        <button
                            className="solar-cta"
                            type="button"
                            onClick={() => {
                                setLeadStatus({
                                    type: "",
                                    message: "",
                                });

                                setIsLeadOpen(true);
                            }}
                        >
                            <Phone size={18} />
                            {t("solar.contactSales")}
                        </button>
                    </div>

                    <div className="solar-formula">
                        {t("solar.formula")}
                    </div>
                </section>
            </div>

            {isLeadOpen && (
                <div className="solar-backdrop">
                    <form
                        className="solar-modal"
                        onSubmit={handleLeadSubmit}
                    >
                        <div className="solar-modal-head">
                            <div>
                                <h2 className="solar-modal-title">
                                    {t("solar.modalTitle")}
                                </h2>

                                <p className="solar-modal-desc">
                                    {t("solar.modalDesc")}
                                </p>
                            </div>

                            <button
                                className="solar-close"
                                type="button"
                                onClick={() =>
                                    setIsLeadOpen(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="solar-modal-body">
                            <div>
                                <div className="solar-lead-grid">
                                    <div className="solar-field">
                                        <label className="solar-label">
                                            {t("solar.name")}
                                        </label>

                                        <input
                                            className="solar-control"
                                            name="name"
                                            value={leadForm.name}
                                            onChange={updateLeadField}
                                            required
                                        />
                                    </div>

                                    <div className="solar-field">
                                        <label className="solar-label">
                                            {t("solar.phone")}
                                        </label>

                                        <input
                                            className="solar-control"
                                            name="phone"
                                            value={leadForm.phone}
                                            onChange={updateLeadField}
                                            required
                                        />
                                    </div>

                                    <div className="solar-field full">
                                        <label className="solar-label">
                                            {t("solar.email")}
                                        </label>

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
                                        <label className="solar-label">
                                            {t("solar.remark")}
                                        </label>

                                        <textarea
                                            className="solar-control"
                                            name="note"
                                            value={leadForm.note}
                                            onChange={updateLeadField}
                                        />
                                    </div>
                                </div>

                                {leadStatus.message && (
                                    <div
                                        className={`solar-status ${leadStatus.type}`}
                                    >
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

                                        {isSubmitting
                                            ? t("solar.submitting")
                                            : t("solar.submit")}
                                    </button>
                                </div>
                            </div>

                            <aside className="solar-summary">
                                <h3 className="solar-summary-title">
                                    <CalendarClock size={18} />
                                    {t("solar.summary")}
                                </h3>

                                {[
                                    [
                                        t("solar.county"),
                                        county,
                                    ],
                                    [
                                        t("solar.ping"),
                                        `${fmt(Number(ping), 0)} ${t("solar.units.ping")}`,
                                    ],
                                    [
                                        t("solar.metrics.kw"),
                                        `${fmt(result.kw)} ${t("solar.units.kw")}`,
                                    ],
                                    [
                                        t("solar.financeTitle"),
                                        `NT$ ${fmtInt(result.systemCost)}`,
                                    ],
                                    [
                                        t("solar.income.year"),
                                        `NT$ ${fmt(result.annualIncome)}`,
                                    ],
                                    [
                                        t("solar.payback"),
                                        `${fmt(result.payback)} ${t("solar.units.year")}`,
                                    ],
                                ].map(([label, value]) => (
                                    <div
                                        className="solar-summary-row"
                                        key={label}
                                    >
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