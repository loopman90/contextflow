import { Modal, Setting } from "obsidian";
import type { App } from "obsidian";
import type { CalendarEvent } from "../models";

export class CalendarEventModal extends Modal {
  private readonly onSave: (event: CalendarEvent) => void;
  private title = ""; private start = ""; private end = ""; private location = ""; private recurrence = "";
  constructor(app: App, onSave: (event: CalendarEvent) => void, existing?: CalendarEvent) { super(app); this.onSave = onSave; this.title = existing?.title ?? ""; this.start = existing?.start.slice(0, 16) ?? ""; this.end = existing?.end?.slice(0, 16) ?? ""; this.location = existing?.location ?? ""; this.recurrence = existing?.recurrence?.frequency ?? ""; }
  onOpen(): void { this.titleEl.setText("Afspraak"); const el = this.contentEl; el.empty(); new Setting(el).setName("Titel").addText((input) => input.setValue(this.title).onChange((value) => { this.title = value; })); new Setting(el).setName("Start").addText((input) => { input.inputEl.type = "datetime-local"; input.setValue(this.start).onChange((value) => { this.start = value; }); }); new Setting(el).setName("Einde").addText((input) => { input.inputEl.type = "datetime-local"; input.setValue(this.end).onChange((value) => { this.end = value; }); }); new Setting(el).setName("Locatie").addText((input) => input.setValue(this.location).onChange((value) => { this.location = value; })); new Setting(el).setName("Herhaling").addDropdown((input) => input.addOptions({ "": "Eenmalig", daily: "Dagelijks", weekly: "Wekelijks", monthly: "Maandelijks" }).setValue(this.recurrence).onChange((value) => { this.recurrence = value; })); new Setting(el).addButton((button) => button.setButtonText("Opslaan").setCta().onClick(() => { if (!this.title || !this.start) return; this.onSave({ id: `event-${Date.now()}`, title: this.title, start: new Date(this.start).toISOString(), end: this.end ? new Date(this.end).toISOString() : undefined, location: this.location, recurrence: this.recurrence ? { frequency: this.recurrence as "daily" | "weekly" | "monthly", interval: 1 } : undefined }); this.close(); })); }
  onClose(): void { this.contentEl.empty(); }
}
