import { tool, type Tool, type ToolsProviderController } from "@lmstudio/sdk";
import { z } from "zod";
import { listSections, lookupDeadlines, lookupWeek, searchText } from "./syllabusTools";

export async function toolsProvider(_ctl: ToolsProviderController) {
  const tools: Tool[] = [];

  tools.push(
    tool({
      name: "list_sections",
      description:
        "List the syllabus's top-level sections (e.g. Course description, " +
        "Semester plan, Assessments, Policies), in document order. Only use " +
        "this if you need an overview of the syllabus's structure - for a " +
        "specific fact or date, call search_text directly instead.",
      parameters: {},
      implementation: async () => listSections(),
    }),
  );

  tools.push(
    tool({
      name: "search_text",
      description:
        "Case-insensitive full-text search across the whole syllabus (grading " +
        "policy, exam format, deadlines, etc.). Use a short keyword (e.g. " +
        "'fairness'), not a full phrase like 'fairness lecture' - a full " +
        "phrase won't match unless it appears verbatim. Returns up to " +
        "max_results matching passages, each tagged with the section it was " +
        "found in, in document order - raise max_results if the first hits " +
        "aren't the ones you need.",
      parameters: {
        query: z.string(),
        max_results: z.number().optional(),
      },
      implementation: async ({ query, max_results }) => searchText(query, max_results ?? 5),
    }),
  );

  tools.push(
    tool({
      name: "lookup_week",
      description:
        "Look up a specific week of the semester plan by its week number " +
        "(1-15). Only use this if you already know the week number - " +
        "otherwise use search_text. Returns that week's calendar session(s) " +
        "— usually two, a Wednesday and a Thursday — including the lecture " +
        "topic and any project or assignment milestone due that week. " +
        "Returns an empty list if the week number doesn't exist.",
      parameters: {
        week_number: z.number(),
      },
      implementation: async ({ week_number }) => lookupWeek(week_number),
    }),
  );

  tools.push(
    tool({
      name: "lookup_deadlines",
      description:
        "List all project and/or assignment milestones from the semester " +
        "plan, each tagged with its calendar date and week number — e.g. " +
        "'Week 5 — Thu. Oct 15 — Assignment: Due: Design analysis draft.'. " +
        "Set track to 'project' or 'assignment' to filter to just one; omit " +
        "it to get both. Use this for 'when is X due' or 'what deadlines are " +
        "coming up' questions instead of lookup_week or search_text.",
      parameters: {
        track: z.enum(["project", "assignment"]).optional(),
      },
      implementation: async ({ track }) => lookupDeadlines(track),
    }),
  );

  return tools;
}
