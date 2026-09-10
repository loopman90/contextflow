import { Notice, PluginSettingTab, Setting } from "obsidian";
import type ContextFlowPlugin from "../main";
import { ActionEditorModal } from "../ui/ActionEditorModal";
import { WorkflowEditorModal } from "../ui/WorkflowEditorModal";
import { t } from "../i18n";

export class ContextFlowSettingTab extends PluginSettingTab {
  plugin: ContextFlowPlugin;

  constructor(plugin: ContextFlowPlugin) { super(plugin.app, plugin); this.plugin = plugin; }

  display(): void {
    const { containerEl } = this;
    const language = this.plugin.settings.language;
    containerEl.empty();
    containerEl.createEl("p", { text: t("settingsDescription", language) });
    new Setting(containerEl).setName(t("general", language)).setHeading();
    new Setting(containerEl).setName(t("language", language)).setDesc(t("languageDescription", language)).addDropdown((dropdown) => dropdown.addOptions({ en: t("english", language), nl: t("dutch", language) }).setValue(language).onChange(async (value) => { this.plugin.settings.language = value as "en" | "nl"; await this.plugin.saveSettings(); this.display(); }));
    new Setting(containerEl).setName(t("quickInsert", language)).setHeading();
    new Setting(containerEl).setName(t("slashMenu", language)).setHeading();
    new Setting(containerEl).setName(t("slashMenuEnabled", language)).setDesc(t("slashMenuDescription", language)).addToggle((toggle) => toggle.setValue(this.plugin.settings.slashMenuEnabled).onChange(async (value) => { this.plugin.settings.slashMenuEnabled = value; await this.plugin.saveSettings(); }));
    new Setting(containerEl).setName(t("trigger", language)).setDesc(language === "en" ? "Use one character; the default is '/'." : "Gebruik één teken, standaard '/'.").addText((input) => input.setValue(this.plugin.settings.slashTrigger).onChange(async (value) => { const trigger = value.slice(0, 1); this.plugin.settings.slashTrigger = trigger || "/"; await this.plugin.saveSettings(); }));
    new Setting(containerEl).setName(t("maxResults", language)).addSlider((slider) => slider.setLimits(3, 30, 1).setValue(this.plugin.settings.slashMaxResults).onChange(async (value) => { this.plugin.settings.slashMaxResults = value; await this.plugin.saveSettings(); }));
    new Setting(containerEl).setName(language === "en" ? "Context-aware actions" : "Contextgevoelige acties").setDesc(language === "en" ? "Hide actions that do not match the current editor context." : "Verberg acties die niet passen bij de huidige editorcontext.").addToggle((toggle) => toggle.setValue(this.plugin.settings.showContextualActions).onChange(async (value) => { this.plugin.settings.showContextualActions = value; await this.plugin.saveSettings(); }));
    new Setting(containerEl).setName(language === "en" ? "Show unavailable actions" : "Niet-beschikbare acties tonen").addToggle((toggle) => toggle.setValue(this.plugin.settings.showDisabledActions).onChange(async (value) => { this.plugin.settings.showDisabledActions = value; await this.plugin.saveSettings(); }));
    new Setting(containerEl).setName(t("recentActions", language)).setDesc(language === "en" ? "Number of action IDs stored locally." : "Aantal actie-ID's dat lokaal wordt bewaard.").addSlider((slider) => slider.setLimits(0, 20, 1).setValue(this.plugin.settings.maxRecentActions).onChange(async (value) => { this.plugin.settings.maxRecentActions = value; this.plugin.settings.recentActionIds = this.plugin.settings.recentActionIds.slice(0, value); await this.plugin.saveSettings(); }));
    new Setting(containerEl).setName(language === "en" ? "Clear recent history" : "Recente geschiedenis wissen").addButton((button) => button.setButtonText(t("clear", language)).onClick(async () => { this.plugin.settings.recentActionIds = []; await this.plugin.saveSettings(); new Notice(language === "en" ? "Recent actions cleared" : "Recente acties gewist"); }));
    new Setting(containerEl).setName(t("actions", language)).setHeading();
    new Setting(containerEl).setName(language === "en" ? "Add custom action" : "Eigen actie toevoegen").setDesc(language === "en" ? "Create a local Markdown action with variables." : "Maak een lokale actie met Markdown en variabelen.").addButton((button) => button.setButtonText(language === "en" ? "New action" : "Nieuwe actie").setCta().onClick(() => new ActionEditorModal(this.app, (action) => { this.plugin.settings.customActions.push(action); void this.plugin.saveSettings(); this.display(); }).open()));
    this.plugin.allActions().forEach((action) => {
      new Setting(containerEl).setName(action.name).setDesc(action.description)
        .addToggle((toggle) => toggle.setValue(action.enabled).setTooltip("Actie inschakelen").onChange(async (value) => { this.plugin.setActionEnabled(action.id, value); await this.plugin.saveSettings(); }))
        .addToggle((toggle) => toggle.setValue(action.favorite).setTooltip("Favoriet maken").onChange(async (value) => { this.plugin.setActionFavorite(action.id, value); await this.plugin.saveSettings(); }));
    });
    new Setting(containerEl).setName(t("access", language)).setHeading();
    new Setting(containerEl).setName(t("mobileToolbar", language)).setDesc(language === "en" ? "Register an extra command for mobile access." : "Registreer een extra command voor snelle mobiele toegang.").addToggle((toggle) => toggle.setValue(this.plugin.settings.mobileToolbar).onChange(async (value) => { this.plugin.settings.mobileToolbar = value; await this.plugin.saveSettings(); }));
    new Setting(containerEl).setName(t("calendar", language)).setDesc(language === "en" ? "Enable the local calendar view. There is no external sync." : "Activeer de lokale kalenderweergave. Er is geen externe synchronisatie.").addToggle((toggle) => toggle.setValue(this.plugin.settings.calendarEnabled).onChange(async (value) => { this.plugin.settings.calendarEnabled = value; await this.plugin.saveSettings(); }));
    new Setting(containerEl).setName(t("packages", language)).setHeading();
    new Setting(containerEl).setName(language === "en" ? "Add workflow" : "Workflow toevoegen").setDesc(language === "en" ? "Combine actions into one executable workflow." : "Combineer acties tot één uitvoerbare stap.").addButton((button) => button.setButtonText(language === "en" ? "New workflow" : "Nieuwe workflow").setCta().onClick(() => new WorkflowEditorModal(this.app, this.plugin.allActions().filter((action) => !action.id.startsWith("workflow:")), (workflow) => { this.plugin.settings.workflows.push(workflow); void this.plugin.saveSettings(); this.display(); }).open()));
    new Setting(containerEl).setName(language === "en" ? "Export actions and workflows" : "Acties en workflows exporteren").setDesc(language === "en" ? "Export local ContextFlow configuration as validated JSON." : "Exporteer ContextFlow-configuratie als gevalideerd JSON-bestand.").addButton((button) => button.setButtonText(t("export", language)).onClick(() => this.plugin.exportActionPackage()));
    new Setting(containerEl).setName(language === "en" ? "Import action package" : "Actiepakket importeren").setDesc(language === "en" ? "Import JSON; conflicting existing items are not overwritten." : "Importeer JSON; bestaande conflicterende onderdelen worden niet overschreven.").addButton((button) => button.setButtonText(t("import", language)).onClick(() => {
      const input = containerEl.createEl("input", { attr: { type: "file", accept: "application/json,.json" } }); input.addEventListener("change", () => { const file = input.files?.[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener("load", () => { if (typeof reader.result === "string") void this.plugin.importActionPackage(reader.result); }); reader.readAsText(file); input.remove(); }); input.click();
    }));
    containerEl.createEl("p", { cls: "setting-item-description", text: t("localOnly", language) });
  }
}
