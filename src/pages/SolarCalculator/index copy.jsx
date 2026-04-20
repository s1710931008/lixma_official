import { useState, useMemo } from "react";

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

const SELL_PRICE = 4.69;   // 躉售電價（元/度）
const KW_PER_PING = 0.4;   // 每坪可建置容量
const PRICE_PER_KW = 60000; // 系統建置費用（元/KW）
const RENT_RATIO = 0.06;   // 租金比例

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
        const c = COUNTIES.find((x) => x.name === county) || COUNTIES[18];
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
        { label: "可建置容量", value: fmt(r.kw), unit: "KW" },
        { label: "躉售價格", value: fmt(SELL_PRICE), unit: "元/度" },
        { label: "預估平均日照", value: fmt(r.sun), unit: "小時/日" },
        { label: "預估年發電量", value: fmt(r.annualKwh), unit: "度" },
    ];

    const incomeRows = [
        { label: "躉售月收入", value: `NT$ ${fmt(r.monthlyIncome)}` },
        { label: "躉售年收入", value: `NT$ ${fmt(r.annualIncome)}` },
        { label: "租金月收入", value: `NT$ ${fmt(r.rentMonth)}` },
        { label: "租金年收入", value: `NT$ ${fmt(r.rentYear)}` },
    ];

    return (
        <div style={styles.wrapper}>
            <h1 style={styles.title}>太陽能屋頂型投資試算</h1>
            <p style={styles.note}>
                此投資試算為粗略概估，未列入系統建置方式、環境及經濟因素，相關數據僅供參考。
            </p>

            {/* 輸入區 */}
            <div style={styles.inputRow}>
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>縣市</label>
                    <select
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        style={styles.select}
                    >
                        {COUNTIES.map((c) => (
                            <option key={c.name} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>可用屋頂坪數</label>
                    <input
                        type="number"
                        value={ping}
                        min={1}
                        max={99999}
                        step={1}
                        onChange={(e) => setPing(Math.max(1, Number(e.target.value)))}
                        style={styles.input}
                    />
                </div>
            </div>

            <hr style={styles.divider} />

            {/* 指標卡 */}
            <div style={styles.metricsGrid}>
                {metrics.map(({ label, value, unit }) => (
                    <div key={label} style={styles.metricCard}>
                        <div style={styles.metricLabel}>{label}</div>
                        <div style={styles.metricValue}>{value}</div>
                        <div style={styles.metricUnit}>{unit}</div>
                    </div>
                ))}
            </div>

            {/* 費用與收入區塊 */}
            <div style={styles.financeCard}>
                <div style={styles.financeLabelRow}>
                    <span style={styles.financeLabel}>預估系統建置費用</span>
                </div>
                <div style={styles.financeAmount}>NT$ {fmtInt(r.systemCost)}</div>

                <hr style={styles.divider} />

                <div style={styles.incomeGrid}>
                    {incomeRows.map(({ label, value }) => (
                        <div key={label} style={styles.incomeItem}>
                            <div style={styles.incomLabel}>{label}</div>
                            <div style={styles.incomeValue}>{value}</div>
                        </div>
                    ))}
                </div>

                <hr style={styles.divider} />

                <div style={styles.paybackRow}>
                    <span style={styles.paybackLabel}>預估回收年限</span>
                    <span style={styles.paybackValue}>{fmt(r.payback)} 年</span>
                </div>
            </div>

            <p style={styles.formulaNote}>
                試算公式：可建置容量 = 坪數 × 0.4 KW；年發電量 = 容量 × 日照時數 × 365；
                系統建置費用 = 容量 × 60,000 元/KW；租金 = 躉售收入 × 6%
            </p>
        </div>
    );
}

const styles = {
    wrapper: {
        fontFamily: "'Noto Sans TC', sans-serif",
        maxWidth: 640,
        margin: "0 auto",
        padding: "2rem 1.25rem",
        color: "#1a1a1a",
    },
    title: {
        fontSize: 22,
        fontWeight: 600,
        marginBottom: 8,
    },
    note: {
        fontSize: 13,
        color: "#666",
        lineHeight: 1.6,
        marginBottom: 24,
    },
    inputRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        marginBottom: 24,
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },
    label: {
        fontSize: 13,
        color: "#555",
        fontWeight: 500,
    },
    select: {
        padding: "8px 10px",
        fontSize: 15,
        border: "1px solid #ccc",
        borderRadius: 8,
        background: "#fff",
        color: "#1a1a1a",
        outline: "none",
        cursor: "pointer",
    },
    input: {
        padding: "8px 10px",
        fontSize: 15,
        border: "1px solid #ccc",
        borderRadius: 8,
        background: "#fff",
        color: "#1a1a1a",
        outline: "none",
        width: "100%",
    },
    divider: {
        border: "none",
        borderTop: "1px solid #e5e5e5",
        margin: "16px 0",
    },
    metricsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 10,
        marginBottom: 16,
    },
    metricCard: {
        background: "#f5f5f5",
        borderRadius: 8,
        padding: "12px 14px",
    },
    metricLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 20,
        fontWeight: 600,
        color: "#1a1a1a",
    },
    metricUnit: {
        fontSize: 12,
        color: "#888",
        marginTop: 2,
    },
    financeCard: {
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: "1rem 1.25rem",
        marginBottom: 16,
        background: "#fff",
    },
    financeLabelRow: {
        marginBottom: 6,
    },
    financeLabel: {
        fontSize: 13,
        color: "#666",
        fontWeight: 500,
    },
    financeAmount: {
        fontSize: 26,
        fontWeight: 600,
        color: "#1a1a1a",
    },
    incomeGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
    },
    incomeItem: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    incomLabel: {
        fontSize: 12,
        color: "#888",
    },
    incomeValue: {
        fontSize: 16,
        fontWeight: 500,
        color: "#1a1a1a",
    },
    paybackRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    paybackLabel: {
        fontSize: 14,
        color: "#555",
    },
    paybackValue: {
        fontSize: 22,
        fontWeight: 600,
        color: "#185FA5",
    },
    formulaNote: {
        fontSize: 12,
        color: "#999",
        lineHeight: 1.7,
    },
};
