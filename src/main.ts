import { Editor, MarkdownView, Menu, Notice, Platform, Plugin } from "obsidian";
import { ContextFlowSettingTab } from "./settings/ContextFlowSettingTab";
import { QuickInsertModal } from "./ui/QuickInsertModal";
import type { ActionContext, ContextFlowSettings, QuickAction } from "./models";
import { DEFAULT_SETTINGS } from "./models";
import { createDefaultActions } from "./utils/actionFactory";
import { getEditorContext } from "./utils/context";
import { actionIsAvailable, mergeSettings } from "./services/actionStore";
import { customActionToQuickAction } from "./utils/customAction";
import { DatePickerModal } from "./ui/DatePickerModal";
import { FormModal } from "./ui/FormModal";
import { ImportPreviewModal } from "./ui/ImportPreviewModal";
import { ActionEngine } from "./services/actionEngine";
import { getSlashQuery, removeSlashQuery } from "./utils/slash";
import { SlashMenuModal } from "./ui/SlashMenuModal";
import { createPackage, mergePackage, parsePackage, serializePackage } from "./services/packageManager";
import { runWorkflow } from "./services/workflow";
import { CalendarView, CALENDAR_VIEW_TYPE } from "./views/CalendarView";
import { actionTranslations } from "./i18n";

export default class ContextFlowPlugin extends Plugin {
  settings: ContextFlowSettings = DEFAULT_SETTINGS;
  private readonly defaults = createDefaultActions();
  private actionEngine!: ActionEngine;
  private slashModal?: SlashMenuModal;

