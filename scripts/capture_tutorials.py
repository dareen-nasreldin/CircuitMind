"""
CircuitMind — Tutorial PDF Capture Script
==========================================
Navigates to each tutorial in the Circuit Animator, screenshots every step,
and compiles each tutorial into its own PDF in tutorial-pdfs/.

Usage:
  python scripts/capture_tutorials.py

Requirements:
  pip install playwright
  python -m playwright install chromium

The Vite dev server must be running on localhost:5173 before you run this.
Start it with:  npm run dev
"""

import base64
import os
import sys
import time
from pathlib import Path

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5173")
OUTPUT_DIR = Path(__file__).parent.parent / "tutorial-pdfs"

# Order matches AnimatorPage CARDS array
TUTORIAL_SLUGS = [
    "ohmsLaw",
    "series",
    "parallel",
    "voltageDivider",
    "kvl",
    "kcl",
    "superposition",
    "thevenin",
    "norton",
]

VIEWPORT = {"width": 1400, "height": 900}


def build_pdf_html(title: str, screenshots: list[bytes], total: int) -> str:
    pages = ""
    for i, shot in enumerate(screenshots):
        b64 = base64.b64encode(shot).decode()
        pages += f"""
<div class="page">
  <div class="label">{title} — Step {i + 1} / {total}</div>
  <img src="data:image/png;base64,{b64}" />
</div>
"""
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ background: white; }}
  .page {{
    width: {VIEWPORT['width']}px;
    page-break-after: always;
    break-after: page;
  }}
  .page:last-child {{
    page-break-after: auto;
    break-after: auto;
  }}
  .label {{
    font-family: monospace;
    font-size: 11px;
    color: #888;
    padding: 3px 8px;
    border-bottom: 1px solid #eee;
    background: #fafafa;
  }}
  img {{ width: 100%; display: block; }}
</style>
</head>
<body>{pages}</body>
</html>"""


def capture_tutorial(page, card_index: int) -> tuple[str, list[bytes]]:
    page.goto(f"{BASE_URL}/animator", wait_until="networkidle")

    cards = page.locator("button.group").all()
    if card_index >= len(cards):
        raise RuntimeError(f"Card index {card_index} out of range (found {len(cards)} cards)")

    cards[card_index].click()
    time.sleep(0.7)

    title_el = page.locator(".font-mono.font-semibold.text-sm").first
    title = title_el.text_content().strip()

    step_el = page.locator("span", has_text="/ ").filter(has_text=" / ").first
    step_text = step_el.text_content().strip()  # "1 / N"
    total_steps = int(step_text.split("/")[1].strip())

    screenshots = []
    for i in range(total_steps):
        time.sleep(0.45)
        screenshots.append(page.screenshot(type="png"))
        if i < total_steps - 1:
            page.click('[title="Next (→)"]')

    return title, screenshots


def main():
    from playwright.sync_api import sync_playwright

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)

        for idx, slug in enumerate(TUTORIAL_SLUGS):
            page = browser.new_page()
            page.set_viewport_size(VIEWPORT)

            try:
                title, screenshots = capture_tutorial(page, idx)
            except Exception as e:
                print(f"  ERROR capturing {slug}: {e}", file=sys.stderr)
                page.close()
                continue

            page.close()

            pdf_page = browser.new_page()
            pdf_page.set_viewport_size(VIEWPORT)
            html = build_pdf_html(title, screenshots, len(screenshots))
            pdf_page.set_content(html, wait_until="load")

            out_path = OUTPUT_DIR / f"{idx + 1:02d}-{slug}.pdf"
            pdf_page.pdf(
                path=str(out_path),
                width=f"{VIEWPORT['width']}px",
                height=f"{VIEWPORT['height']}px",
                print_background=False,
            )
            pdf_page.close()

            print(f"  [{idx + 1}/{len(TUTORIAL_SLUGS)}] {title.encode('ascii','replace').decode()!r:35s} -> {out_path.name}")

        browser.close()

    print(f"\nDone. PDFs saved to: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
