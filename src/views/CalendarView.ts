import { ItemView, MarkdownView, WorkspaceLeaf, setIcon } from "obsidian";
import type ContextFlowPlugin from "../main";
import { CalendarEventModal } from "../ui/CalendarEventModal";
import { eventsToIcs, parseIcs } from "../services/calendar";

export const CALENDAR_VIEW_TYPE = "contextflow-calendar";

export class CalendarView extends ItemView {
  private readonly plugin: ContextFlowPlugin;
  private month = new Date();
  constructor(leaf: WorkspaceLeaf, plugin: ContextFlowPlugin) { super(leaf); this.plugin = plugin; }
  getViewType(): string { return CALENDAR_VIEW_TYPE; }
  getDisplayText(): string { return "ContextFlow kalender"; }
  getIcon(): string { return "calendar-days"; }
  async onOpen(): Promise<void> { this.render(); }
  async onClose(): Promise<void> { this.contentEl.empty(); }
  private render(): void {
    const root = this.contentEl; root.empty(); root.addClass("contextflow-calendar");
    const header = root.createDiv({ cls: "contextflow-calendar-header" });
    const previous = header.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "Vorige maand" } }); setIcon(previous, "chevron-left"); previous.addEventListener("click", () => { this.month.setMonth(this.month.getMonth() - 1); this.render(); });
    header.createEl("h2", { text: this.month.toLocaleDateString(this.plugin.settings.locale, { month: "long", year: "numeric" }) });
    const next = header.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "Volgende maand" } }); setIcon(next, "chevron-right"); next.addEventListener("click", () => { this.month.setMonth(this.month.getMonth() + 1); this.render(); });
    const add = header.createEl("button", { text: "Nieuwe afspraak" }); add.addEventListener("click", () => new CalendarEventModal(this.app, (event) => { this.plugin.settings.calendarEvents.push(event); void this.plugin.saveSettings(); this.render(); }).open());
    const exportButton = header.createEl("button", { text: "ICS export" }); exportButton.addEventListener("click", () => { const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([eventsToIcs(this.plugin.settings.calendarEvents)], { type: "text/calendar" })); link.download = "contextflow-calendar.ics"; link.click(); URL.revokeObjectURL(link.href); });
    const importButton = header.createEl("button", { text: "ICS import" }); importButton.addEventListener("click", () => { const input = document.createElement("input"); input.type = "file"; input.accept = ".ics,text/calendar"; input.addEventListener("change", () => { const file = input.files?.[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener("load", () => { if (typeof reader.result === "string") { this.plugin.settings.calendarEvents.push(...parseIcs(reader.result)); void this.plugin.saveSettings(); this.render(); } }); reader.readAsText(file); }); input.click(); });
    const grid = root.createDiv({ cls: "contextflow-calendar-grid" });
    for (const label of ["ma", "di", "wo", "do", "vr", "za", "zo"]) grid.createDiv({ cls: "contextflow-calendar-weekday", text: label });
    const first = new Date(this.month.getFullYear(), this.month.getMonth(), 1); const offset = (first.getDay() + 6) % 7; const days = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 0).getDate();
    for (let i = 0; i < offset; i++) grid.createDiv({ cls: "contextflow-calendar-day is-empty" });
    for (let day = 1; day <= days; day++) { const cell = grid.createDiv({ cls: "contextflow-calendar-day" }); cell.setAttr("tabindex", "0"); cell.createSpan({ text: String(day) }); const dateKey = new Date(this.month.getFullYear(), this.month.getMonth(), day).toISOString().slice(0, 10); this.plugin.settings.calendarEvents.filter((event) => event.start.slice(0, 10) === dateKey).forEach((event) => { const chip = cell.createDiv({ cls: "contextflow-calendar-event", text: event.title, attr: { draggable: "true" } }); chip.addEventListener("dragstart", (drag) => drag.dataTransfer?.setData("text/plain", event.id)); }); cell.addEventListener("dragover", (event) => event.preventDefault()); cell.addEventListener("drop", (event) => { event.preventDefault(); const id = event.dataTransfer?.getData("text/plain"); const item = this.plugin.settings.calendarEvents.find((candidate) => candidate.id === id); if (item) { const original = new Date(item.start); original.setFullYear(this.month.getFullYear(), this.month.getMonth(), day); item.start = original.toISOString(); void this.plugin.saveSettings(); this.render(); } }); cell.addEventListener("click", () => this.insertDate(day)); }
    root.createEl("p", { cls: "setting-item-description", text: "Lokale kalenderlaag: klik op een dag om de datum in de actieve notitie te plaatsen. Externe agenda-synchronisatie is niet actief." });
  }
  private insertDate(day: number): void { const date = new Date(this.month.getFullYear(), this.month.getMonth(), day); const value = `${String(day).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`; const view = this.app.workspace.getActiveViewOfType(MarkdownView); if (view) view.editor.replaceSelection(value); }
}
