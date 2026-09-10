import type { ContextFlowSettings, QuickAction } from "../models";
import { DEFAULT_SETTINGS } from "../models";

export function mergeSettings(saved: Partial<ContextFlowSettings> | null | undefined, defaults: QuickAction[]): ContextFlowSettings {
  const actions = defaults.map((action) => ({ id: action.id, enabled: action.enabled, favorite: action.favorite, order: action.order }));
  const savedById = new Map((saved?.actions ?? []).map((action) => [action.id, action]));
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    customActions: saved?.customActions ?? [],
    workflows: saved?.workflows ?? [],
    categories: saved?.categories ?? [],
    actions: actions.map((action) => ({ ...action, ...savedById.get(action.id) })),
    recentActionIds: Array.from(new Set(saved?.recentActionIds ?? [])).slice(0, saved?.maxRecentActions ?? DEFAULT_SETTINGS.maxRecentActions)
  };
}

export function actionIsAvailable(action: QuickAction, hasSelection: boolean, showDisabledActions: boolean): boolean {
  if (!action.enabled && !showDisabledActions) return false;
  return !action.requiresSelection || hasSelection || showDisabledActions;
}
