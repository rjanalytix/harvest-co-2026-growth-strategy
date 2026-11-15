"""Builds every chart in the strategy deck from the raw data (no hard-coded data series).

Run from the repo root:  python src/make_charts.py
Output: reports/figures/*.png
"""
import numpy as np
import pandas as pd
from matplotlib.ticker import FuncFormatter

from common import load, customers, weekly_new, FIGURES, CHANNEL_ORDER
from theme import (plt, bar, clean, save, NAVY, PRIMARY, CORAL, TEAL, TINTS,
                   INK, BODY, MUTED, GRID, AXIS, CHANNEL_COLORS)

# Forecast planning range, as stated in the final deck (slide 8 / A4).
# It is an analyst judgement range for limited history (3 seasonal cycles),
# not the output of a formula, so it is set here as an explicit input.
PLANNING_RANGE = (230, 300)

FIGURES.mkdir(parents=True, exist_ok=True)
pct = FuncFormatter(lambda v, _: f"{v:.0f}%")
usd = FuncFormatter(lambda v, _: f"${v:.0f}")


def approx(v, step=5):
    """Round to the nearest `step` for '~' labels (e.g. ~90/wk)."""
    return int(step * round(v / step))


df = load()
c = customers(df)
w = weekly_new(df).values
iso = np.tile(np.arange(1, 53), 3)
idx = np.array([w[iso == k].mean() / w.mean() for k in range(1, 53)])
yrs = ["2023", "2024", "2025"]


# ---------- Slide 3: new customers and net revenue by year ----------
def yoy_bars(vals, fmt, name):
    ymax = max(vals) * 1.17
    fig, ax = plt.subplots(figsize=(5.9, 3.6))
    for i, v in enumerate(vals):
        bar(ax, i, v, 0.56, TINTS[i])
        ax.text(i, v + ymax * 0.025, fmt(v), ha="center", fontsize=13, fontweight="semibold", color=INK)
    for i in (1, 2):
        ch = (vals[i] / vals[i - 1] - 1) * 100
        ax.text(i - 0.5, ymax * 0.9, f"{ch:+.0f}%".replace("-", "−"), ha="center", fontsize=11.5,
                color=CORAL if ch < 0 else PRIMARY, fontweight="semibold",
                bbox=dict(boxstyle="round,pad=0.35", fc="white", ec=GRID))
    ax.set_xlim(-0.5, 2.5); ax.set_ylim(0, ymax)
    ax.set_xticks(range(3)); ax.set_xticklabels(yrs, fontsize=12.5, color=INK)
    clean(ax, ygrid=False, yaxis=False); ax.spines["bottom"].set_color(AXIS)
    save(fig, FIGURES / name)


new = df[df.is_first_delivery == 1].groupby("a_year").size().values
yoy_bars(new, lambda v: f"{v:,}", "s3_new_customers.png")
rev = df.groupby("d_year").net_revenue.sum().values / 1e6
yoy_bars(rev, lambda v: f"${v:.2f}M", "s3_net_revenue.png")

# ---------- Slide 4: weekly seasonality ----------
fig, ax = plt.subplots(figsize=(12.0, 4.0))
for xb in (52, 104):
    ax.axvline(xb, color=GRID, lw=1.2)
ax.plot(range(156), w, color=PRIMARY, lw=2.0)
ax.axhline(w.mean(), ls=(0, (5, 3)), color=MUTED, lw=1.3)
ax.text(1.5, w.mean() + 3, f"3-yr avg ≈ {w.mean():.0f}/wk", fontsize=10.5, color=BODY)
ax.annotate(f"Aug–Sept peak ~{approx(w[iso == 36].mean())}/wk", xy=(88, w[88]), xytext=(64, 124), fontsize=11,
            color=INK, ha="center", arrowprops=dict(arrowstyle="-", color=MUTED, lw=0.9))
ax.annotate(f"Dec trough ~{approx(w[iso == 52].mean())}/wk", xy=(155, w[155]), xytext=(136, 12), fontsize=11,
            color=INK, ha="center", arrowprops=dict(arrowstyle="-", color=MUTED, lw=0.9))
ax.set_xticks([26, 78, 130]); ax.set_xticklabels(yrs, fontsize=12, color=INK)
ax.set_ylim(0, 135); ax.set_xlim(-2, 157); ax.set_ylabel("New customers / week")
clean(ax); save(fig, FIGURES / "s4_seasonality.png")

# ---------- Slide 5: channel value vs retention (bubble area ∝ customers acquired) ----------
m = c[c.obs_weeks >= 26].copy()
m["rev26"] = df[df.tenure < 26].groupby("customer_id").net_revenue.sum().reindex(m.index).fillna(0)
m["ret26"] = m.last_tenure >= 26
bub = pd.DataFrame({"ret": m.groupby("channel").ret26.mean() * 100,
                    "net": m.groupby("channel").rev26.mean(),
                    "vol": c.channel.value_counts()}).reindex(CHANNEL_ORDER)
