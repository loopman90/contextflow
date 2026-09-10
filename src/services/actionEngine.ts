import { Editor, MarkdownView, Notice, App } from "obsidian";
import type { ActionContext, QuickAction, ContextFlowSettings } from "../models";
import { FormModal } from "../ui/FormModal";
import { customActionToQuickAction } from "../utils/customAction";

export class ActionEngine {
  constructor(private readonly app: App, private readonly settings: ContextFlowSettings, private readonly save: () => Promise<void>, private readonly recordUsage: (id: string) => void) {}

  execute(action: QuickAction, editor: Editor, view: MarkdownView): void {
    if (!action.enabled) { new Notice("Deze actie is uitgeschakeld in Instellingen."); return; }
    const file = view.file; if (!file) { new Notice("Er is geen actieve Markdown-notitie."); return; }
    const context: ActionContext = { editor, filePath: file.path, fileName: file.basename, folder: file.parent?.path ?? "", selection: editor.getSelection(), cursorLine: editor.getLine(editor.getCursor().line) };
    const definition = this.settings.customActions.find((item) => item.id === action.id);
    if (definition?.inputs.length) { new FormModal(this.app, definition.inputs, (values) => this.execute(customActionToQuickAction(definition, values), editor, view)).open(); return; }
    try {
      const result = action.handler(context);
      if (result.replacement) editor.replaceSelection(result.replacement.text);
      else if (result.insertText) editor.replaceSelection(result.insertText);
      this.recordUsage(action.id); void this.save(); new Notice(result.message);
    } catch (error) { console.error("ContextFlow action failed", error); new Notice(`ContextFlow kon '${action.name}' niet uitvoeren.`); }
  }
}
