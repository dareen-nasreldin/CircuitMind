"""
scripts/qa.py  -  CircuitMind visual QA pipeline
-------------------------------------------------
Run this when you are done with a development session and ready to commit.
It does the full loop automatically:

  1. Start Vite dev server
  2. Capture all 9 tutorial PDFs
  3. Stop dev server
  4. Open Gemini, upload PDFs, send review prompt
  5. Wait for Gemini to finish
  6. Extract fix prompts -> run each through Claude Code
  7. Print git diff summary so you can review before committing

Usage:
    python scripts/qa.py                    # full pipeline
    python scripts/qa.py --skip-capture     # reuse existing PDFs
    python scripts/qa.py --skip-gemini      # reuse gemini_review.txt
    python scripts/qa.py --dry-run          # show prompts, don't run Claude
"""

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path

PROJECT_DIR    = Path(__file__).parent.parent
CAPTURE_SCRIPT = PROJECT_DIR / "scripts" / "capture_tutorials.py"
GEMINI_SCRIPT  = PROJECT_DIR / "scripts" / "gemini_to_claude.py"
REVIEW_FILE    = PROJECT_DIR / "gemini_review.txt"
PDF_DIR        = PROJECT_DIR / "tutorial-pdfs"

TUTORIAL_PDFS = sorted(PDF_DIR.glob("*.pdf"))

SEP = "-" * 72


def banner(msg):
    print("\n" + SEP)
    print("  " + msg)
    print(SEP)


# Step 1+2: start dev server, capture PDFs, stop server