fig, ax = plt.subplots(figsize=(7.4, 4.75))
for name, r in bub.iterrows():
    s = r.vol * 0.38
    ax.scatter(r.ret, r.net, s=s, color=CHANNEL_COLORS[name], alpha=0.92, edgecolors="white", linewidths=2, zorder=3)
    ax.annotate(name, (r.ret, r.net), xytext=(0, np.sqrt(s) / 2 + 5), textcoords="offset points",
                ha="center", fontsize=11, color=INK, fontweight="semibold")
ax.set_xlim(0, 12); ax.set_ylim(250, 620)
ax.xaxis.set_major_formatter(pct); ax.yaxis.set_major_formatter(usd)
ax.set_xlabel("26-week retention", labelpad=8); ax.set_ylabel("Net revenue / customer (first 26 wks)", labelpad=8)
clean(ax); ax.grid(axis="x", color=GRID, lw=0.8)
ax.text(0.99, 0.02, "Bubble size = customers acquired", transform=ax.transAxes, ha="right", fontsize=10, color=MUTED)
save(fig, FIGURES / "s5_channel_bubble.png")

# ---------- Slide 6: revenue concentration by lifetime tier ----------
c["tier"] = pd.cut(c.n_deliv, [0, 1, 4, 12, 10**6], labels=["1 order", "2–4", "5–12", "13+"])
t = c.groupby("tier", observed=True).agg(n=("net", "size"), net=("net", "sum"))
custp, revp = (100 * t.n / t.n.sum()).values, (100 * t.net / t.net.sum()).values
xi, bw = np.arange(4), 0.36
fig, ax = plt.subplots(figsize=(5.9, 3.7))
for i in range(4):
    bar(ax, xi[i] - bw / 2 - 0.02, custp[i], bw, TINTS[0], r=0.04)
    bar(ax, xi[i] + bw / 2 + 0.02, revp[i], bw, PRIMARY, r=0.04)
    ax.text(xi[i] - bw / 2 - 0.02, custp[i] + 1.2, f"{custp[i]:.0f}%", ha="center", fontsize=10, color=BODY)
    ax.text(xi[i] + bw / 2 + 0.02, revp[i] + 1.2, f"{revp[i]:.0f}%", ha="center", fontsize=10, color=INK, fontweight="semibold")
ax.bar([0], [0], color=TINTS[0], label="% of customers"); ax.bar([0], [0], color=PRIMARY, label="% of net revenue")
ax.set_xlim(-0.6, 3.6); ax.set_ylim(0, 68)
ax.set_xticks(xi); ax.set_xticklabels(t.index, fontsize=11.5, color=INK)
ax.set_xlabel("Customer lifetime tier (total orders)", labelpad=6)
ax.legend(loc="upper left", fontsize=10.5)
clean(ax, ygrid=False, yaxis=False); save(fig, FIGURES / "s6_concentration.png")


# ---------- Slide 6: retention curves ----------
def curve(sub):
    return [100 * (sub[sub.obs_weeks >= k].last_tenure >= k).mean() for k in range(53)]


ovr, coh = curve(c), curve(c[c.a_idx <= 12])
fig, ax = plt.subplots(figsize=(5.9, 3.7))
ax.plot(range(53), coh, color=PRIMARY, lw=2.2, label=f"2023-Q1 cohort (n={int((c.a_idx <= 12).sum())})")
ax.plot(range(53), ovr, color=CORAL, lw=2.0, ls=(0, (5, 3)), label="Overall average")
for k in (4, 12, 26):
    ax.axvline(k, color=GRID, lw=1, zorder=0)
    ax.text(k + 0.8, ovr[k] + 4, f"{ovr[k]:.0f}%", fontsize=10, color=INK)
ax.set_xlim(0, 52); ax.set_ylim(0, 102); ax.set_xticks([0, 4, 12, 26, 52])
ax.set_xlabel("Weeks since signup"); ax.set_ylabel("% still active")
ax.yaxis.set_major_formatter(pct); ax.legend(loc="upper right", fontsize=10.5)
clean(ax); save(fig, FIGURES / "s6_retention.png")

# ---------- Slide 7: discount $ vs net revenue, first vs repeat ----------
first = df[df.is_first_delivery == 1]
fo = [100 * first.discount_amount.sum() / df.discount_amount.sum(), 100 * first.net_revenue.sum() / df.net_revenue.sum()]
rep = [100 - v for v in fo]
fig, ax = plt.subplots(figsize=(6.0, 4.4))
for i in range(2):
    bar(ax, i, fo[i], 0.5, CORAL, r=0.0001)
    bar(ax, i, rep[i] - 0.8, 0.5, PRIMARY, r=0.03, bottom=fo[i] + 0.8)  # 0.8-pt white gap between segments
    ax.text(i, fo[i] / 2, f"{fo[i]:.0f}%", ha="center", va="center", color="white", fontsize=13, fontweight="bold")
    ax.text(i, fo[i] + rep[i] / 2, f"{rep[i]:.0f}%", ha="center", va="center", color="white", fontsize=13, fontweight="bold")
