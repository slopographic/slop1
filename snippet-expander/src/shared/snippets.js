// Single source of truth for snippet storage, defaults and lookup.
// Classic script: exposes `SnippetCore` on globalThis so content scripts,
// the service worker (via importScripts) and the options page share it.
(function (root) {
  const STORAGE_KEY = 'snippets';

  const DEFAULT_SNIPPETS = [
    {
      trigger: 'po1',
      text: 'Good day,\n\nMany thanks for your quote. Please find the PO attached.\n\nKind regards',
    },
    { trigger: 'thx', text: 'Thank you very much.' },
    { trigger: 'today', text: '{date}' },
  ];

  // Coerces arbitrary stored data into clean { trigger, text } entries.
  // Entries without a trigger, or whose trigger contains whitespace, are dropped.
  function normalize(list) {
    if (!Array.isArray(list)) return [];
    return list
      .map((item) => ({
        trigger: String(item?.trigger ?? '').trim(),
        text: String(item?.text ?? ''),
      }))
      .filter((item) => item.trigger && !/\s/.test(item.trigger));
  }

  // Lookup table keyed by trigger. Later duplicates win.
  function toMap(list) {
    return new Map(normalize(list).map((item) => [item.trigger, item.text]));
  }

  // Expands placeholders in snippet text. Only {date} is supported today.
  function render(text, now = new Date()) {
    return text.replace(/\{date\}/g, () => now.toLocaleDateString());
  }

  async function load() {
    const stored = await chrome.storage.sync.get({ [STORAGE_KEY]: [] });
    return normalize(stored[STORAGE_KEY]);
  }

  function save(list) {
    return chrome.storage.sync.set({ [STORAGE_KEY]: normalize(list) });
  }

  root.SnippetCore = {
    STORAGE_KEY,
    DEFAULT_SNIPPETS,
    normalize,
    toMap,
    render,
    load,
    save,
  };
})(globalThis);
