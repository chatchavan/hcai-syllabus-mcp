/**
 * Pure syllabus-parsing logic, independent of the LM Studio SDK, so it can be
 * unit-tested with plain `node`. Ported from small-llm-demo's
 * mcp_server/server.py — same four operations, same parsing rules.
 */
import { SYLLABUS_MARKDOWN } from "./syllabusData";

const SECTION_RE = /^## (.+)$/gm;
const WEEK_LINE_RE = /^Week (\d+) — (.+)$/;
const WEEK_PREFIX_RE = /^Week (\d+) — /;
const LABEL_RE = /\*\*(.+?)\*\*/;
const MILESTONE_RE = /(Project|Assignment): (.+?)\.(?=\s|$)/g;

function loadSections(): Map<string, string> {
  const text = SYLLABUS_MARKDOWN;
  const matches = [...text.matchAll(SECTION_RE)];
  const sections = new Map<string, string>();
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const start = m.index! + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : text.length;
    sections.set(m[1].trim(), text.slice(start, end).trim());
  }
  return sections;
}

export function listSections(): string[] {
  return [...loadSections().keys()];
}

function chunks(section: string, body: string): string[] {
  if (section === "Semester plan") {
    return body
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }
  return body
    .split("\n\n")
    .map(p => p.split(/\s+/).filter(Boolean).join(" "))
    .filter(p => p.length > 0);
}

export function searchText(query: string, maxResults: number = 5): string[] {
  const queryLower = query.toLowerCase();
  const results: string[] = [];
  for (const [section, body] of loadSections()) {
    for (const chunk of chunks(section, body)) {
      if (chunk.toLowerCase().includes(queryLower)) {
        results.push(`[${section}] ${chunk}`);
        if (results.length >= maxResults) {
          return results;
        }
      }
    }
  }
  return results;
}

export function lookupWeek(weekNumber: number): string[] {
  const plan = loadSections().get("Semester plan") ?? "";
  return plan
    .split("\n")
    .filter(line => {
      const m = line.match(WEEK_LINE_RE);
      return m !== null && parseInt(m[1], 10) === weekNumber;
    });
}

export function lookupDeadlines(track?: string | null): string[] {
  const trackFilter = track ? track.trim().toLowerCase() : null;
  if (trackFilter !== null && trackFilter !== "project" && trackFilter !== "assignment") {
    throw new Error("track must be 'project', 'assignment', or omitted");
  }

  const plan = loadSections().get("Semester plan") ?? "";
  const results: string[] = [];
  for (const line of plan.split("\n")) {
    const weekMatch = line.match(WEEK_PREFIX_RE);
    const weekPrefix = weekMatch ? `Week ${weekMatch[1]} — ` : "";
    const labelMatch = line.match(LABEL_RE);
    const label = labelMatch ? labelMatch[1] : "?";
    for (const m of line.matchAll(MILESTONE_RE)) {
      const [, kind, text] = m;
      if (trackFilter && kind.toLowerCase() !== trackFilter) {
        continue;
      }
      results.push(`${weekPrefix}${label} — ${kind}: ${text}.`);
    }
  }
  return results;
}
