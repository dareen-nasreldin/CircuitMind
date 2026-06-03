"""
scripts/gemini_to_claude.py
--------------------------------------------------------------------------------
Fetches a Gemini review conversation, extracts every ready-to-paste Claude Code
prompt from the blockquotes, and runs them through the Claude Code CLI one by
one -- fully automated.

Usage
-----
    # Full pipeline: open browser -> fetch -> apply all fixes
    python scripts/gemini_to_claude.py

    # Skip browser, re-use a previously saved review
    python scripts/gemini_to_claude.py --from-file

    # Different Gemini conversation URL
    python scripts/gemini_to_claude.py --url https://gemini.google.com/app/XXX

    # Dry-run: print prompts without running Claude
    python scripts/gemini_to_claude.py --dry-run

Requirements
------------
    pip install playwright
    python -m playwright install chromium
"""

import argparse
import re
import subprocess
import sys
import time
from pathlib import Path

# Config
PROJECT_DIR = Path(__file__).parent.parent
REVIEW_FILE = PROJECT_DIR / "gemini_review.txt"
PROFILE_DIR = Path.home() / ".claude" / "playwright-gemini"
DEFAULT_URL  = "https://gemini.google.com/app/ac2888e79c1f4a51"

SEP = "-" * 72


# Phase 1: fetch Gemini response from the live conversation

def fetch_response(url: str) -> str:
    from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    print("  Browser profile :", PROFILE_DIR)
    print("  Conversation    :", url)

    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            headless=False,
            slow_mo=40,
            args=["--start-maximized"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.set_viewport_size({"width": 1280, "height": 900})
        page.goto(url, wait_until="domcontentloaded", timeout=60_000)

        print("  Waiting for Gemini to finish generating...")
        try:
            page.wait_for_selector(
                "button[aria-label='Stop response']", timeout=8_000
            )
        except PWTimeout:
            pass  # already done

        try:
            page.wait_for_selector(
                "button[aria-label='Stop response']",
                state="detached",
                timeout=300_000,
            )
            print("  Response complete.")
        except PWTimeout:
            print("  [warn] Timed out -- extracting whatever is there.")

        # Pull text from every blockquote (where Gemini puts the fix prompts)
        quotes = page.locator("blockquote").all_inner_texts()

        if not quotes:
            # Fallback: grab the whole model reply area
            els = page.locator("[data-message-author-role='model']").all()
            quotes = [el.inner_text() for el in els]

        ctx.close()

    return "\n\n---QUOTE---\n\n".join(quotes)


# Phase 2: extract individual prompts

def extract_prompts(text: str) -> list:
    """
    Return every chunk that looks like a Claude Code prompt.
    Handles two input formats:
      A) Our ---QUOTE--- separator (from fetch_response / gemini_review.txt)
      B) Raw Gemini copy-paste with "In src/..." embedded anywhere
    """
    # Format A: separator-based
    chunks = [c.strip() for c in text.split("---QUOTE---")]
    candidates = [
        " ".join(c.split())
        for c in chunks
        if re.search(r"In\s+src/components/animator/sequences/", c, re.I)
    ]
    if candidates:
        return candidates

    # Format B: regex scan
    matches = re.findall(
        r"(In\s+src/components/animator/sequences/\S[^\"\']{40,})",
        text,
        re.DOTALL,
    )
    return [" ".join(m.split()) for m in matches]


# Phase 3: run Claude Code CLI for each prompt

def run_claude(prompt, index, total, dry_run):
    label = prompt[:110] + ("..." if len(prompt) > 110 else "")
    print("\n" + SEP)
    print("  [%d/%d]  %s" % (index, total, label))
    print(SEP)

    if dry_run:
        print("  [dry-run] skipping Claude Code invocation.")
        return

    subprocess.run(
        ["claude", "-p", prompt],
        cwd=str(PROJECT_DIR),
        check=False,
    )


# CLI entry-point

def parse_args():
    p = argparse.ArgumentParser(
        description="Gemini review -> Claude Code fix pipeline"
    )
    p.add_argument(
        "--url", default=DEFAULT_URL, metavar="URL",
        help="Gemini conversation URL (default: last CircuitMind review)",
    )
    p.add_argument(
        "--from-file", action="store_true",
        help="Skip browser; read from " + REVIEW_FILE.name,
    )
    p.add_argument(
        "--dry-run", action="store_true",
        help="Print extracted prompts without running Claude",
    )
    return p.parse_args()


def main():
    args = parse_args()

    # Load or fetch
    if args.from_file:
        if not REVIEW_FILE.exists():
            sys.exit(
                "Error: " + str(REVIEW_FILE) + " not found.\n"
                "Run without --from-file to fetch it first."
            )
        print("Reading saved review from", REVIEW_FILE.name, "...")
        text = REVIEW_FILE.read_text(encoding="utf-8")
    else:
        print(SEP)
        print("  Phase 1: Fetch Gemini response")
        print(SEP)
        text = fetch_response(args.url)
        REVIEW_FILE.write_text(text, encoding="utf-8")
        print("  Saved to", REVIEW_FILE.name)

    # Extract
    prompts = extract_prompts(text)

    if not prompts:
        print("\n[!] No Claude Code prompts found in the response.")
        print("    Inspect", REVIEW_FILE.name, "to see what Gemini returned.")
        return

    mode = "Phase 2 (dry-run)" if args.dry_run else "Phase 2"
    print("\n" + SEP)
    print("  %s: Apply %d fix(es) via Claude Code" % (mode, len(prompts)))
    print(SEP)

    for i, prompt in enumerate(prompts, 1):
        run_claude(prompt, i, len(prompts), dry_run=args.dry_run)
        if i < len(prompts) and not args.dry_run:
            time.sleep(2)

    status = "Listed" if args.dry_run else "Applied"
    print("\n[OK] %s %d fix(es)." % (status, len(prompts)))


if __name__ == "__main__":
    main()
