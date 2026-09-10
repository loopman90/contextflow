import type { ActionContext, ActionHandler, ActionResult, CustomActionDefinition, WorkflowDefinition } from "../models";
import { customActionToQuickAction } from "../utils/customAction";
import { validateWorkflow } from "../utils/validation";

export interface WorkflowRunResult { completed: string[]; failed?: { stepId: string; error: string }; results: ActionResult[]; }

export function validateWorkflowForRun(workflow: WorkflowDefinition, actions: CustomActionDefinition[]): string[] {
  return validateWorkflow(workflow, new Set(actions.map((action) => action.id)));
}

export function runWorkflow(workflow: WorkflowDefinition, handlers: Map<string, ActionHandler>, context: ActionContext): WorkflowRunResult {
  const completed: string[] = [];
  const results: ActionResult[] = [];
  for (const step of workflow.steps.filter((item) => item.enabled)) {
    const handler = handlers.get(step.actionId);
    if (!handler) return { completed, results, failed: { stepId: step.id, error: `Actie niet gevonden: ${step.actionId}` } };
    try { results.push(handler(context)); completed.push(step.id); } catch (error) { return { completed, results, failed: { stepId: step.id, error: error instanceof Error ? error.message : "Onbekende fout" } }; }
  }
  return { completed, results };
}

export function customActionHandlers(actions: CustomActionDefinition[]): Map<string, ActionHandler> {
  return new Map(actions.map((action) => [action.id, customActionToQuickAction(action).handler]));
}
