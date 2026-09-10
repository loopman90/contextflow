import { Modal, Setting } from "obsidian";
import type { App } from "obsidian";

export class DatePickerModal extends Modal {
  private readonly onPick: (value: string) => void;
  constructor(app: App, onPick: (value: string) => void) { super(app); this.onPick = onPick; }
  onOpen(): void {
    this.titleEl.setText("Datumkiezer"); const el = this.contentEl; el.empty();
    const input = el.createEl("input", { type: "date", cls: "contextflow-date-input" });
    new Setting(el).setName("Snelle keuze").addButton((button) => button.setButtonText("Gisteren").onClick(() => this.pick(-1))).addButton((button) => button.setButtonText("Vandaag").onClick(() => this.pick(0))).addButton((button) => button.setButtonText("Morgen").onClick(() => this.pick(1))).addButton((button) => button.setButtonText("Over een week").onClick(() => this.pick(7)));
    new Setting(el).setName("Gebruik datum").addButton((button) => button.setButtonText("Invoegen").setCta().onClick(() => { if (input.value) { this.onPick(input.value); this.close(); } }));
  }
  onClose(): void { this.contentEl.empty(); }
  private pick(offset: number): void { const date = new Date(); date.setDate(date.getDate() + offset); this.onPick(`${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`); this.close(); }
}
