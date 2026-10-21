# Snippet Expander

A small Chrome extension. Type a short trigger such as `po1`, then press
Space, Enter or Tab, and it expands into a full snippet in any text field.

## Install (unpacked)

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose this `snippet-expander` folder.
3. Click the extension's toolbar icon to open the snippet settings.

Snippets sync across Chrome profiles signed into the same account. Chrome's sync
storage holds roughly 100 KB in total.

## Usage

- Add, edit or delete snippets on the settings page, then press **Save**.
- Triggers cannot contain spaces.
- `{date}` inside a snippet inserts today's date.

## Layout

```
manifest.json
src/
  shared/snippets.js     storage schema, defaults, lookup (single source of truth)
  background/worker.js   install defaults, open settings on icon click
  content/target.js      find and edit the focused field
  content/expander.js    keystroke handling and expansion
  options/options.html   settings page markup
  options/options.css    settings page styles
  options/render.js      snippet card rendering and reading
  options/main.js        settings page behavior
```
