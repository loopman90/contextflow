import { Modal, Notice, Setting } from "obsidian";
import type { App } from "obsidian";
import type { ActionCategory, CustomActionDefinition, SelectionBehavior } from "../models";
import { validateAction } from "../utils/validation";
import { renderTemplatePreview } from "./ActionPreview";

export class ActionEditorModal extends Modal {
  private readonly existing?: CustomActionDefinition;
  private readonly onSave: (action: CustomActionDefinition) => void;
  private name = "";
  private description = "";
  private template = "";
  private category: ActionCategory = "custom";
  private behavior: SelectionBehavior = "insert";
  constructor(app: App, onSave: (action: CustomActionDefinition) => void, existing?: CustomActionDefinition) { super(app); this.onSave = onSave; this.existing = existing; this.name = existing?.name ?? ""; this.description = existing?.description ?? ""; this.template = existing?.template ?? ""; this.category = existing?.category ?? "custom"; this.behavior = existing?.selectionBehavior ?? "insert"; }
  onOpen(): void {
    this.titleEl.setText(this.existing ? "Edit action" : "New action");
    const el = this.contentEl; el.empty();
    new Setting(el).setName("Name").addText((input) => input.setValue(this.name).onChange((value) => { this.name = value; }));
    new Setting(el).setName("Description").addText((input) => input.setValue(this.description).onChange((value) => { this.description = value; }));
    new Setting(el).setName("Content or template").setDesc("For example {{date}}, {{selection}} or {{input:project}}.").addTextArea((input) => input.setValue(this.template).onChange((value) => { this.template = value; preview(); }));
    const previewEl = el.createDiv({ cls: "contextflow-live-preview" }); const preview = () => renderTemplatePreview(previewEl, this.template); preview();
    new Setting(el).setName("Selection behavior").addDropdown((dropdown) => dropdown.addOptions({ insert: "Insert", replace: "Replace", before: "Before selection", after: "After selection", wrap: "Wrap" }).setValue(this.behavior).onChange((value) => { this.behavior = value as SelectionBehavior; }));
    new Setting(el).setName("Save").addButton((button) => button.setButtonText("Save").setCta().onClick(() => this.save()));
  }
  onClose(): void { this.contentEl.empty(); }
  private save(): void {
    const action: CustomActionDefinition = { id: this.existing?.id ?? `custom-${Date.now()}`, name: this.name.trim(), description: this.description.trim(), icon: "zap", category: this.category, keywords: [], template: this.template, enabled: true, favorite: false, order: this.existing?.order ?? 1000, selectionBehavior: this.behavior, inputs: [], conditions: {} };
    const errors = validateAction(action); if (errors.length) { new Notice(errors[0]); return; }
    this.onSave(action); this.close();
  }
}
