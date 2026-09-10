import { Modal, Notice, Setting } from "obsidian";
import type { App } from "obsidian";
import type { ActionInputField } from "../models";

export class FormModal extends Modal {
  private readonly fields: ActionInputField[];
  private readonly onSubmit: (values: Record<string, string>) => void;
  private readonly values: Record<string, string> = {};
  constructor(app: App, fields: ActionInputField[], onSubmit: (values: Record<string, string>) => void) { super(app); this.fields = fields; this.onSubmit = onSubmit; }
  onOpen(): void {
    this.titleEl.setText("Enter values"); const el = this.contentEl; el.empty();
    for (const field of this.fields) {
      const setting = new Setting(el).setName(field.label).setDesc(field.description ?? "");
      if (field.type === "textarea") setting.addTextArea((input) => this.bind(field, input));
      else if (field.type === "select" || field.type === "multiselect") setting.addDropdown((input) => { input.addOptions(Object.fromEntries((field.options ?? []).map((option) => [option, option]))); input.setValue(field.defaultValue ?? ""); input.onChange((value) => { this.values[field.variable] = value; }); });
      else if (field.type === "toggle") setting.addToggle((input) => input.setValue(field.defaultValue === "true").onChange((value) => { this.values[field.variable] = String(value); }));
      else setting.addText((input) => { input.setPlaceholder(field.placeholder ?? ""); input.setValue(field.defaultValue ?? ""); if (field.type === "number") input.inputEl.type = "number"; if (field.type === "date") input.inputEl.type = "date"; if (field.type === "time") input.inputEl.type = "time"; if (field.type === "datetime") input.inputEl.type = "datetime-local"; if (field.type === "file") input.inputEl.type = "file"; this.bind(field, input); });
    }
    new Setting(el).addButton((button) => button.setButtonText("Cancel").onClick(() => this.close())).addButton((button) => button.setButtonText("Continue").setCta().onClick(() => this.submit()));
  }
  onClose(): void { this.contentEl.empty(); }
  private bind(field: ActionInputField, input: { onChange: (callback: (value: string) => unknown) => unknown; setValue: (value: string) => unknown }): void { input.onChange((value) => { this.values[field.variable] = value; }); }
  private submit(): void { const missing = this.fields.find((field) => field.required && !this.values[field.variable] && !field.defaultValue); if (missing) { new Notice(`Fill in '${missing.label}'.`); return; } this.onSubmit(this.values); this.close(); }
}
