export type Language = "en" | "nl";

const translations: Record<string, { en: string; nl: string }> = {
  quickInsert: { en: "Quick Insert", nl: "Quick Insert" },
  openQuickInsert: { en: "Open Quick Insert", nl: "Quick Insert openen" },
  searchActions: { en: "Search actions…", nl: "Zoek acties…" },
  noActions: { en: "No matching actions.", nl: "Geen passende acties." },
  useKeyboard: { en: "Search for an action and press Enter. Use ↑/↓ to navigate.", nl: "Zoek een actie en druk op Enter. Gebruik ↑/↓ om te navigeren." },
  settingsDescription: { en: "Configure the local Quick Insert experience. Changes are saved immediately.", nl: "Stel de lokale Quick Insert-ervaring in. Wijzigingen worden direct opgeslagen." },
  general: { en: "General", nl: "Algemeen" },
  language: { en: "Language", nl: "Taal" },
  languageDescription: { en: "Choose the language used by ContextFlow.", nl: "Kies de taal waarin ContextFlow wordt weergegeven." },
  english: { en: "English", nl: "Engels" },
  dutch: { en: "Dutch", nl: "Nederlands" },
  slashMenu: { en: "Slash Menu", nl: "Slash Menu" },
  slashMenuEnabled: { en: "Enable Slash Menu", nl: "Slash Menu inschakelen" },
  slashMenuDescription: { en: "Open Quick Insert when you type the trigger in a Markdown note.", nl: "Open Quick Insert wanneer je het triggerteken typt in een Markdown-notitie." },
  trigger: { en: "Trigger character", nl: "Triggerteken" },
  maxResults: { en: "Maximum results", nl: "Maximum resultaten" },
  actions: { en: "Actions", nl: "Acties" },
  access: { en: "Access", nl: "Toegang" },
  enabled: { en: "Enabled", nl: "Ingeschakeld" },
  favorite: { en: "Favorite", nl: "Favoriet" },
  recentActions: { en: "Recent actions", nl: "Recente acties" },
  clear: { en: "Clear", nl: "Wissen" },
  mobileToolbar: { en: "Mobile toolbar action", nl: "Mobiele toolbaractie" },
  calendar: { en: "Optional local calendar", nl: "Optionele lokale kalender" },
  packages: { en: "Action packages", nl: "Actiepakketten" },
  export: { en: "Export", nl: "Exporteren" },
  import: { en: "Import", nl: "Importeren" },
  localOnly: { en: "ContextFlow works entirely locally. No note content, selections or forms are sent to external services.", nl: "ContextFlow werkt volledig lokaal. Er worden geen notitie-inhoud, selecties of formulieren naar externe diensten gestuurd." }
};

export function t(key: string, language: Language): string { return translations[key]?.[language] ?? key; }

export const actionTranslations: Record<string, { en: [string, string]; nl: [string, string] }> = {
  date: { en: ["Insert date", "Insert today's date."], nl: ["Datum invoegen", "Voeg de datum van vandaag in."] },
  time: { en: ["Insert time", "Insert the current time."], nl: ["Tijd invoegen", "Voeg de huidige tijd in."] },
  datetime: { en: ["Insert date and time", "Insert the current date and time."], nl: ["Datum en tijd invoegen", "Voeg de huidige datum en tijd in."] },
  task: { en: ["Insert new task", "Insert an empty task."], nl: ["Nieuwe taak invoegen", "Voeg een lege taak toe."] },
  deadline: { en: ["Add deadline", "Add a deadline to the selected text."], nl: ["Deadline toevoegen", "Voeg een deadline toe aan de geselecteerde tekst."] },
  meeting: { en: ["Insert meeting block", "Create a simple meeting block."], nl: ["Afspraakblok invoegen", "Maak een eenvoudig afspraakblok."] },
  divider: { en: ["Insert divider", "Insert a Markdown divider."], nl: ["Scheidingslijn invoegen", "Voeg een Markdown-scheidingslijn toe."] },
  callout: { en: ["Insert callout", "Insert an informational callout."], nl: ["Callout invoegen", "Voeg een informatieve callout toe."] },
  highlight: { en: ["Highlight selection", "Wrap the selection in highlight markers."], nl: ["Geselecteerde tekst markeren", "Zet de selectie tussen markeertekens."] },
  "task-selection": { en: ["Convert selection to task", "Turn the selection into a task."], nl: ["Selectie omzetten naar taak", "Maak van de selectie een taak."] },
  "callout-selection": { en: ["Convert selection to callout", "Put the selection in a callout."], nl: ["Selectie omzetten naar callout", "Zet de selectie in een callout."] },
  "internal-link": { en: ["Create internal link", "Turn the selection into an Obsidian link."], nl: ["Interne link maken", "Maak van de selectie een interne Obsidian-link."] },
  "code-block": { en: ["Insert code block", "Wrap the selection in a code block."], nl: ["Codeblok invoegen", "Omring de selectie met een codeblok."] },
  table: { en: ["Insert table", "Insert a simple table."], nl: ["Tabel invoegen", "Voeg een eenvoudige tabel toe."] },
  "linked-note": { en: ["Create linked note", "Insert a link to a new note."], nl: ["Nieuwe gekoppelde notitie maken", "Voeg een link naar een nieuwe notitie in."] }
};
