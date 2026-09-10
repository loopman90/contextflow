import { Modal, Setting } from "obsidian";
import type { App } from "obsidian";
import type { CaptureDefinition, CaptureType } from "../models";

export interface CaptureInput { definition: CaptureDefinition; title: string; body: string; tags: string; targetPath: string; }

export class QuickCaptureModal extends Modal {
  private readonly definitions: CaptureDefinition[]; private readonly onSubmit: (input: CaptureInput) => void; private definition!: CaptureDefinition; private title = ""; private body = ""; private tags = ""; private targetPath = "";
  constructor(app: App, definitions: CaptureDefinition[], onSubmit: (input: CaptureInput) => void) { super(app); this.definitions = definitions; this.onSubmit = onSubmit; this.definition = definitions[0] ?? { id: "note", name: "Quick note", type: "note", position: "bottom", template: "{{body}}", enabled: true }; }
  onOpen(): void { this.titleEl.setText("Quick Capture"); this.render(); }
  onClose(): void { this.contentEl.empty(); }
  private render(): void { const el = this.contentEl; el.empty(); new Setting(el).setName("Capture type").addDropdown((dropdown) => dropdown.addOptions(Object.fromEntries(this.definitions.map((item) => [item.id, item.name]))).setValue(this.definition.id).onChange((value) => { this.definition = this.definitions.find((item) => item.id === value) ?? this.definition; this.targetPath = this.definition.targetPath ?? ""; })); new Setting(el).setName("Title").addText((input) => input.onChange((value) => { this.title = value; })); new Setting(el).setName("Content").addTextArea((input) => input.onChange((value) => { this.body = value; })); new Setting(el).setName("Tags").setDesc("Optional, space-separated tags").addText((input) => input.onChange((value) => { this.tags = value; })); new Setting(el).setName("Target note").setDesc("Leave empty to use the configured target.").addText((input) => input.setValue(this.targetPath).onChange((value) => { this.targetPath = value; })); new Setting(el).addButton((button) => button.setButtonText("Cancel").onClick(() => this.close())).addButton((button) => button.setButtonText("Capture").setCta().onClick(() => { this.onSubmit({ definition: this.definition, title: this.title, body: this.body, tags: this.tags, targetPath: this.targetPath }); this.close(); })); }
}

export function defaultCaptures(): CaptureDefinition[] { const make = (id: string, name: string, type: CaptureType, template: string): CaptureDefinition => ({ id, name, type, position: "bottom", template, enabled: true }); return [make("note", "Quick note", "note", "- {{title}}: {{body}}"), make("task", "Task", "task", "- [ ] {{title}}: {{body}}"), make("idea", "Idea", "idea", "- 💡 {{title}}: {{body}}"), make("meeting", "Meeting", "meeting", "- 📅 {{title}}: {{body}}"), make("decision", "Decision", "decision", "- **Decision:** {{title}} — {{body}}"), make("log", "Log entry", "log", "- {{body}}")]; }
