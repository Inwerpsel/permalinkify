javascript: (() => {
  const datetimeReg = /\d\d\d\d-\d\d-\d\d(T\d\d:\d\d:\d\d)?/;
  const selection = window.getSelection();

  const range = selection.getRangeAt(0);
  let container = range.commonAncestorContainer;

  if (container.nodeType === 3) {
    container = container.parentNode;
  }

  const links = container.querySelectorAll(
    'a[href^="https://github.com/"][href*="/blob/"]'
  );

  function findDatetimeLastEdit(node) {
    const timeEl = node.querySelector('.js-comment-edit-history menu relative-time');
    if (timeEl) {
        return timeEl.datetime;
    }

    if (node === document.body) {
      return;
    }
    return findDatetimeLastEdit(node.parentNode);
  }

  function findDatetime(node) {
    const timeEl = node.querySelector('relative-time');
    if (timeEl) {
        return timeEl.datetime;
    }

    if (node === document.body) {
      return;
    }
    return findDatetime(node.parentNode);
  }

  function findDateTimeFallback(node) {
    const fromText = datetimeReg.exec(node.innerText);
    if (fromText) {
        return fromText[0];
    }

    for (const { value } of node.attributes) {
      const fromAttr = datetimeReg.exec(value);
      if (fromAttr) {
        return fromAttr[0];
      }
    }

    if (node === document.body) {
      return;
    }
    return findDateTimeFallback(node.parentNode);
  }

  const link = links[0] || container;
  if (!link) {
    return;
  }
  const date = findDatetimeLastEdit(link) || findDatetime(link) || findDateTimeFallback(link) || '2023-11-02T18:59:25Z';

  window.open(
    `https://inwerpsel.github.io/permalinkify?autoopen=1&date=${date}&url=${link.href}`
  );
})();
