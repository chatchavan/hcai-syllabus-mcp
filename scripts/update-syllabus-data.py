#!/usr/bin/env python3
"""Regenerate src/syllabusData.ts from small-llm-demo's converted syllabus.

Run after regenerating file-for-rag/HCAI-HS26-Syllabus.md in the sibling
small-llm-demo repo (uv run python3 scripts/build_syllabus_markdown.py there).
"""

import json
from pathlib import Path

SOURCE = Path(
    "/Users/chat/local_git/small-llm-demo/file-for-rag/HCAI-HS26-Syllabus.md"
)
OUTPUT = Path(__file__).resolve().parent.parent / "src" / "syllabusData.ts"


def main() -> None:
    content = SOURCE.read_text(encoding="utf-8")
    ts = (
        "// Auto-generated from small-llm-demo's file-for-rag/HCAI-HS26-Syllabus.md.\n"
        "// Regenerate with scripts/update-syllabus-data.py after the source changes.\n\n"
        f"export const SYLLABUS_MARKDOWN: string = {json.dumps(content)};\n"
    )
    OUTPUT.write_text(ts, encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
