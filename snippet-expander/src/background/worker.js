// Service worker: seeds default snippets on first install and opens settings
// when the toolbar icon is clicked.
importScripts('../shared/snippets.js');

const { DEFAULT_SNIPPETS, save } = SnippetCore;

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') save(DEFAULT_SNIPPETS);
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
