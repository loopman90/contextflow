import { Modal, Notice, Setting, setIcon } from "obsidian";
import type { App } from "obsidian";
import type { QuickAction, WorkflowDefinition, WorkflowStep } from "../models";
import { validateWorkflow } from "../utils/validation";

export class WorkflowEditorModal extends Modal {
  private name = "";
  private steps: WorkflowStep[] = [];
  private readonly actions: QuickAction[];
  private readonly onSave: (workflow: WorkflowDefinition) => void;
  constructor(app: App, actions: QuickAction[], onSave: (workflow: WorkflowDefinition) => void, existing?: WorkflowDefinition) { super(app); this.actions = actions; this.onSave = onSave; this.name = existing?.name ?? ""; this.steps = existing?.steps.map((step) => ({ ...step })) ?? []; }
  onOpen(): void { this.titleEl.setText("Workflow bewerken"); this.render(); }
  onClose(): void { this.contentEl.empty(); }
  private render(): void {
    const el = this.contentEl; el.empty(); new Setting(el).setName("Naam").addText((input) => input.setValue(this.name).onChange((value) => { this.name = value; }));
    const list = el.createDiv({ cls: "contextflow-workflow-steps" });
    this.steps.forEach((step, index) => { const row = list.createDiv({ cls: "contextflow-workflow-step", attr: { draggable: "true" } }); row.createSpan({ text: `${index + 1}.` }); const select = row.createEl("select"); this.actions.forEach((action) => select.createEl("option", { value: action.id, text: action.name })); select.value = step.actionId; select.addEventListener("change", () => { step.actionId = select.value; }); const up = row.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "Stap omhoog" } }); setIcon(up, "chevron-up"); up.addEventListener("click", () => { if (index > 0) { [this.steps[index - 1], this.steps[index]] = [this.steps[index], this.steps[index - 1]]; this.render(); } }); const down = row.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "Stap omlaag" } }); setIcon(down, "chevron-down"); down.addEventListener("click", () => { if (index < this.steps.length - 1) { [this.steps[index], this.steps[index + 1]] = [this.steps[index + 1], this.steps[index]]; this.render(); } }); const remove = row.createEl("button", { cls: "clickable-icon", attr: { "aria-label": "Stap verwijderen" } }); setIcon(remove, "trash-2"); remove.addEventListener("click", () => { this.steps.splice(index, 1); this.render(); }); row.addEventListener("dragstart", (event) => { event.dataTransfer?.setData("text/plain", String(index)); }); row.addEventListener("dragover", (event) => event.preventDefault()); row.addEventListener("drop", (event) => { event.preventDefault(); const from = Number(event.dataTransfer?.getData("text/plain")); if (!Number.isNaN(from) && from !== index) { const [moved] = this.steps.splice(from, 1); this.steps.splice(index, 0, moved); this.render(); } }); });
    new Setting(el).addButton((button) => button.setButtonText("Stap toevoegen").onClick(() => { const action = this.actions[0]; if (action) { this.steps.push({ id: `step-${Date.now()}`, actionId: action.id, enabled: true }); this.render(); } })).addButton((button) => button.setButtonText("Opslaan").setCta().onClick(() => this.save()));
  }
  private save(): void { const workflow: WorkflowDefinition = { id: `workflow-${Date.now()}`, name: this.name.trim(), description: "", icon: "workflow", enabled: true, favorite: false, order: 1000, previewBeforeRun: false, steps: this.steps }; const errors = validateWorkflow(workflow, new Set(this.actions.map((action) => action.id))); if (errors.length) { new Notice(errors[0]); return; } this.onSave(workflow); this.close(); }
}
