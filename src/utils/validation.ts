import type { ActionPackage, CustomActionDefinition, WorkflowDefinition } from "../models";

export const KNOWN_VARIABLES = new Set(["date", "time", "datetime", "title", "filename", "filepath", "folder", "selection", "clipboard", "cursor"]);

export function validateAction(action: CustomActionDefinition): string[] {
  const errors: string[] = [];
  if (!action.id || !action.name) errors.push("Elke actie heeft een ID en naam nodig.");
  if (!action.template && action.selectionBehavior !== "insert") errors.push("Een actie moet inhoud bevatten.");
  for (const match of action.template.matchAll(/\{\{\s*([^}:]+)(?::[^}]+)?\s*\}\}/g)) if (!KNOWN_VARIABLES.has(match[1]) && !match[1].startsWith("input")) errors.push(`Onbekende variabele: ${match[1]}`);
  for (const field of action.inputs) if (!field.id || !field.label || !field.variable) errors.push("Invulvelden hebben een ID, label en variabelenaam nodig.");
  return errors;
}

export function validateWorkflow(workflow: WorkflowDefinition, actionIds: Set<string>): string[] {
  const errors: string[] = [];
  if (!workflow.id || !workflow.name) errors.push("Elke workflow heeft een ID en naam nodig.");
  if (workflow.steps.length === 0) errors.push("Een workflow heeft minimaal één stap nodig.");
  for (const step of workflow.steps) if (!actionIds.has(step.actionId)) errors.push(`Workflowstap verwijst naar onbekende actie: ${step.actionId}`);
  return errors;
}

export function validatePackage(value: unknown): { valid: boolean; errors: string[]; package?: ActionPackage } {
  if (!value || typeof value !== "object") return { valid: false, errors: ["Het bestand bevat geen geldig object."] };
  const candidate = value as Partial<ActionPackage>;
  const errors: string[] = [];
  if (candidate.schemaVersion !== 1) errors.push("Onbekende actiepakketversie.");
  if (!candidate.name || !candidate.version || !Array.isArray(candidate.actions) || !Array.isArray(candidate.workflows)) errors.push("Het actiepakket mist verplichte onderdelen.");
  for (const action of candidate.actions ?? []) errors.push(...validateAction(action).map((error) => `${action.name ?? "Actie"}: ${error}`));
  const actionIds = new Set((candidate.actions ?? []).map((action) => action.id));
  for (const workflow of candidate.workflows ?? []) errors.push(...validateWorkflow(workflow, actionIds).map((error) => `${workflow.name ?? "Workflow"}: ${error}`));
  return errors.length ? { valid: false, errors } : { valid: true, errors: [], package: candidate as ActionPackage };
}