  async onload(): Promise<void> {
    await this.loadSettings();
    const en = this.settings.language === "en";
    this.actionEngine = new ActionEngine(this.app, this.settings, () => this.saveSettings(), (id) => this.recordUsage(id));
    this.addCommand({ id: "open-quick-insert", name: en ? "Open Quick Insert" : "Quick Insert openen", editorCallback: (editor) => { const view = this.activeMarkdownView(); if (view) this.openQuickInsert(editor, view); } });
    this.addCommand({ id: "insert-date", name: en ? "Insert date" : "Datum invoegen", editorCallback: (editor) => { const view = this.activeMarkdownView(); if (view) this.executeById("date", editor, view); } });
    this.addCommand({ id: "insert-time", name: en ? "Insert time" : "Tijd invoegen", editorCallback: (editor) => { const view = this.activeMarkdownView(); if (view) this.executeById("time", editor, view); } });
    this.addCommand({ id: "insert-datetime", name: en ? "Insert date and time" : "Datum en tijd invoegen", editorCallback: (editor) => { const view = this.activeMarkdownView(); if (view) this.executeById("datetime", editor, view); } });
    this.addCommand({ id: "insert-task", name: en ? "Insert task" : "Taak invoegen", editorCallback: (editor) => { const view = this.activeMarkdownView(); if (view) this.executeById("task", editor, view); } });
    this.addCommand({ id: "run-favorite", name: en ? "Run favorite Quick Insert action" : "Favoriete Quick Insert-actie uitvoeren", editorCallback: (editor) => { const view = this.activeMarkdownView(); if (view) this.openFavorite(editor, view); } });
    this.addCommand({ id: "open-date-picker", name: en ? "Open date picker" : "Datumkiezer openen", editorCallback: (editor) => { const view = this.activeMarkdownView(); if (view) new DatePickerModal(this.app, (value) => editor.replaceSelection(value)).open(); } });
    this.addSettingTab(new ContextFlowSettingTab(this));
    this.registerView(CALENDAR_VIEW_TYPE, (leaf) => new CalendarView(leaf, this));
    this.addCommand({ id: "open-calendar", name: "Lokale kalender openen", callback: () => { if (!this.settings.calendarEnabled) { new Notice("De optionele kalender staat uit in Instellingen."); return; } void this.app.workspace.getLeaf(true).setViewState({ type: CALENDAR_VIEW_TYPE, active: true }); } });
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor) => { const view = this.activeMarkdownView(); if (view) this.addEditorMenu(menu, editor, view); }));
    this.registerEvent(this.app.workspace.on("editor-change", (editor) => { const view = this.activeMarkdownView(); if (view) this.handleSlash(editor, view); }));
    this.addRibbonIcon("zap", "Quick Insert openen", () => { const view = this.app.workspace.getActiveViewOfType(MarkdownView); if (view) this.openQuickInsert(view.editor, view); else new Notice("Open eerst een Markdown-notitie."); });
  }

  async loadSettings(): Promise<void> { this.settings = mergeSettings(await this.loadData() as Partial<ContextFlowSettings> | null, this.defaults); }
  async saveSettings(): Promise<void> { await this.saveData(this.settings); }
  allActions(): QuickAction[] {
    const builtIns = this.defaults.map((action) => { const setting = this.settings.actions.find((item) => item.id === action.id); const localized = actionTranslations[action.id]?.[this.settings.language]; return { ...action, name: localized?.[0] ?? action.name, description: localized?.[1] ?? action.description, enabled: setting?.enabled ?? action.enabled, favorite: setting?.favorite ?? action.favorite, order: setting?.order ?? action.order }; });
    const custom = this.settings.customActions.filter((action) => action.enabled || this.settings.showDisabledActions).map((action) => customActionToQuickAction(action));
    const workflows = this.settings.workflows.filter((workflow) => workflow.enabled || this.settings.showDisabledActions).map((workflow) => ({ id: `workflow:${workflow.id}`, name: workflow.name, description: workflow.description, icon: workflow.icon, category: "templates" as const, enabled: workflow.enabled, favorite: workflow.favorite, order: workflow.order, handler: () => ({ message: `${workflow.name} uitgevoerd` }) }));
    return [...builtIns, ...custom, ...workflows];
  }
  setActionEnabled(id: string, enabled: boolean): void { const setting = this.settings.actions.find((item) => item.id === id); if (setting) setting.enabled = enabled; const custom = this.settings.customActions.find((item) => item.id === id); if (custom) custom.enabled = enabled; }
  setActionFavorite(id: string, favorite: boolean): void { const setting = this.settings.actions.find((item) => item.id === id); if (setting) setting.favorite = favorite; const custom = this.settings.customActions.find((item) => item.id === id); if (custom) custom.favorite = favorite; }
  exportActionPackage(): void {
    const text = serializePackage(createPackage("ContextFlow actiepakket", this.settings.customActions, this.settings.workflows));
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([text], { type: "application/json" })); link.download = "contextflow-action-package.json"; link.click(); URL.revokeObjectURL(link.href); new Notice("Actiepakket geëxporteerd.");
  }
  async importActionPackage(text: string): Promise<void> {
    const parsed = parsePackage(text); if (!parsed.package) { new Notice(parsed.errors[0] ?? "Ongeldig actiepakket."); return; }
    const conflicts = parsed.package.actions.filter((action) => this.settings.customActions.some((existing) => existing.id === action.id)).map((action) => action.id);
    new ImportPreviewModal(this.app, parsed.package, conflicts, (overwrite) => { const result = mergePackage(this.settings.customActions, parsed.package?.actions ?? [], overwrite); this.settings.customActions = result.actions; this.settings.workflows = [...this.settings.workflows, ...(parsed.package?.workflows ?? []).filter((workflow) => overwrite || !this.settings.workflows.some((existing) => existing.id === workflow.id))]; void this.saveSettings(); new Notice(result.conflicts.length ? `Actiepakket geïmporteerd; ${result.conflicts.length} conflict(en) overgeslagen.` : "Actiepakket geïmporteerd."); }).open();
  }
  private activeMarkdownView(): MarkdownView | null { return this.app.workspace.getActiveViewOfType(MarkdownView); }

  private addEditorMenu(menu: Menu, editor: Editor, view: MarkdownView): void {
    menu.addItem((item) => item.setTitle("Quick Insert openen").setIcon("zap").onClick(() => this.openQuickInsert(editor, view)));
  }

  private openQuickInsert(editor: Editor, view: MarkdownView): void {
    const context = getEditorContext(editor);
    const actions = this.visibleActions(context.hasSelection, view).sort((a, b) => a.order - b.order);
    new QuickInsertModal(this.app, actions, (action) => this.execute(action, editor, view), this.settings.language).open();
  }

  private openFavorite(editor: Editor, view: MarkdownView): void {
    const favorite = this.visibleActions(editor.somethingSelected(), view).find((action) => action.favorite);
    if (favorite) this.execute(favorite, editor, view); else this.openQuickInsert(editor, view);
  }

  private visibleActions(hasSelection: boolean, view: MarkdownView): QuickAction[] {
    const actions = this.allActions().filter((action) => !this.settings.showContextualActions || actionIsAvailable(action, hasSelection, this.settings.showDisabledActions));
    const recent = new Map(this.settings.recentActionIds.map((id, index) => [id, index]));
    return actions.filter((action) => this.matchesContext(action, hasSelection, view)).sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
      return (recent.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (recent.get(b.id) ?? Number.MAX_SAFE_INTEGER) || a.order - b.order;
    });
  }

  private matchesContext(action: QuickAction, hasSelection: boolean, view: MarkdownView): boolean {
    const definition = this.settings.customActions.find((item) => item.id === action.id);
    if (!definition) return true;
    const conditions = definition.conditions; const file = view.file; if (!file) return false; const cache = this.app.metadataCache.getFileCache(file); const tags = (cache?.tags ?? []).map((tag) => tag.tag);
    if (conditions.requiresSelection && !hasSelection) return false;
    if (conditions.requiresNoSelection && hasSelection) return false;
    if (conditions.folder && !file.path.startsWith(conditions.folder)) return false;
    if (conditions.tag && !tags.includes(conditions.tag.startsWith("#") ? conditions.tag : `#${conditions.tag}`)) return false;
    if (conditions.property) { const value = cache?.frontmatter?.[conditions.property.key]; if (value === undefined || (conditions.property.value !== undefined && String(value) !== conditions.property.value)) return false; }
    if (conditions.dailyNoteOnly && !/^\d{4}[-_]\d{2}[-_]\d{2}/.test(file.basename)) return false;
    if (conditions.taskOnly && !/^\s*- \[[ xX]\]\s/.test(view.editor.getLine(view.editor.getCursor().line))) return false;
    if (conditions.desktopOnly && Platform.isMobile) return false;
    return true;
  }

  private executeById(id: string, editor: Editor, view: MarkdownView): void { const action = this.allActions().find((item) => item.id === id); if (action) this.execute(action, editor, view); }

  private execute(action: QuickAction, editor: Editor, view: MarkdownView): void {
    if (action.id.startsWith("workflow:")) { const file = view.file; if (!file) return; const context: ActionContext = { editor, filePath: file.path, fileName: file.basename, folder: file.parent?.path ?? "", selection: editor.getSelection(), cursorLine: editor.getLine(editor.getCursor().line) }; this.executeWorkflow(action.id.slice(9), context, editor); return; }
    this.actionEngine.execute(action, editor, view);
  }

  private handleSlash(editor: Editor, view: MarkdownView): void {
    if (!this.settings.slashMenuEnabled) return;
    const context = getEditorContext(editor); const line = editor.getLine(editor.getCursor().line); const cursor = editor.getCursor(); const before = line.slice(0, cursor.ch);
    const inFrontmatter = editor.getLine(0) === "---" && before.indexOf("---") < 0; const inlineCode = (before.match(/`/g) ?? []).length % 2 === 1;
    if (context.inCodeBlock || inFrontmatter || inlineCode) return;
    const query = getSlashQuery(editor, this.settings.slashTrigger);
    if (!query) { if (this.slashModal) { this.slashModal.close(); this.slashModal = undefined; } return; }
    const actions = this.visibleActions(context.hasSelection, view).slice(0, this.settings.slashMaxResults);
    if (!this.slashModal) { this.slashModal = new SlashMenuModal(this.app, actions, query.query, (action) => { const current = getSlashQuery(editor, this.settings.slashTrigger); if (current) removeSlashQuery(editor, current); this.execute(action, editor, view); }, () => { this.slashModal = undefined; }, this.settings.language); this.slashModal.open(); }
    else this.slashModal.update(query.query, actions);
  }

  private executeWorkflow(id: string, context: ActionContext, editor: Editor): void {
    const workflow = this.settings.workflows.find((item) => item.id === id); if (!workflow) return;
    const handlers = new Map(this.allActions().filter((action) => !action.id.startsWith("workflow:")).map((action) => [action.id, action.handler]));
    const run = runWorkflow(workflow, handlers, context); for (const result of run.results) { if (result.replacement) editor.replaceSelection(result.replacement.text); else if (result.insertText) editor.replaceSelection(result.insertText); }
    new Notice(run.failed ? `${workflow.name}: stap mislukt — ${run.failed.error}` : `${workflow.name} uitgevoerd`);
  }

  private recordUsage(id: string): void {
    this.settings.recentActionIds = [id, ...this.settings.recentActionIds.filter((item) => item !== id)].slice(0, this.settings.maxRecentActions);
  }
}
