"""Harvest & Co. chart theme ("Midnight & Coral"), shared by every chart.

Channel colours were checked for colour-blind separation and contrast on white;
every channel keeps the same colour in every chart.
"""
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch

# Brand
NAVY = "#14213D"      # dark brand colour (title slides, table headers)
PRIMARY = "#3D52A8"   # main data colour
CORAL = "#E5534B"     # accent / cost / negative
TEAL = "#1B998B"
TINTS = ["#C5CDEA", "#8C9AD4", "#3D52A8"]  # light -> full primary, for ordered years

# Ink
INK, BODY, MUTED, GRID, AXIS = "#17201E", "#4B5553", "#8A9390", "#E8EBEE", "#CDD2D8"

CHANNEL_COLORS = {
    "Organic": "#1B998B",
    "Paid Social": "#3D52A8",
    "TV": "#E0892E",
    "Paid Search": "#3A9BDC",
    "Affiliate": "#B5508F",
    "Referral": "#E5534B",
}

FONT = "Inter" if any(f.name == "Inter" for f in font_manager.fontManager.ttflist) else "DejaVu Sans"
plt.rcParams.update({
    "font.family": FONT, "font.size": 12, "text.color": BODY,
    "axes.edgecolor": AXIS, "axes.linewidth": 0.8, "axes.labelcolor": BODY,
    "xtick.color": BODY, "ytick.color": MUTED, "axes.axisbelow": True,
    "legend.frameon": False, "savefig.dpi": 220, "figure.dpi": 110,
})


def bar(ax, x, h, w, color, r=0.05, bottom=0.0):
    """Vertical bar with a softly rounded top; the bottom corners sit below the
    base and are hidden (by the axis clip, or by the bar underneath when stacked)."""
    ext = h * 0.08 if bottom == 0 else 0
    ax.add_patch(FancyBboxPatch((x - w / 2, bottom - ext), w, h + ext,
                                boxstyle=f"round,pad=0,rounding_size={r}",
                                mutation_aspect=(h + ext) / (w * 8) if h else 1,
                                fc=color, ec="none", clip_on=True))


def clean(ax, ygrid=True, yaxis=True):
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    if not yaxis:
        ax.spines["left"].set_visible(False)
        ax.tick_params(axis="y", left=False, labelleft=False)
    ax.tick_params(length=0)
    if ygrid:
        ax.grid(axis="y", color=GRID, lw=0.8)


def save(fig, path):
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight", facecolor="white")
    plt.close(fig)
