import { Modal, Setting } from "obsidian";
import type { App } from "obsidian";
import type { ActionPackage } from "../models";

export class ImportPreviewModal extends Modal {
  private readonly pack: ActionPackage;
  private readonly conflicts: string[];
  private readonly onConfirm: (overwrite: boolean) => void;
  constructor(app: App, pack: ActionPackage, conflicts: string[], onConfirm: (overwrite: boolean) => void) { super(app); this.pack = pack; this.conflicts = conflicts; this.onConfirm = onConfirm; }
  onOpen(): void { this.titleEl.setText("Actiepakket controleren"); const el = this.contentEl; el.empty(); el.createEl("p", { text: this.pack.description || "Controleer de inhoud voordat je importeert." }); el.createEl("ul", { text: "" }).append(...[`${this.pack.actions.length} acties`, `${this.pack.workflows.length} workflows`, `${this.conflicts.length} bestaande onderdelen met dezelfde ID`].map((text) => { const li = document.createElement("li"); li.textContent = text; return li; })); new Setting(el).setName("Importeren").addButton((button) => button.setButtonText("Annuleren").onClick(() => this.close())).addButton((button) => button.setButtonText(this.conflicts.length ? "Nieuwe onderdelen importeren" : "Bevestigen").setCta().onClick(() => { this.onConfirm(false); this.close(); })).addButton((button) => { button.setButtonText("Overschrijven"); button.setWarning(); button.onClick(() => { this.onConfirm(true); this.close(); }); }); }
  onClose(): void { this.contentEl.empty(); }
}
