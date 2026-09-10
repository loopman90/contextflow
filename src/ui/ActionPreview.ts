import type { ActionInputField } from "../models";

export function renderTemplatePreview(container: HTMLElement, template: string, fields: ActionInputField[] = []): void {
  container.empty();
  const sample: Record<string, string> = { date: "2026-09-10", time: "10:30", datetime: "2026-09-10 10:30", title: "Example note", filename: "Example note", filepath: "Example note.md", folder: "Projects", selection: "Example selected text", clipboard: "Example clipboard text", cursor: "|" };
  fields.forEach((field) => { sample[`input:${field.variable}`] = field.defaultValue || `Example ${field.label.toLowerCase()}`; });
  const unknown: string[] = [];
  const rendered = template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, key: string) => { if (sample[key] !== undefined) return sample[key]; unknown.push(key); return match; });
  container.createEl("pre", { cls: "contextflow-preview-code", text: rendered || "(Nothing to preview yet)" });
  if (unknown.length) container.createDiv({ cls: "contextflow-preview-error", text: `Unknown variable(s): ${[...new Set(unknown)].join(", ")}` });
  else container.createDiv({ cls: "contextflow-preview-ok", text: "Preview only — no files will be changed." });
}
