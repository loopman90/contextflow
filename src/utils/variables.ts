import type { ActionContext } from "../models";

export interface VariableResult { text: string; unknown: string[]; }

export function resolveVariables(template: string, context: ActionContext, values: Record<string, string> = {}, now = new Date()): VariableResult {
  const date = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const known: Record<string, string> = {
    date,
    time,
    datetime: `${date} ${time}`,
    title: context.fileName,
    filename: context.fileName,
    filepath: context.filePath,
    folder: context.folder,
    selection: context.selection,
    cursor: ""
  };
  const unknown = new Set<string>();
  const text = template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, key: string) => {
    if (key === "clipboard") return values.clipboard ?? match;
    if (key.startsWith("input:")) return values[key.slice(6)] ?? match;
    if (Object.prototype.hasOwnProperty.call(known, key)) return known[key];
    unknown.add(key);
    return match;
  });
  return { text, unknown: [...unknown] };
}
