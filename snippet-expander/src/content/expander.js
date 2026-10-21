// Watches keystrokes in editable fields. When a trigger word is followed by
// Space, Enter or Tab, it is replaced with the matching snippet.
(function () {
  const { STORAGE_KEY, toMap, render, load } = SnippetCore;
  const { findEditable, textBeforeCaret, replaceBeforeCaret } = SnippetTarget;

  const BOUNDARY_KEYS = new Set([' ', 'Enter', 'Tab']);
  const TOKEN_AT_END = /(?:^|\s)(\S+)$/;

  let snippets = new Map();

  load().then((list) => {
    snippets = toMap(list);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes[STORAGE_KEY]) {
      snippets = toMap(changes[STORAGE_KEY].newValue);
    }
  });

  document.addEventListener(
    'keydown',
    (event) => {
      if (!BOUNDARY_KEYS.has(event.key) || event.isComposing) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const el = findEditable();
      const before = el && textBeforeCaret(el);
      const match = before && before.match(TOKEN_AT_END);
      if (!match || !snippets.has(match[1])) return;

      replaceBeforeCaret(el, match[1].length, render(snippets.get(match[1])));
      // Space and Enter still insert their own character after the replacement.
      // Tab would move focus, so it is consumed when it expands a snippet.
      if (event.key === 'Tab') event.preventDefault();
    },
    true,
  );
})();
