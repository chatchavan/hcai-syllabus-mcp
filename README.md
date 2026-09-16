# hcai-syllabus-mcp

An LM Studio plugin exposing the HCAI course syllabus to an LLM as tools.
For in-class demo only. The content of the syllabus here is **not up-to-date**

## Install (one click)

**[chatchavan/hcai-syllabus on LM Studio Hub](https://lmstudio.ai/chatchavan/hcai-syllabus)**
— open that page and click its "Add to LM Studio" button.


## Install (from source, no Hub)

```bash
git clone https://github.com/chatchavan/hcai-syllabus-mcp.git
cd hcai-syllabus-mcp
lms dev --install -y
```


`lms` is the CLI that [LM Studio itself installs](https://lmstudio.ai/docs/cli) and puts on your `PATH` — it
ships with the app. If `lms: command not found`,
your LM Studio install hasn't registered it on `PATH` yet; either use the
full path directly (macOS/Linux: `~/.lmstudio/bin/lms`; Windows:
`%USERPROFILE%\.lmstudio\bin\lms.exe`), or open LM Studio Settings in the General tab 
and look for its App home directory.

## Tools

- `list_sections()` — the syllabus's top-level section titles, in order.
- `search_text(query, max_results=5)` — case-insensitive full-text search,
  returning matching passages tagged with their section.
- `lookup_week(week_number)` — the semester-plan session line(s) for a given
  week number (a week is usually two calendar sessions).
- `lookup_deadlines(track?)` — all project and/or assignment milestones,
  each tagged with its date and week number; `track` filters to `"project"`
  or `"assignment"`, or omit it for both.

