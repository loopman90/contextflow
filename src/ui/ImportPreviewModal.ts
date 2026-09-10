import { Modal, Setting } from "obsidian";
import type { App } from "obsidian";
import type { ActionPackage } from "../models";

export class ImportPreviewModal extends Modal {
  private readonly pack: ActionPackage;
  private readonly conflicts: string[];
  private readonly onConfirm: (overwrite: boolean) => void;
  constructor(app: App, pack: ActionPackage, conflicts: string[], onConfirm: (overwrite: boolean) => void) { super(app); this.pack = pack; this.conflicts = conflicts; this.onConfirm = onConfirm; }
  onOpen(): void { this.titleEl.setText("Review action package"); const el = this.contentEl; el.empty(); el.createEl("p", { text: this.pack.description || "Review the contents before importing." }); const list = el.createEl("ul"); [`${this.pack.actions.length} actions`, `${this.pack.workflows.length} workflows`, `${this.conflicts.length} existing ID conflicts`].forEach((text) => list.createEl("li", { text })); new Setting(el).setName("Import").addButton((button) => button.setButtonText("Cancel").onClick(() => this.close())).addButton((button) => button.setButtonText(this.conflicts.length ? "Import new items" : "Confirm").setCta().onClick(() => { this.onConfirm(false); this.close(); })).addButton((button) => { button.setButtonText("Overwrite"); button.setWarning(); button.onClick(() => { this.onConfirm(true); this.close(); }); }); }
  onClose(): void { this.contentEl.empty(); }
}
