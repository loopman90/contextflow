# ContextFlow

ContextFlow is a local-first Quick Insert menu for Obsidian. From any Markdown note, use the command palette, editor context menu, ribbon action, or a configurable hotkey to insert useful Markdown actions quickly.

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

## Installation for development

1. Clone this repository into a development folder.
2. Run `npm install`.
3. Run `npm run build`.
4. Copy `main.js`, `manifest.json` and `styles.css` into `<Vault>/.obsidian/plugins/contextflow/`.
5. Enable ContextFlow under Community plugins.

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
