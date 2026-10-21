// Builds, renders and reads the snippet cards on the options page.
(function (root) {
  function createCard({ trigger = '', text = '' } = {}) {
    const card = document.createElement('div');
    card.className = 'snippet';

    const triggerInput = document.createElement('input');
    triggerInput.className = 'trigger';
    triggerInput.placeholder = 'Trigger, e.g. po1';
    triggerInput.value = trigger;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Delete';
    removeButton.addEventListener('click', () => card.remove());

    const header = document.createElement('div');
    header.className = 'row';
    header.append(triggerInput, removeButton);

    const textArea = document.createElement('textarea');
    textArea.className = 'text';
    textArea.placeholder = 'Expanded text';
    textArea.value = text;

    card.append(header, textArea);
    return card;
  }

  function renderAll(list) {
    document.getElementById('list').replaceChildren(...list.map(createCard));
  }

  function readAll() {
    return [...document.querySelectorAll('#list .snippet')].map((card) => ({
      trigger: card.querySelector('.trigger').value,
      text: card.querySelector('.text').value,
    }));
  }

  root.SnippetCards = { createCard, renderAll, readAll };
})(globalThis);
