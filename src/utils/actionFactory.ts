import type { ActionCategory, ActionHandler, QuickAction } from "../models";
import { formatDate, formatDateTime, formatTime } from "./date";

function insert(text: string, message: string, selectInsertedText = false): ActionHandler {
  return () => ({ message, insertText: text, selectInsertedText });
}

function replaceSelection(text: (selection: string) => string, message: string): ActionHandler {
  return (context) => ({ message, replacement: { from: 0, to: context.selection.length, text: text(context.selection) } });
}

export function createDefaultActions(): QuickAction[] {
  const entries: Array<Omit<QuickAction, "handler"> & { handler: ActionHandler }> = [
    { id: "date", name: "Datum invoegen", description: "Voeg de datum van vandaag in.", icon: "calendar", category: "date-time", enabled: true, favorite: false, order: 0, handler: insert(formatDate(), "Datum toegevoegd") },
    { id: "time", name: "Tijd invoegen", description: "Voeg de huidige tijd in.", icon: "clock", category: "date-time", enabled: true, favorite: false, order: 1, handler: insert(formatTime(), "Tijd toegevoegd") },
    { id: "datetime", name: "Datum en tijd invoegen", description: "Voeg de huidige datum en tijd in.", icon: "calendar-clock", category: "date-time", enabled: true, favorite: false, order: 2, handler: insert(formatDateTime(), "Datum en tijd toegevoegd") },
    { id: "task", name: "Nieuwe taak invoegen", description: "Voeg een lege taak toe.", icon: "check-square", category: "tasks", enabled: true, favorite: false, order: 3, handler: insert("- [ ] ", "Taak toegevoegd") },
    { id: "deadline", name: "Deadline toevoegen", description: "Voeg een deadline-property toe aan de huidige regel.", icon: "alarm-clock", category: "tasks", enabled: true, favorite: false, order: 4, requiresSelection: true, handler: replaceSelection((selection) => `${selection} 📅 ${formatDate()}`, "Deadline toegevoegd") },
    { id: "meeting", name: "Afspraakblok invoegen", description: "Maak een eenvoudig afspraakblok.", icon: "calendar-plus", category: "date-time", enabled: true, favorite: false, order: 5, handler: insert(`## Afspraak — ${formatDate()} ${formatTime()}\n\n- Locatie: \n- Deelnemers: \n- Notities: \n`, "Afspraakblok toegevoegd") },
    { id: "divider", name: "Scheidingslijn invoegen", description: "Voeg een Markdown-scheidingslijn toe.", icon: "minus", category: "formatting", enabled: true, favorite: false, order: 6, handler: insert("\n---\n", "Scheidingslijn toegevoegd") },
    { id: "callout", name: "Callout invoegen", description: "Voeg een informatieve callout toe.", icon: "message-square", category: "formatting", enabled: true, favorite: false, order: 7, handler: insert("> [!info] Notitie\n> \n", "Callout toegevoegd") },
    { id: "highlight", name: "Geselecteerde tekst markeren", description: "Zet de selectie tussen markeertekens.", icon: "highlighter", category: "formatting", enabled: true, favorite: false, order: 8, requiresSelection: true, handler: replaceSelection((selection) => `==${selection}==`, "Tekst gemarkeerd") },
    { id: "task-selection", name: "Selectie omzetten naar taak", description: "Maak van de selectie een taak.", icon: "check-square-2", category: "tasks", enabled: true, favorite: false, order: 9, requiresSelection: true, handler: replaceSelection((selection) => `- [ ] ${selection}`, "Selectie omgezet naar taak") },
    { id: "callout-selection", name: "Selectie omzetten naar callout", description: "Zet de selectie in een callout.", icon: "message-square", category: "formatting", enabled: true, favorite: false, order: 10, requiresSelection: true, handler: replaceSelection((selection) => `> [!note]\n> ${selection.replace(/\n/g, "\n> ")}`, "Selectie omgezet naar callout") },
    { id: "internal-link", name: "Interne link maken", description: "Maak van de selectie een interne Obsidian-link.", icon: "link", category: "notes", enabled: true, favorite: false, order: 11, requiresSelection: true, handler: replaceSelection((selection) => `[[${selection}]]`, "Interne link gemaakt") },
    { id: "code-block", name: "Codeblok invoegen", description: "Omring de selectie met een codeblok.", icon: "code-2", category: "formatting", enabled: true, favorite: false, order: 12, requiresSelection: false, handler: replaceSelection((selection) => `\`\`\`\n${selection}\n\`\`\``, "Codeblok toegevoegd") },
    { id: "table", name: "Tabel invoegen", description: "Voeg een eenvoudige tabel toe.", icon: "table-2", category: "formatting", enabled: true, favorite: false, order: 13, handler: insert("| Onderwerp | Waarde |\n| --- | --- |\n|  |  |\n", "Tabel toegevoegd") },
    { id: "linked-note", name: "Nieuwe gekoppelde notitie maken", description: "Voeg een link naar een nieuwe notitie in.", icon: "file-plus-2", category: "notes", enabled: true, favorite: false, order: 14, handler: insert("[[Nieuwe notitie]]", "Link naar nieuwe notitie toegevoegd") }
  ];
  return entries;
}

export function categoryLabel(category: ActionCategory): string {
  return { "date-time": "Datum en tijd", tasks: "Taken", formatting: "Opmaak", notes: "Notities", templates: "Templates", custom: "Eigen acties" }[category];
}
