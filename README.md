# ContextFlow

ContextFlow is a local-first Quick Insert menu for Obsidian. From any Markdown note, use the command palette, editor context menu, ribbon action, or a configurable hotkey to insert useful Markdown actions quickly.

Documentation website: [contextflow documentation](https://loopman90.github.io/contextflow/).

## Getting started

ContextFlow is designed to be useful without a complicated setup:

1. Enable ContextFlow in **Settings → Community plugins**.
2. Open any Markdown note.
3. Place the cursor where you want the result.
4. Open **Quick Insert** from the command palette, the editor right-click menu, or the ribbon button.
5. Search for an action and press **Enter**.

You can also type `/` in a note to open the Slash Menu. Type a few letters, select an action with the arrow keys, and press **Enter**. If you press **Escape**, nothing is changed.

### The three things to remember

- **Actions** do one thing, such as inserting a date or converting selected text.
- **Workflows** run several actions in sequence.
- **Action packages** are JSON files that let you share custom actions and workflows.

You do not need to understand templates, variables, JSON or frontmatter to use the built-in actions.

## Common tasks

### Insert a date or task

Open Quick Insert and choose **Insert date**, **Insert time**, **Insert date and time**, or **Insert new task**. These actions work at the cursor position.

### Format existing text

First select the text, then open Quick Insert. Choose **Highlight selection**, **Convert selection to task**, **Convert selection to callout**, **Create internal link**, or **Insert code block**.

Actions that need selected text are hidden when there is no selection, so you do not have to guess which action is safe to use.

### Create a custom action

Go to **Settings → ContextFlow → Actions → Add custom action**. Give the action a name and enter Markdown in the template field. You can use:

```text
{{date}}       today's date
{{time}}       the current time
{{title}}      the current note name
{{selection}}  the selected text
{{input:name}} a value requested from you before execution
```

Start with one simple template. You can always edit or disable the action later.

### Create a workflow

Go to **Settings → ContextFlow → Action packages → Add workflow**. Add steps, move them with the arrow buttons or drag-and-drop, then save. A workflow uses the same actions as Quick Insert; it does not create copies of them.

### Import or export actions

Use **Export** to make a backup or share your custom actions. Use **Import** to load a JSON package. ContextFlow always shows a review screen first. Existing actions are not overwritten unless you explicitly choose the overwrite option.

### Use the optional calendar

The local calendar is disabled by default. Enable it in Settings if you need it. It stores events locally, supports basic recurrence and ICS import/export, and does not connect to Google, Microsoft or another external service.

## Language

ContextFlow starts in English. Change **Settings → ContextFlow → General → Language** to **Dutch**. The language setting is stored per vault.

## If something does not work

- **Nothing happens:** make sure a Markdown note is open and the plugin is enabled.
- **An action is missing:** check that it is enabled and that its context requirement is met, such as selecting text first.
- **Slash Menu does not open:** check the Slash Menu setting and make sure `/` is not inside a URL, code block, inline code or YAML frontmatter.
- **A custom action shows an error:** check its template for misspelled variables and complete all required input fields.
- **An import is rejected:** the package may be malformed or use an unsupported schema version. Export a fresh package from ContextFlow to compare the format.

When reporting a problem, include the action name, the current note context and the exact error message. Do not include private note contents.

## Features

- Searchable Quick Insert modal with keyboard navigation.
- Slash Menu with configurable trigger, live filtering and safe context exclusions.
- Editor context-menu, command-palette and ribbon access.
- Date, time, task, callout, table, code block, link and note actions.
- Selection-aware actions such as highlighting and converting text to a task.
- Local favorites/history settings foundation.
- Light/dark theme compatible and mobile-safe access paths.
- User-created Markdown actions with supported variables and selection behavior.
- Action/workflow validation and JSON action-package import/export.
- Basic workflow editor and safe sequential execution with failure reporting.
- Optional local calendar view, disabled by default and without external synchronization.

The calendar is intentionally a lightweight local extension point. External calendar synchronization, recurring appointments, drag-and-drop scheduling and `.ics` support are not included yet.

## Installation guide

Choose the option that matches what you want to do. You only need one option.

### Option A — Community Plugins (easiest)

Use this option after ContextFlow has been accepted into the official Obsidian Community Plugins directory.

1. Open Obsidian.
2. Click the **Settings** icon (the small gear) in the lower-left corner.
3. Select **Community plugins**.
4. If Safe mode is enabled, click **Turn off Safe mode** and confirm.
5. Click **Browse**.
6. Search for **ContextFlow**.
7. Click **Install**.
8. Click **Enable**.
9. Open a Markdown note and run **Open Quick Insert** from the command palette.

If ContextFlow does not appear in the search results, it has not been accepted or the Community Plugins list has not refreshed yet. Use Option B for now.

### Option B — Manual installation from GitHub

Use this option when the plugin is not yet available in Community Plugins.

1. Open the [ContextFlow GitHub repository](https://github.com/loopman90/contextflow).
2. Click **Releases** on the right side of the repository page.
3. Open the release that matches the version you want to install.
4. Download these three files:
   - `main.js`
   - `manifest.json`
   - `styles.css`
5. Find your Obsidian vault on your computer.
6. Open this folder inside the vault:

   ```text
   .obsidian/plugins/contextflow/
   ```

   If `plugins` or `contextflow` does not exist, create the missing folders yourself. The folder name must be exactly `contextflow` in lowercase.

7. Copy the three downloaded files into that folder.
8. Restart Obsidian, or go to **Settings → Community plugins** and reload the plugin list.
9. Find **ContextFlow** and switch it on.

The final folder must look like this:

```text
Your vault/
└── .obsidian/
    └── plugins/
        └── contextflow/
            ├── main.js
            ├── manifest.json
            └── styles.css
```

Do not put the files directly in `.obsidian`, in the vault root, or in a folder called `ContextFlow` with capital letters.

### Option C — Install from source for development

Use this option only if you want to modify the plugin's source code.

Requirements:

- Node.js 20 or newer;
- npm;
- an Obsidian vault for testing.

1. Open Terminal.
2. Download the repository:

   ```bash
   git clone https://github.com/loopman90/contextflow.git
   cd contextflow
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Build the plugin:

   ```bash
   npm run build
   ```

5. Copy `main.js`, `manifest.json` and `styles.css` into your vault's `.obsidian/plugins/contextflow/` folder as described in Option B.
6. Enable ContextFlow in Obsidian.

For active development, use `npm run dev` in the repository. After each source change, copy the newly generated `main.js` into the vault and reload the plugin.

### First launch checklist

After installation, verify these simple things:

1. A Markdown note is open.
2. ContextFlow is enabled under **Settings → Community plugins**.
3. Open the command palette with `Cmd/Ctrl+P`.
4. Search for **Open Quick Insert**.
5. Choose **Insert date**.
6. Confirm that today's date appears at the cursor.
7. Type `/` in a note and confirm that the Slash Menu appears.

If these steps work, the installation is complete.

### Installation troubleshooting

- **ContextFlow is not listed:** confirm that the folder is exactly `.obsidian/plugins/contextflow/`.
- **Obsidian says the manifest is invalid:** download `manifest.json` again and make sure it was not renamed to `manifest (1).json`.
- **The plugin is listed but will not enable:** confirm that `main.js`, `manifest.json` and `styles.css` are all in the same folder, then restart Obsidian.
- **The command is missing:** enable the plugin, close and reopen the vault, then search the command palette again.
- **The Slash Menu does not open:** check **Settings → ContextFlow → Slash Menu** and make sure it is enabled.
- **You cannot see `.obsidian`:** enable hidden files in your operating system's file browser. Obsidian's **Open vault folder** command can help you find the correct vault.

## Privacy and data

ContextFlow is local-only. It has no account, server, analytics, telemetry, AI integration or external scripts. Settings and the small recent-action history are stored through Obsidian's plugin data API in the current vault. Note content is not copied into plugin data.

## Development

```bash
npm install
npm run dev       # watch build
npm run typecheck
npm test
npm run build
```

## License

MIT. See [LICENSE](LICENSE).
