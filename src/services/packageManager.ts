import type { ActionPackage, CustomActionDefinition, WorkflowDefinition } from "../models";
import { validatePackage } from "../utils/validation";

export function createPackage(name: string, actions: CustomActionDefinition[], workflows: WorkflowDefinition[], description = ""): ActionPackage {
  return { schemaVersion: 1, name, version: "1.0.0", description, actions, workflows };
}

export function serializePackage(value: ActionPackage): string { return JSON.stringify(value, null, 2); }

export function parsePackage(text: string): { package?: ActionPackage; errors: string[] } {
  try { return validatePackage(JSON.parse(text)); } catch { return { errors: ["Het JSON-bestand kon niet worden gelezen."] }; }
}

export function mergePackage(existing: CustomActionDefinition[], imported: CustomActionDefinition[], overwrite: boolean): { actions: CustomActionDefinition[]; conflicts: string[] } {
  const byId = new Map(existing.map((action) => [action.id, action]));
  const conflicts: string[] = [];
  for (const action of imported) { if (byId.has(action.id) && !overwrite) { conflicts.push(action.id); continue; } byId.set(action.id, action); }
  return { actions: [...byId.values()], conflicts };
}
