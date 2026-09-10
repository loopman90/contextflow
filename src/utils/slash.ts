import type { CodeMirrorEditor } from "../models";

export interface SlashQuery { query: string; from: number; to: number; }

export function getSlashQuery(editor: CodeMirrorEditor, trigger = "/"): SlashQuery | null {
  const cursor = editor.getCursor(); const line = editor.getLine(cursor.line); const before = line.slice(0, cursor.ch); const escaped = trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); const match = before.match(new RegExp(`(?:^|\\s)${escaped}([\\w-]*)$`));
  if (!match) return null;
  const slash = before.lastIndexOf(trigger); const prefix = before.slice(0, slash);
  if (/https?:\/\/[^\s]*$/.test(before) || /[\w.-]\/$/.test(prefix + "/")) return null;
  return { query: match[1], from: slash, to: cursor.ch };
}

export function removeSlashQuery(editor: CodeMirrorEditor, query: SlashQuery): void {
  const cursor = editor.getCursor(); editor.replaceRange("", { line: cursor.line, ch: query.from }, { line: cursor.line, ch: query.to });
}
