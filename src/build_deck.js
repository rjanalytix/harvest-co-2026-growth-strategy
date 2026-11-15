// Assembles the 20-slide strategy deck from the charts in reports/figures.
// Run from the repo root (after `python src/make_charts.py`):  node src/build_deck.js
const path = require("path");
const pptxgen = require("pptxgenjs");

const FIG = (f) => path.join(__dirname, "..", "reports", "figures", f);
const OUTFILE = path.join(__dirname, "..", "reports", "Harvest_and_Co_2026_Growth_Strategy.pptx");

const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
p.author = "Harvest & Co. Analytics";
p.company = "Harvest &amp; Co."; // pptxgenjs does not escape the company field, so pre-escape it
p.title = "Harvest & Co. — 2026 Growth Strategy";

// Theme: Midnight & Coral
const F = "Inter";
const NAVY = "14213D", PRIMARY = "3D52A8", CORAL = "E5534B", TEAL = "1B998B";
const INK = "17201E", BODY = "4B5553", MUTED = "8A9390", LINE = "E3E6EB", CARD = "F6F7FA", TINT = "EEF1FA", WHITE = "FFFFFF";
const W = 13.333, H = 7.5, MX = 0.65;
let n = 0; // running slide number

function next(bg) { n += 1; const s = p.addSlide(); if (bg) s.background = { color: bg }; return s; }
function footer(s) {
  s.addShape(p.ShapeType.line, { x: MX, y: H - 0.55, w: W - 2 * MX, h: 0, line: { color: LINE, width: 0.75 } });
  s.addText("Harvest & Co.  ·  2026 Growth Strategy", { x: MX, y: H - 0.47, w: 8, h: 0.3, fontFace: F, fontSize: 9, color: MUTED, margin: 0 });
  s.addText(String(n), { x: W - MX - 1, y: H - 0.47, w: 1, h: 0.3, fontFace: F, fontSize: 9, color: MUTED, align: "right", margin: 0 });
}
function title(s, t) {
  s.addText(t, { x: MX, y: 0.45, w: W - 2 * MX, h: 0.95, fontFace: F, fontSize: 24, bold: true, color: INK, valign: "top", margin: 0 });
}
function appTitle(s, tag, t) {
  s.addText(tag, { x: MX, y: 0.42, w: 3, h: 0.32, fontFace: F, fontSize: 12, bold: true, color: PRIMARY, charSpacing: 1.5, margin: 0 });
  s.addText(t, { x: MX, y: 0.78, w: W - 2 * MX, h: 0.6, fontFace: F, fontSize: 24, bold: true, color: INK, margin: 0 });
}
function sub(s, t, x) {
  s.addText(t, { x, y: 1.45, w: 5.9, h: 0.35, fontFace: F, fontSize: 12, bold: true, color: BODY, margin: 0, charSpacing: 0.5 });
}
function callout(s, x, y, w, h, label, text, sz) {
  s.addShape(p.ShapeType.rect, { x, y, w, h, fill: { color: TINT }, line: { type: "none" } });
  s.addShape(p.ShapeType.rect, { x, y, w: 0.08, h, fill: { color: PRIMARY }, line: { type: "none" } });
  s.addText([{ text: label + "  ", options: { bold: true, color: PRIMARY } }, { text, options: { color: INK } }],
    { x: x + 0.35, y, w: w - 0.6, h, fontFace: F, fontSize: sz || 14, valign: "middle", margin: 0 });
}
function band(s, y, h, label, text, sz) { callout(s, MX, y, W - 2 * MX, h, label, text, sz); }
function fnote(s, text, y) {
  s.addText(text, { x: MX, y: y || H - 0.95, w: W - 2 * MX, h: 0.3, fontFace: F, fontSize: 9, color: MUTED, margin: 0, valign: "top" });
}
function card(s, x, y, w, h) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: CARD }, line: { color: LINE, width: 0.75 } });
}
function img(s, file, x, y, w, h) { s.addImage({ path: FIG(file), x, y, w, h, sizing: { type: "contain", w, h } }); }
function bullets(s, items, x, y, w, h, sz) {
  s.addText(items.map((t) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: true, paraSpaceAfter: 10, color: BODY, fontSize: sz || 14, fontFace: F } })),
    { x, y, w, h, valign: "top", margin: 0 });
}
function numbered(s, i, x, y, d) {
  s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: PRIMARY }, line: { type: "none" } });
  s.addText(String(i), { x, y, w: d, h: d, fontFace: F, fontSize: d > 0.45 ? 17 : 14, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
}
const HD = (t, sz, align) => ({ text: t, options: { bold: true, color: WHITE, fill: { color: NAVY }, fontFace: F, fontSize: sz, align: align || "center", valign: "middle", margin: 5 } });
const CL = (t, sz, o = {}) => ({ text: t, options: Object.assign({ color: BODY, fontFace: F, fontSize: sz, align: "center", valign: "middle", margin: 5 }, o) });
const TBL = { border: { type: "solid", color: LINE, pt: 0.75 }, valign: "middle", autoPage: false };

/* 1 - Title */
let s = next(NAVY);
s.addShape(p.ShapeType.rect, { x: MX, y: 1.55, w: 0.6, h: 0.06, fill: { color: "FF8A80" }, line: { type: "none" } });
s.addText("HARVEST & CO.  ·  STRATEGY RECOMMENDATION", { x: MX, y: 1.8, w: 11, h: 0.4, fontFace: F, fontSize: 12, bold: true, color: "FF8A80", charSpacing: 3, margin: 0 });
s.addText("2026 Customer Acquisition\n& Budget Strategy", { x: MX, y: 2.35, w: 12, h: 1.9, fontFace: F, fontSize: 42, bold: true, color: WHITE, margin: 0, lineSpacingMultiple: 1.0 });
s.addText("Acquisition trends, retention, revenue patterns and seasonality", { x: MX, y: 4.45, w: 12, h: 0.5, fontFace: F, fontSize: 17, color: "C9D3E6", margin: 0 });
s.addText("3 years of delivery data (2023–2025, US)   ·   53,824 deliveries   ·   9,062 customers", { x: MX, y: 6.4, w: 12, h: 0.4, fontFace: F, fontSize: 11.5, color: "A9B6CF", margin: 0 });
s.addNotes("I'll walk through what the customer data tells us about where customer value comes from, what I think we should fix, and how seasonality should influence the timing of acquisition investment.");

/* 2 - Bottom line up front */
s = next(); title(s, "Acquisition is contracting, but revenue is still growing on the retained base");
const kpis = [
  ["ACQUISITION", "−23%", "2025 YoY", "New customers are back to the ~58/week baseline; 2024 was a spike", CORAL],
  ["REVENUE", "+18%", "2025 YoY", "Net revenue still rose $1.72M → $2.03M, while active customers fell 19%", PRIMARY],
  ["VALUE", "57%", "of net revenue", "comes from the ~10% most loyal customers; 31% never reorder", PRIMARY],
  ["CHANNEL QUALITY", "Organic ▸ Referral", "observed economics", "Organic leads on customer economics; Referral trails", PRIMARY],
];
const cw = (W - 2 * MX - 3 * 0.3) / 4;
kpis.forEach((b, i) => {
  const x = MX + i * (cw + 0.3); card(s, x, 1.65, cw, 3.4);
  s.addText(b[0], { x: x + 0.25, y: 1.9, w: cw - 0.5, h: 0.35, fontFace: F, fontSize: 10.5, bold: true, color: MUTED, charSpacing: 1.5, margin: 0 });
  s.addText(b[1], { x: x + 0.25, y: 2.35, w: cw - 0.5, h: 0.95, fontFace: F, fontSize: b[1].length > 8 ? 21 : 40, bold: true, color: b[4], margin: 0, valign: "middle" });
  s.addText(b[2], { x: x + 0.25, y: 3.35, w: cw - 0.5, h: 0.3, fontFace: F, fontSize: 11, color: MUTED, margin: 0 });
  s.addText(b[3], { x: x + 0.25, y: 3.75, w: cw - 0.5, h: 1.2, fontFace: F, fontSize: 12.5, color: BODY, margin: 0, valign: "top" });
});
band(s, 5.4, 0.95, "Implication:", "prioritize retention-adjusted channel value in 2026 allocation.", 17);
footer(s);
s.addNotes("Acquisition and the active base are both shrinking, but revenue is still growing because the active customers who stayed ordered more often — which is why retention and channel quality drive the 2026 decision.");

/* 3 - Acquisition vs revenue */
s = next(); title(s, "New-customer acquisition: 2024 was an outlier, 2025 returned toward the underlying trend");
sub(s, "New customers by year", MX); sub(s, "Net revenue by year", W / 2 + 0.1);
img(s, "s3_new_customers.png", MX, 1.85, 5.9, 3.55);
img(s, "s3_net_revenue.png", W / 2 + 0.1, 1.85, 5.9, 3.55);
band(s, 5.6, 0.85, "Planning implication:", "anchor 2026 new-customer targets to the ~58/week trend, not the 2024 peak — current revenue growth depends on retention, not acquisition.", 13);
fnote(s, "1.  2023 was a ramp / launch year, which inflates the 2024 year-over-year comparison; 2024 → 2025 is the cleaner read.", 6.6);
footer(s);
s.addNotes("This slide is acquisition and revenue side by side. New customers and the active base both fell in 2025, but revenue still grew — which is the setup for the retention slides.");

/* 4 - Seasonality */
s = next(); title(s, "A stable seasonal pattern creates a clear planning opportunity");
img(s, "s4_seasonality.png", MX, 1.5, W - 2 * MX, 4.15);
band(s, 5.85, 0.85, "Opportunity:", "concentrate acquisition when volume has historically been strongest — then validate the CAC impact with spend data.", 14);
footer(s);
s.addNotes("Concentrate investment when acquisition volume has historically been strongest, then validate the CAC impact with spend data — I'm not claiming seasonality lowers CAC by itself.");

/* 5 - Volume vs value */
s = next(); title(s, "Our highest-volume channels are not our highest-value channels");
img(s, "s5_channel_bubble.png", MX, 1.45, 7.4, 4.85);
[["Organic", "Best observed value ($553, 10.0% retention) — but the smallest channel (524 customers)", TEAL],
 ["Paid Social", "The largest channel (2,766) and a scalable workhorse ($459, 8.2% retention)", PRIMARY],
 ["Referral", "The 4th-largest channel (1,463) with the weakest economics — $285/customer, 2.2% retention, 57%-off first box", CORAL],
].forEach((c, i) => {
  const y = 1.75 + i * 1.45;
  s.addShape(p.ShapeType.ellipse, { x: 8.45, y: y + 0.08, w: 0.17, h: 0.17, fill: { color: c[2] }, line: { type: "none" } });
  s.addText(c[0], { x: 8.75, y, w: 4, h: 0.34, fontFace: F, fontSize: 15, bold: true, color: INK, margin: 0 });
  s.addText(c[1], { x: 8.75, y: y + 0.38, w: 3.95, h: 0.95, fontFace: F, fontSize: 12, color: BODY, margin: 0, valign: "top" });
});
fnote(s, "1.  26-week metrics use only customers with ≥ 26 weeks of observation, so immature 2025 cohorts are not compared against mature 2023 ones.", 6.6);
footer(s);
s.addNotes("The point isn't that Paid Social is bad — acquisition scale and customer value are different dimensions. Organic is small but retains and earns more per customer; Referral is a mid-sized channel whose customers are the least valuable.");

/* 6 - Retention and concentration */
s = next(); title(s, "A small core of repeat customers drives a disproportionate share of revenue");
sub(s, "Customers vs. revenue, by lifetime tier", MX); sub(s, "Retention: featured cohort vs. average", W / 2 + 0.1);
img(s, "s6_concentration.png", MX, 1.85, 5.9, 3.65);
img(s, "s6_retention.png", W / 2 + 0.1, 1.85, 5.9, 3.65);
band(s, 5.75, 0.85, "Takeaway:", "improving repeat behavior deserves at least as much attention as increasing acquisition volume — at week 4, only ~28% of a cohort is still active.", 13);
footer(s);
s.addNotes("The economics suggest that improving repeat behavior deserves at least as much attention as increasing acquisition volume.");

/* 7 - Discounts */
s = next(); title(s, "Most discount investment happens at acquisition, while most revenue comes from repeat orders");
img(s, "s7_discount_vs_revenue.png", MX, 1.6, 6.0, 4.6);
bullets(s, [
  "Discount dollars: 73.5% first-order (avg 34% off) vs. 26.5% repeat",
  "Net revenue: 12.3% first-order vs. 87.7% repeat",
  "Referral has the deepest first-order discount (57%) and the lowest observed retention (2.2%)",
], 7.1, 1.9, 5.6, 2.6, 14);
callout(s, 7.1, 4.75, 5.58, 1.35, "Implication (to test):", "rebalancing discount toward reorder incentives may improve economics.", 14);
footer(s);
s.addNotes("We're paying most heavily at the point of acquisition, while most value is generated through retention. This stays a hypothesis to test, not a proven saving.");

/* 8 - Forecast */
s = next(); title(s, "January 2026 acquisition forecast");
img(s, "s8_forecast.png", MX, 1.5, 7.4, 4.75);
card(s, 8.35, 1.65, 4.33, 1.95);
s.addText("~264", { x: 8.35, y: 1.8, w: 4.33, h: 0.95, fontFace: F, fontSize: 46, bold: true, color: PRIMARY, align: "center", margin: 0 });
s.addText("expected new customers, weeks 157–160", { x: 8.45, y: 2.8, w: 4.13, h: 0.6, fontFace: F, fontSize: 12.5, color: BODY, align: "center", margin: 0 });
s.addShape(p.ShapeType.rect, { x: 8.35, y: 3.85, w: 4.33, h: 0.9, fill: { color: TINT }, line: { type: "none" } });
s.addText([{ text: "Planning range:  ", options: { color: PRIMARY, bold: true } }, { text: "~230–300", options: { color: INK, bold: true } }],
  { x: 8.35, y: 3.85, w: 4.33, h: 0.9, fontFace: F, fontSize: 17, align: "center", valign: "middle", margin: 0 });
s.addText("Method: seasonal pattern × current run-rate (~58/wk) — simple and transparent. Only 3 seasonal cycles, so a planning anchor, not a promise.",
  { x: 8.35, y: 5.0, w: 4.33, h: 1.2, fontFace: F, fontSize: 12, italic: true, color: BODY, margin: 0 });
footer(s);
s.addNotes("Keep this to about a minute — a planning input, not the headline. The range is widened for limited history, not a tight statistical interval.");

/* 9 - Four actions */
s = next(); title(s, "Four actions to shift acquisition toward customer value");
const C9 = (t, o = {}) => CL(t, 12, Object.assign({ align: "left" }, o));
const P9 = (t, c) => CL(t, 12, { bold: true, color: c });
s.addTable([
  [HD("Action", 12.5, "left"), HD("Rationale", 12.5, "left"), HD("Priority", 12.5), HD("What makes it a decision", 12.5, "left")],
  [C9("Fix second-box conversion", { bold: true, color: INK }), C9("31% never reorder; retention is the value engine"), P9("Highest", CORAL), C9("Test lower first-order discount + reorder incentive + wk 2–4 onboarding")],
  [C9("Restructure Referral", { bold: true, color: INK }), C9("Mid-sized volume, weakest economics, deepest discount"), P9("High", CORAL), C9("Validate with a controlled incentive-redesign test")],
  [C9("Scale Organic selectively", { bold: true, color: INK }), C9("Best observed value but smallest volume"), P9("Validate", PRIMARY), C9("Investigate marginal CAC and how far it scales")],
  [C9("Time acquisition investment", { bold: true, color: INK }), C9("Stable, repeatable seasonal pattern"), P9("Planning", PRIMARY), C9("Concentrate in strong windows; confirm CAC impact with spend data")],
], Object.assign({ x: MX, y: 1.6, w: W - 2 * MX, colW: [2.75, 3.2, 1.3, 4.78], rowH: [0.5, 1.0, 1.0, 1.0, 1.0] }, TBL));
footer(s);
s.addNotes("Ordered by how strongly the current data supports them — an observed customer-value problem first, then two channel hypotheses, then a planning optimization.");

/* 10 - Next steps */
s = next(); title(s, "Next steps");
[["Act", "Launch the second-box conversion test"], ["Validate", "Test a Referral incentive redesign"],
 ["Scale selectively", "Investigate Organic scalability (marginal CAC)"],
 ["Measure", "Bring in channel spend + margin: CAC → observed customer value → payback → incremental ROI"]].forEach((st, i) => {
  const y = 1.8 + i * 0.92;
  numbered(s, i + 1, MX, y, 0.5);
  s.addText(st[0], { x: MX + 0.75, y: y - 0.03, w: 3.1, h: 0.55, fontFace: F, fontSize: 18, bold: true, color: INK, valign: "middle", margin: 0 });
  s.addText(st[1], { x: MX + 3.9, y: y - 0.03, w: 8.1, h: 0.55, fontFace: F, fontSize: 14.5, color: BODY, valign: "middle", margin: 0 });
});
s.addShape(p.ShapeType.rect, { x: MX, y: 5.65, w: W - 2 * MX, h: 0.95, fill: { color: NAVY }, line: { type: "none" } });
s.addText([{ text: "2026 allocation decision  =  ", options: { color: "FF8A80" } }, { text: "customer value  ×  acquisition economics  ×  scalability", options: { color: WHITE } }],
  { x: MX + 0.3, y: 5.65, w: W - 2 * MX - 0.6, h: 0.95, fontFace: F, fontSize: 18, bold: true, align: "center", valign: "middle", margin: 0 });
footer(s);
s.addNotes("This deck establishes customer value. The allocation decision needs two more inputs — economics and scalability — and here's how I'd get them.");

/* 11 - Appendix divider */
s = next(NAVY);
s.addShape(p.ShapeType.rect, { x: MX, y: 2.45, w: 0.6, h: 0.06, fill: { color: "FF8A80" }, line: { type: "none" } });
s.addText("Appendix", { x: MX, y: 2.7, w: 12, h: 1, fontFace: F, fontSize: 40, bold: true, color: WHITE, margin: 0 });
s.addText("Methodology, sensitivity checks & supporting detail", { x: MX, y: 3.75, w: 12, h: 0.6, fontFace: F, fontSize: 18, color: "C9D3E6", margin: 0 });

/* A1 - Channel economics */
s = next(); appTitle(s, "A1", "Full channel economics");
const a1 = [["Organic", "524", "$553", "10.0%", "29%", "77%", TEAL], ["Paid Social", "2,766", "$459", "8.2%", "28%", "71%", INK],
  ["TV", "1,646", "$447", "5.8%", "29%", "68%", INK], ["Paid Search", "1,553", "$395", "6.1%", "29%", "69%", INK],
  ["Affiliate", "1,110", "$348", "4.2%", "29%", "66%", INK], ["Referral", "1,463", "$285", "2.2%", "57%", "61%", CORAL]];
s.addTable([
  ["Channel", "Customers acquired", "Net rev / cust (26 wk)", "26-wk retention", "First-order discount", "Repeat rate"].map((t) => HD(t, 11.5)),
  ...a1.map((r) => [CL(r[0], 12, { align: "left", bold: true, color: r[6] }), ...r.slice(1, 6).map((v) => CL(v, 12))]),
], Object.assign({ x: MX, y: 1.7, w: W - 2 * MX, colW: [2.33, 1.95, 2.45, 1.9, 2.0, 1.4], rowH: 0.6 }, TBL));
fnote(s, "1.  Value metrics (net revenue, retention, discount, repeat rate) are computed on the 7,447 customers with ≥ 26 weeks of observation; “Customers acquired” counts all customers.", 6.3);
footer(s);

/* A2 - Retention methodology */
s = next(); appTitle(s, "A2", "Active-retention methodology");
[["Definition", "A customer is counted as retained at tenure k if their observed delivery history extends to at least k weeks after acquisition. Customers who return after a pause remain in the retained population."],
 ["Censoring", "At each tenure k, the denominator is restricted to customers with at least k weeks of observation — so recent, immature cohorts don't distort the curve."],
 ["Limitation", "The dataset does not identify whether an inactive period is a temporary pause or permanent churn. All curves measure observed activity, not stated cancellation."]].forEach((r, i) => {
  const y = 1.7 + i * 1.58;
  card(s, MX, y, W - 2 * MX, 1.42);
  s.addText(r[0], { x: MX + 0.3, y: y + 0.16, w: 3, h: 0.4, fontFace: F, fontSize: 15, bold: true, color: PRIMARY, margin: 0 });
  s.addText(r[1], { x: MX + 0.3, y: y + 0.56, w: W - 2 * MX - 0.6, h: 0.78, fontFace: F, fontSize: 13, color: BODY, margin: 0, valign: "top" });
});
footer(s);

/* A3 - Discount deep-dive */
s = next(); appTitle(s, "A3", "Discount deep-dive");
img(s, "a3_discount_by_type.png", MX, 1.7, 6.6, 4.2);
card(s, 7.6, 1.8, 5.08, 1.65);
s.addText("Discount intensity is falling", { x: 7.85, y: 1.95, w: 4.6, h: 0.4, fontFace: F, fontSize: 15, bold: true, color: PRIMARY, margin: 0 });
s.addText("Discount rate by year: 9.6% → 8.4% → 6.6%. Pricing discipline is improving, though it coincides with the 2025 acquisition slowdown.", { x: 7.85, y: 2.38, w: 4.6, h: 1.0, fontFace: F, fontSize: 13, color: BODY, margin: 0, valign: "top" });
card(s, 7.6, 3.65, 5.08, 1.4);
s.addText("Total discount", { x: 7.85, y: 3.8, w: 4.6, h: 0.4, fontFace: F, fontSize: 15, bold: true, color: PRIMARY, margin: 0 });
s.addText("$391K = 7.9% of gross revenue. 73.5% of it is spent on first orders.", { x: 7.85, y: 4.22, w: 4.6, h: 0.75, fontFace: F, fontSize: 13, color: BODY, margin: 0, valign: "top" });
footer(s);

/* A4 - Forecast methodology */
s = next(); appTitle(s, "A4", "Forecast methodology & sensitivity");
bullets(s, [
  "Target: new customers per week (customers whose acquisition week = that week).",
  "Seasonal index per ISO week = 3-year mean for that week ÷ grand weekly mean (58.1).",
  "Level = trailing-26-week deseasonalized mean (~58/wk), cross-checked vs. full-2025 (~56).",
  "Forecast = level × January seasonal indices (W1–W4 ≈ 1.21 / 1.18 / 1.05 / 1.11).",
  "Range widened beyond method spread (256–290) to ~230–300 for only 3 cycles of history.",
  "Why not ARIMA / Holt-Winters: 3 seasonal cycles is too little to fit them reliably; a transparent index method is more defensible.",
], MX, 1.75, W - 2 * MX, 4.5, 14.5);
footer(s);

/* A5 - Data validation */
s = next(); appTitle(s, "A5", "Data sources & validation");
bullets(s, [
  "53,824 delivery-level rows · 9,062 customers · 156 weeks (2023-W01 → 2025-W52) · US only.",
  "No duplicate delivery IDs.",
  "Revenue identity net = gross − discount holds to the cent across all rows.",
  "Each customer has exactly one first delivery, matching a single constant acquisition week.",
  "Only missing values are discount type, present exactly when no discount applied.",
], MX, 1.75, W - 2 * MX, 4, 15);
footer(s);

/* A6 - Limitations */
s = next(); appTitle(s, "A6", "Limitations");
bullets(s, [
  "No cost / spend data — CAC, ROAS and payback cannot be calculated.",
  "No gross margin — value is revenue, not contribution.",
  "Pause vs. churn is inferred from activity, not stated.",
  "US-only — no geographic analysis despite the global remit.",
  "Only three seasonal cycles — seasonality and forecast carry real uncertainty.",
  "No operational metrics (delivery timeliness / failures) — a likely churn driver.",
], MX, 1.75, W - 2 * MX, 4.2, 15);
footer(s);

/* A7 - Data request */
s = next(); appTitle(s, "A7", "Prioritized data request");
[["Marketing spend by channel & week", "The top gap — turns this into CAC, ROAS and payback."],
 ["Pause vs. churn / cancellation reasons", "Separates recoverable pauses from true churn; enables win-back."],
 ["Referral program mechanics", "Reward structure & referrer identity — to confirm the value-trap."],
 ["Customer demographics & geography", "Segmentation and real multi-country analysis."],
 ["Delivery / operations quality", "Test operational failures as a churn driver."],
 ["Gross margin by product / box size", "Value channels on profit, not revenue."]].forEach((t, i) => {
  const y = 1.75 + i * 0.8;
  numbered(s, i + 1, MX, y, 0.42);
  s.addText(t[0], { x: MX + 0.62, y: y - 0.04, w: 5.2, h: 0.5, fontFace: F, fontSize: 14.5, bold: true, color: INK, valign: "middle", margin: 0 });
  s.addText(t[1], { x: MX + 5.9, y: y - 0.04, w: 6.1, h: 0.5, fontFace: F, fontSize: 13, color: BODY, valign: "middle", margin: 0 });
});
footer(s);

/* A8 - Retention sensitivity */
s = next(); appTitle(s, "A8", "Retention sensitivity by window");
s.addTable([
  ["Retention window", "Organic", "Paid Social", "Referral"].map((t) => HD(t, 13)),
  ...[["12 weeks", "19.0%", "14.4%", "5.4%"], ["26 weeks", "10.0%", "8.2%", "2.2%"], ["52 weeks", "5.4%", "3.1%", "0.8%"]]
    .map((r) => [CL(r[0], 13, { bold: true, color: INK, align: "left" }), ...r.slice(1).map((v) => CL(v, 13))]),
], Object.assign({ x: MX, y: 1.75, w: 8.6, colW: [2.9, 1.9, 1.9, 1.9], rowH: 0.6 }, TBL));
callout(s, MX, 4.35, 8.6, 1.45, "Channel ranking is invariant across retention windows.", "Organic > Paid Social > Paid Search > TV > Affiliate > Referral holds at 12, 26 and 52 weeks — the conclusion doesn't depend on the 26-week choice.", 14);
footer(s);

/* A9 - Revenue vs customers */
s = next(); appTitle(s, "A9", "Revenue grew while acquisition and the active base shrank");
img(s, "a9_revenue_vs_customers.png", MX, 1.6, 6.7, 4.4);
s.addTable([
  ["Year", "Net revenue", "New cust.", "Active cust."].map((t) => HD(t, 10.5)),
  ...[["2023", "$835K", "2,310", "2,310"], ["2024", "$1.72M (+106%)", "3,810 (+65%)", "4,022 (+74%)"], ["2025", "$2.03M (+18%)", "2,942 (−23%)", "3,269 (−19%)"]]
    .map((r) => [CL(r[0], 11, { bold: true, color: INK }), ...r.slice(1).map((v) => CL(v, 11))]),
], Object.assign({ x: 7.55, y: 1.7, w: 5.13, colW: [0.8, 1.83, 1.25, 1.25], rowH: 0.5 }, TBL));
s.addText([
  { text: "Revenue grew every year, including +18% in 2025, while new customers (−23%) and active customers (−19%) both fell.", options: { color: BODY, breakLine: true, paraSpaceAfter: 10 } },
  { text: "The gap is order frequency, not price: net revenue per active customer rose $427 → $620 (+45%); price per delivery stayed flat (~$85).", options: { color: BODY, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Risk: 2025 growth rests on a smaller, higher-frequency active base while acquisition falls — exposed if acquisition keeps declining.", options: { color: CORAL, bold: true } },
], { x: 7.55, y: 3.85, w: 5.13, h: 2.4, fontFace: F, fontSize: 12, margin: 0, valign: "top" });
fnote(s, "1.  “New customers” = acquired that year; “active customers” = any delivery that year; revenue = delivery-year net revenue.  2023 was a ramp year, inflating the 2024 comparison.", 6.6);
footer(s);

p.writeFile({ fileName: OUTFILE }).then((f) => console.log("saved", f, "-", n, "slides"));
