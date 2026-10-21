// Finds the focused editable field and reads or replaces text around the caret.
// Works for <textarea>, text-like <input>s and contenteditable elements.
(function (root) {
  const TEXT_INPUT_TYPES = new Set(['text', 'search', 'email', 'url', 'tel']);

  function isTextField(el) {
    return el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && TEXT_INPUT_TYPES.has(el.type));
  }

  function findEditable() {
    const el = document.activeElement;
    return el && (isTextField(el) || el.isContentEditable) ? el : null;
  }

  // Text from the start of the field up to the caret, or null if text is selected.
  function textBeforeCaret(el) {
    if (isTextField(el)) {
      if (el.selectionStart !== el.selectionEnd) return null;
      return el.value.slice(0, el.selectionStart);
    }
    const sel = window.getSelection();
    if (!sel.rangeCount || !sel.isCollapsed) return null;
    const range = document.createRange();
    range.selectNodeContents(el);
    range.setEnd(sel.focusNode, sel.focusOffset);
    return range.toString();
  }

  // Selects `length` characters before the caret and types `text` over them.
  // execCommand keeps native undo history and fires input events for frameworks.
  function replaceBeforeCaret(el, length, text) {
    if (isTextField(el)) {
      const end = el.selectionStart;
      el.setSelectionRange(end - length, end);
    } else {
      const sel = window.getSelection();
      for (let i = 0; i < length; i++) sel.modify('extend', 'backward', 'character');
    }
    document.execCommand('insertText', false, text);
  }

  root.SnippetTarget = { findEditable, textBeforeCaret, replaceBeforeCaret };
})(globalThis);
