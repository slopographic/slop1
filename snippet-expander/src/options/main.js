// Connects the options page buttons to storage through the shared core.
(function () {
  const { load, save } = SnippetCore;
  const { createCard, renderAll, readAll } = SnippetCards;

  const status = document.getElementById('status');
  let clearTimer = null;

  function flash(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('error', isError);
    clearTimeout(clearTimer);
    clearTimer = setTimeout(() => {
      status.textContent = '';
    }, 2500);
  }

  document.getElementById('add').addEventListener('click', () => {
    const card = createCard();
    document.getElementById('list').append(card);
    card.querySelector('.trigger').focus();
  });

  document.getElementById('save').addEventListener('click', async () => {
    const entries = readAll();
    const invalid = entries.find((entry) => /\s/.test(entry.trigger.trim()));
    if (invalid) {
      flash(`Trigger "${invalid.trigger.trim()}" cannot contain spaces`, true);
      return;
    }
    await save(entries);
    flash('Saved');
  });

  load().then(renderAll);
})();
