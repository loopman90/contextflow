import { Modal, setIcon } from "obsidian";
import type { App } from "obsidian";
import type { QuickAction } from "../models";
import { categoryLabel } from "../utils/actionFactory";
import { t } from "../i18n";

export class QuickInsertModal extends Modal {
  private readonly actions: QuickAction[];
  private readonly onChoose: (action: QuickAction) => void;
  private filtered: QuickAction[] = [];
  private selectedIndex = 0;
  private listEl!: HTMLElement;
  private inputEl!: HTMLInputElement;
  private readonly language: "en" | "nl";

  constructor(app: App, actions: QuickAction[], onChoose: (action: QuickAction) => void, language: "en" | "nl" = "en") {
    super(app);
    this.actions = actions;
    this.onChoose = onChoose;
    this.language = language;
  }

  onOpen(): void {
    this.modalEl.addClass("contextflow-modal");
    this.titleEl.setText(t("quickInsert", this.language));
    const content = this.contentEl;
    content.empty();
    const hint = content.createDiv({ cls: "contextflow-modal-hint" });
    hint.setText(t("useKeyboard", this.language));
    this.inputEl = content.createEl("input", { cls: "contextflow-search", attr: { type: "search", placeholder: t("searchActions", this.language), "aria-label": t("searchActions", this.language) } });
    this.listEl = content.createDiv({ cls: "contextflow-action-list", attr: { role: "listbox" } });
    this.inputEl.addEventListener("input", () => this.renderList());
    this.inputEl.addEventListener("keydown", (event) => this.handleKeydown(event));
    this.renderList();
    window.setTimeout(() => this.inputEl.focus(), 0);
  }

  onClose(): void { this.contentEl.empty(); }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === "ArrowDown") { event.preventDefault(); this.selectedIndex = Math.min(this.selectedIndex + 1, this.filtered.length - 1); this.renderList(); }
    else if (event.key === "ArrowUp") { event.preventDefault(); this.selectedIndex = Math.max(this.selectedIndex - 1, 0); this.renderList(); }
    else if (event.key === "Enter") { event.preventDefault(); const action = this.filtered[this.selectedIndex]; if (action) { this.close(); this.onChoose(action); } }
  }

  private renderList(): void {
    const query = this.inputEl?.value.trim().toLocaleLowerCase() ?? "";
    this.filtered = this.actions.filter((action) => !query || `${action.name} ${action.description} ${categoryLabel(action.category)}`.toLocaleLowerCase().includes(query));
    this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, this.filtered.length - 1));
    this.listEl.empty();
    if (this.filtered.length === 0) { this.listEl.createDiv({ cls: "contextflow-empty", text: t("noActions", this.language) }); return; }
    this.filtered.forEach((action, index) => {
      const row = this.listEl.createDiv({ cls: `contextflow-action-row${index === this.selectedIndex ? " is-selected" : ""}`, attr: { role: "option", tabindex: "0", "aria-selected": String(index === this.selectedIndex) } });
      const icon = row.createSpan({ cls: "contextflow-action-icon" });
      setIcon(icon, action.icon);
      const copy = row.createDiv({ cls: "contextflow-action-copy" });
      copy.createDiv({ cls: "contextflow-action-name", text: action.name });
      copy.createDiv({ cls: "contextflow-action-description", text: action.description });
      row.createSpan({ cls: "contextflow-action-category", text: categoryLabel(action.category) });
      row.addEventListener("mouseenter", () => { this.selectedIndex = index; this.renderList(); });
      row.addEventListener("click", () => { this.close(); this.onChoose(action); });
    });
  }
}