ax.bar([0], [0], color=CORAL, label="First order"); ax.bar([0], [0], color=PRIMARY, label="Repeat orders")
ax.set_xlim(-0.5, 1.5); ax.set_ylim(0, 100)
ax.set_xticks([0, 1]); ax.set_xticklabels(["Discount $", "Net revenue"], fontsize=12, color=INK)
ax.legend(loc="upper center", bbox_to_anchor=(0.5, 1.1), ncol=2, fontsize=11)
clean(ax, ygrid=False, yaxis=False); save(fig, FIGURES / "s7_discount_vs_revenue.png")

# ---------- Slide 8: January 2026 forecast ----------
jan = idx[:4]
level = (w / idx[iso - 1])[-26:].mean()          # trailing-26-week deseasonalised run-rate
fc = level * jan
lo, hi = (PLANNING_RANGE[0] * jan / jan.sum(), PLANNING_RANGE[1] * jan / jan.sum())
fig, ax = plt.subplots(figsize=(7.4, 4.5))
ax.plot(range(130, 156), w[130:], color=PRIMARY, lw=2.2, label="Actual")
ax.fill_between([156, 157, 158, 159], lo, hi, color=CORAL, alpha=0.15, lw=0, label="Planning range")
ax.plot([155, 156, 157, 158, 159], [w[155], *fc], color=CORAL, lw=2.0, ls=(0, (4, 3)), marker="o", ms=6,
        markeredgecolor="white", label="Forecast")
ax.annotate(f"~{fc.sum():.0f} over 4 wks\n(range ~{PLANNING_RANGE[0]}–{PLANNING_RANGE[1]})", xy=(157.5, fc[2]),
            xytext=(149, 104), fontsize=11, color=INK, ha="center", fontweight="semibold",
            arrowprops=dict(arrowstyle="-", color=MUTED, lw=0.9))
ax.set_xticks([130, 143, 156, 159]); ax.set_xticklabels(["2025-W27", "2025-W40", "2026-W01", "W04"], fontsize=10.5)
ax.set_xlim(129, 160.5); ax.set_ylim(20, 122); ax.set_ylabel("New customers / week")
ax.legend(loc="lower left", fontsize=10.5)
clean(ax); save(fig, FIGURES / "s8_forecast.png")

# ---------- A3: discount $ by type ----------
share = (100 * df.groupby("discount_type").discount_amount.sum() / df.discount_amount.sum()).reindex(["First Order", "Promo Code", "Loyalty"])
fig, ax = plt.subplots(figsize=(6.6, 3.9))
cols = {"First Order": CORAL, "Promo Code": PRIMARY, "Loyalty": TEAL}
for i, (k, v) in enumerate(share[::-1].items()):
    ax.barh(i, v, height=0.56, color=cols[k])
    ax.text(v + 1.2, i, f"{v:.1f}%", va="center", fontsize=12, fontweight="semibold", color=INK)
ax.set_yticks(range(3)); ax.set_yticklabels(share.index[::-1], fontsize=12, color=INK)
ax.set_xlim(0, 85); ax.xaxis.set_major_formatter(pct); ax.set_xlabel("Share of total discount $")
for s in ("top", "right", "left"):
    ax.spines[s].set_visible(False)
ax.tick_params(length=0); ax.grid(axis="x", color=GRID, lw=0.8)
save(fig, FIGURES / "a3_discount_by_type.png")

# ---------- A9: indexed revenue vs customers ----------
g = df.groupby("d_year").agg(net=("net_revenue", "sum"), active=("customer_id", "nunique"))
g["new"] = first.groupby("a_year").size()
ix = 100 * g / g.iloc[0]
fig, ax = plt.subplots(figsize=(6.7, 4.3))
series = (("net", "Net revenue", PRIMARY, dict(lw=2.6, marker="o", ms=7)),
          ("active", "Active customers", TEAL, dict(lw=2.2, marker="s", ms=6)),
          ("new", "New customers", CORAL, dict(lw=2.2, ls=(0, (4, 3)), marker="^", ms=7)))
for col, lab, colr, kw in series:
    ax.plot(ix.index, ix[col], color=colr, label=lab, markeredgecolor="white", **kw)
    ax.annotate(f"{ix[col].iloc[-1]:.0f}", xy=(2025, ix[col].iloc[-1]), xytext=(8, -4), textcoords="offset points",
                fontsize=11, color=INK, fontweight="semibold")
ax.axhline(100, color=AXIS, lw=1)
ax.set_xticks([2023, 2024, 2025]); ax.set_xticklabels(yrs, fontsize=12, color=INK)
ax.set_ylim(80, 270); ax.set_xlim(2022.8, 2025.35); ax.set_ylabel("Indexed to 2023 = 100")
ax.legend(loc="upper left", fontsize=10.5)
clean(ax); save(fig, FIGURES / "a9_revenue_vs_customers.png")

print("charts written:", sorted(p.name for p in FIGURES.glob("*.png")))
