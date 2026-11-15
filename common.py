"""Shared loading and week-indexing helpers used by every analysis script."""
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "raw" / "harvest_co_deliveries_2023_2025.xlsx"
FIGURES = ROOT / "reports" / "figures"
LAST_WEEK_IDX = 155  # 2025-W52; weeks are indexed 0..155 (52 ISO weeks x 3 years, no W53 present)
CHANNEL_ORDER = ["Organic", "Paid Social", "TV", "Paid Search", "Affiliate", "Referral"]


def week_index(s: pd.Series) -> pd.Series:
    """'2024-W07' -> 58. 2023-W01 = 0."""
    year = s.str.slice(0, 4).astype(int)
    wk = s.str.slice(6, 8).astype(int)
    return (year - 2023) * 52 + (wk - 1)


def load() -> pd.DataFrame:
    # Note: pandas reads the literal "None" in discount_type as missing; it means "no discount".
    df = pd.read_excel(DATA)
    df["d_idx"] = week_index(df["delivery_week"])
    df["a_idx"] = week_index(df["acquisition_week"])
    df["d_year"] = df["delivery_week"].str.slice(0, 4).astype(int)
    df["a_year"] = df["acquisition_week"].str.slice(0, 4).astype(int)
    df["iso_wk"] = df["delivery_week"].str.slice(6, 8).astype(int)
    df["tenure"] = df["d_idx"] - df["a_idx"]  # weeks since acquisition for this delivery
    return df


def customers(df: pd.DataFrame) -> pd.DataFrame:
    """One row per customer."""
    c = df.groupby("customer_id").agg(
        channel=("acquisition_channel", "first"),
        a_idx=("a_idx", "first"),
        a_year=("a_year", "first"),
        acq_week=("acquisition_week", "first"),
        last_idx=("d_idx", "max"),
        n_deliv=("delivery_id", "count"),
        net=("net_revenue", "sum"),
    )
    c["obs_weeks"] = LAST_WEEK_IDX - c["a_idx"]       # weeks of follow-up available
    c["last_tenure"] = c["last_idx"] - c["a_idx"]     # how far the delivery history reaches
    return c


def weekly_new(df: pd.DataFrame):
    """New customers per week, 156 values (index 0..155)."""
    first = df[df.is_first_delivery == 1]
    return first.groupby("a_idx").size().reindex(range(156), fill_value=0).astype(float)
