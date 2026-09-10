export type ActionId = string;

export type ActionCategory = "date-time" | "tasks" | "formatting" | "notes" | "templates" | "custom";

export type InputFieldType = "text" | "textarea" | "number" | "date" | "time" | "datetime" | "select" | "multiselect" | "toggle" | "file" | "tag";

export interface ActionInputField {
  id: string;
  type: InputFieldType;
  label: string;
  description?: string;
  required: boolean;
  defaultValue?: string;
  placeholder?: string;
  options?: string[];
  variable: string;
  pattern?: string;
}

export type SelectionBehavior = "insert" | "replace" | "before" | "after" | "wrap";

export interface CustomActionDefinition {
  id: ActionId;
  name: string;
  description: string;
  icon: string;
  category: ActionCategory;
  keywords: string[];
  template: string;
  enabled: boolean;
  favorite: boolean;
  order: number;
  selectionBehavior: SelectionBehavior;
  wrapBefore?: string;
  wrapAfter?: string;
  inputs: ActionInputField[];
  conditions: ActionConditions;
}

export interface ActionConditions {
  requiresSelection?: boolean;
  requiresNoSelection?: boolean;
  folder?: string;
  tag?: string;
  dailyNoteOnly?: boolean;
  taskOnly?: boolean;
  desktopOnly?: boolean;
  property?: { key: string; value?: string };
}

export interface WorkflowStep {
  id: string;
  actionId: string;
  enabled: boolean;
  condition?: ActionConditions;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  favorite: boolean;
  order: number;
  previewBeforeRun: boolean;
  steps: WorkflowStep[];
}

export interface ActionPackage {
  schemaVersion: 1;
  name: string;
  author?: string;
  version: string;
  description?: string;
  actions: CustomActionDefinition[];
  workflows: WorkflowDefinition[];
  categories?: Array<{ id: string; name: string; icon?: string; color?: string; order: number }>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  location?: string;
  description?: string;
  notePath?: string;
  category?: string;
  recurrence?: { frequency: "daily" | "weekly" | "monthly"; interval: number; until?: string };
}

export type CaptureType = "note" | "task" | "idea" | "meeting" | "decision" | "log" | "custom";

export interface CaptureDefinition { id: string; name: string; type: CaptureType; targetPath?: string; targetFolder?: string; heading?: string; position: "top" | "bottom" | "heading" | "daily"; template: string; enabled: boolean; }

export interface ActionHistoryEntry { id: string; actionId: string; actionName: string; type: "action" | "workflow" | "capture"; timestamp: string; fileName?: string; status: "success" | "failed"; undoAvailable: boolean; }

export interface ActionProfile { id: string; name: string; enabledActionIds: string[]; enabledWorkflowIds: string[]; enabledCaptureIds: string[]; order: number; }
export interface TextAbbreviation { id: string; trigger: string; actionId: string; confirmation: boolean; caseSensitive: boolean; folders?: string[]; enabled: boolean; }

export interface QuickAction {
  id: ActionId;
  name: string;
  description: string;
  icon: string;
  category: ActionCategory;
  enabled: boolean;
  favorite: boolean;
  order: number;
  requiresSelection?: boolean;
  handler: ActionHandler;
}

export type ActionHandler = (context: ActionContext) => ActionResult;

export interface ActionContext {
  editor: CodeMirrorEditor;
  filePath: string;
  fileName: string;
  folder: string;
  selection: string;
  cursorLine: string;
}

export interface ActionResult {
  message: string;
  replacement?: { from: number; to: number; text: string };
  insertText?: string;
  selectInsertedText?: boolean;
}

export interface CodeMirrorEditor {
  getSelection(): string;
  replaceSelection(text: string): void;
  somethingSelected(): boolean;
  getCursor(): { line: number; ch: number };
  setCursor(pos: { line: number; ch: number }): void;
  getLine(line: number): string;
  lastLine(): number;
  lineCount?(): number;
  replaceRange(text: string, from: { line: number; ch: number }, to?: { line: number; ch: number }): void;
}

export interface ContextFlowSettings {
  actions: Array<Pick<QuickAction, "id" | "enabled" | "favorite" | "order">>;
  recentActionIds: string[];
  maxRecentActions: number;
  showContextualActions: boolean;
  showDisabledActions: boolean;
  mobileToolbar: boolean;
  customActions: CustomActionDefinition[];
  workflows: WorkflowDefinition[];
  categories: Array<{ id: string; name: string; icon?: string; color?: string; order: number }>;
  dateFormat: "DD-MM-YYYY" | "YYYY-MM-DD" | "DD/MM/YYYY" | "D MMMM YYYY" | "dddd D MMMM YYYY";
  timeFormat: "24" | "12";
  locale: "nl-NL" | "en-US";
  calendarEnabled: boolean;
  calendarEvents: CalendarEvent[];
  slashMenuEnabled: boolean;
  slashTrigger: string;
  slashShowFavorites: boolean;
  slashMaxResults: number;
  language: "en" | "nl";
  captures: CaptureDefinition[];
  profiles: ActionProfile[];
  activeProfileId?: string;
  history: ActionHistoryEntry[];
  historyEnabled: boolean;
  maxHistoryItems: number;
  abbreviations: TextAbbreviation[];
  debugLogging: boolean;
  onboardingCompleted: boolean;
  profilePriority: "folder-tag-property" | "property-tag-folder";
}

export const DEFAULT_SETTINGS: ContextFlowSettings = {
  actions: [],
  recentActionIds: [],
  maxRecentActions: 8,
  showContextualActions: true,
  showDisabledActions: false,
  mobileToolbar: true,
  customActions: [],
  workflows: [],
  categories: [],
  dateFormat: "DD-MM-YYYY",
  timeFormat: "24",
  locale: "nl-NL",
  calendarEnabled: false,
  calendarEvents: [],
  slashMenuEnabled: true,
  slashTrigger: "/",
  slashShowFavorites: true,
  slashMaxResults: 12
  ,language: "en",
  captures: [],
  profiles: [],
  activeProfileId: undefined,
  history: [],
  historyEnabled: true,
  maxHistoryItems: 50,
  abbreviations: [],
  debugLogging: false,
  onboardingCompleted: false,
  profilePriority: "folder-tag-property"
};
