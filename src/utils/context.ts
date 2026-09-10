import type { CodeMirrorEditor } from "../models";

export interface EditorContext {
  hasSelection: boolean;
  onTask: boolean;
  onList: boolean;
  inCodeBlock: boolean;
}

export function getEditorContext(editor: CodeMirrorEditor): EditorContext {
  const cursor = editor.getCursor();
  const line = editor.getLine(cursor.line);
  const before = Array.from({ length: cursor.line + 1 }, (_, index) => editor.getLine(index)).join("\n");
  const fences = (before.match(/^\s*```/gm) ?? []).length;
  return {
    hasSelection: editor.somethingSelected(),
    onTask: /^\s*- \[[ xX]\]\s/.test(line),
    onList: /^\s*(?:[-*+] |\d+[.)] )/.test(line),
    inCodeBlock: fences % 2 === 1
  };
}