def capture_pdfs():
    banner("Phase 1 - Capturing tutorial PDFs")

    vite = subprocess.Popen(
        "npm run dev",
        cwd=str(PROJECT_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        shell=True,
    )

    port = 5173
    for line in vite.stdout:
        sys.stdout.write("  " + line)
        sys.stdout.flush()
        if "localhost:" in line:
            try:
                port = int(line.split("localhost:")[1].split("/")[0].strip())
            except ValueError:
                pass
            break

    time.sleep(1)

    try:
        env = {**os.environ, "BASE_URL": "http://localhost:%d" % port}
        subprocess.run(
            [sys.executable, str(CAPTURE_SCRIPT)],
            cwd=str(PROJECT_DIR),
            env=env,
            check=True,
        )
    finally:
        vite.terminate()
        try:
            vite.wait(timeout=5)
        except subprocess.TimeoutExpired:
            vite.kill()

    print("\n  [OK] PDFs saved to tutorial-pdfs/")


# Step 3: upload to Gemini, wait, fetch response

def run_gemini_review():
    banner("Phase 2 - Gemini visual review")

    from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

    PROFILE_DIR = Path.home() / ".claude" / "playwright-gemini"
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)

    prompt_text = (
        "I've attached 9 PDFs -- one per tutorial -- from a circuit learning web app "
        "built with React + Vite + Tailwind. Each PDF is one tutorial; each page is "
        "one animation step. Diagrams are SVG in a dark UI (#0a0f1e, cyan #00d4ff). "
        "Formulas use KaTeX.\n\n"
        "Tutorials: 01-ohmsLaw, 02-series, 03-parallel, 04-voltageDivider, "
        "05-kvl, 06-kcl, 07-superposition, 08-thevenin, 09-norton\n\n"
        "Review every step of every tutorial for:\n"
        "1. Wrong or incomplete circuit diagrams\n"
        "2. Missing/incorrect labels, formulas, or values\n"
        "3. Steps that look identical to the previous step\n"
        "4. Unfinished animation hints\n"
        "5. Explanation text that doesn't match the diagram\n"
        "6. Anything that would confuse a student\n\n"
        "For each issue give: tutorial name, step number, what's wrong, what it "
        "should show, and a ready-to-paste Claude Code prompt like:\n\n"
        "\"In src/components/animator/sequences/[file].js, Step [N] has [problem]. "
        "Fix it so that [expected]. The sequence uses manual steps and a layout "
        "object. Only change what is needed -- do not refactor other steps.\""
    )

    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            headless=False,
            slow_mo=40,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-first-run",
                "--no-default-browser-check",
            ],
            ignore_default_args=["--enable-automation"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.set_viewport_size({"width": 1280, "height": 900})
        page.goto("https://gemini.google.com/app", wait_until="domcontentloaded",
                  timeout=30_000)
        time.sleep(2)

        # "Upload & tools" only exists when logged in; guest page only has "+" and "Tools"
        upload_btn = page.get_by_role("button", name="Upload & tools")
        try:
            upload_btn.wait_for(state="visible", timeout=5_000)
        except Exception:
            print("  [!] Not logged in (guest mode). Please click Sign in in the")
            print("      browser window and complete Google login.")
            print("      Waiting up to 3 minutes...")
            upload_btn.wait_for(state="visible", timeout=180_000)
            time.sleep(1)

        print("  Logged in. Opening upload menu...")
        upload_btn.click()
        page.locator('[data-test-id="local-images-files-uploader-button"]').click()
        page.locator("input[type='file']").set_input_files(
            [str(p) for p in TUTORIAL_PDFS]
        )
        time.sleep(3)

        page.get_by_role("textbox", name="Enter a prompt for Gemini").fill(prompt_text)
        page.get_by_role("button", name="Send message").click()

        print("  Waiting for Gemini to finish analysing...")
        try:
            page.wait_for_selector("button[aria-label='Stop response']", timeout=10_000)
        except PWTimeout:
            pass
        page.wait_for_selector(
            "button[aria-label='Stop response']", state="detached", timeout=300_000
        )
        print("  Response complete.")

        conv_url = page.url
        quotes = page.locator("blockquote").all_inner_texts()
        if not quotes:
            els = page.locator("[data-message-author-role='model']").all()
            quotes = [el.inner_text() for el in els]
        ctx.close()

    text = "\n\n---QUOTE---\n\n".join(quotes)
    REVIEW_FILE.write_text(text, encoding="utf-8")
    print("  [OK] Review saved to", REVIEW_FILE.name)
    print("  Conversation:", conv_url)


# Step 4: apply fixes via Claude Code

def apply_fixes(dry_run):
    banner("Phase 3 - Applying fixes via Claude Code")
    cmd = [sys.executable, str(GEMINI_SCRIPT), "--from-file"]
    if dry_run:
        cmd.append("--dry-run")
    subprocess.run(cmd, cwd=str(PROJECT_DIR), check=False)


# Step 5: show git diff summary

def show_diff():
    banner("Phase 4 - Git diff summary (review before committing)")
    result = subprocess.run(
        ["git", "diff", "--stat"],
        cwd=str(PROJECT_DIR),
        capture_output=True,
        text=True,
    )
    if result.stdout.strip():
        print(result.stdout)
    else:
        print("  No changes detected.")
    print("  Run 'git diff' for the full diff, then 'git commit' when happy.")


# Main

def parse_args():
    p = argparse.ArgumentParser(description="CircuitMind visual QA pipeline")
    p.add_argument("--skip-capture", action="store_true",
                   help="Skip PDF capture (reuse existing PDFs)")
    p.add_argument("--skip-gemini", action="store_true",
                   help="Skip Gemini upload/review (reuse gemini_review.txt)")
    p.add_argument("--dry-run", action="store_true",
                   help="Print extracted prompts, don't run Claude")
    return p.parse_args()


def main():
    args = parse_args()

    if not args.skip_capture:
        capture_pdfs()

    if not args.skip_gemini:
        run_gemini_review()
    else:
        if not REVIEW_FILE.exists():
            sys.exit("Error: gemini_review.txt not found. Run without --skip-gemini first.")
        print("  Skipping Gemini -- using saved", REVIEW_FILE.name)

    apply_fixes(dry_run=args.dry_run)
    show_diff()


if __name__ == "__main__":
    main()
