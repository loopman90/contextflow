import type { ActionContext, CustomActionDefinition, QuickAction } from "../models";
import { resolveVariables } from "./variables";

export function customActionToQuickAction(definition: CustomActionDefinition, values: Record<string, string> = {}): QuickAction {
  return {
    ...definition,
    handler: (context: ActionContext) => {
      const resolved = resolveVariables(definition.template, context, values);
      if (resolved.unknown.length) throw new Error(`Onbekende variabelen: ${resolved.unknown.join(", ")}`);
      const text = definition.selectionBehavior === "wrap" ? `${definition.wrapBefore ?? ""}${resolved.text}${definition.wrapAfter ?? ""}` : resolved.text;
      if (definition.selectionBehavior === "replace" || definition.selectionBehavior === "wrap") return { message: `${definition.name} uitgevoerd`, replacement: { from: 0, to: context.selection.length, text } };
      if (definition.selectionBehavior === "before") return { message: `${definition.name} uitgevoerd`, replacement: { from: 0, to: 0, text: `${text}${context.selection}` } };
      if (definition.selectionBehavior === "after") return { message: `${definition.name} uitgevoerd`, replacement: { from: 0, to: context.selection.length, text: `${context.selection}${text}` } };
      return { message: `${definition.name} uitgevoerd`, insertText: text };
    }
  };
}
