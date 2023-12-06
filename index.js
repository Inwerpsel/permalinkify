const localStorageKey = 'permalinkify:history';
const FORMAT = 'YY-MM-DDTHH:MM:SSZ';
const daysBefore = 5;
const root = document.getElementById('root');
const noop = () => {};
const urlParams = new URLSearchParams(window.location.search);

// Ad hoc micro inline framework.
function el(tagname, parent = root, onCreate = noop) {
  const el = document.createElement(tagname);
  onCreate(el);
  parent.appendChild(el);

  return el;
}

function input(parent, onCreate) {
  return el('input', parent, onCreate);
}

const controlsDiv = el('div', root);
el(
  'h2',
  controlsDiv,
  (el) => (el.textContent = `Input URL and Date (${FORMAT})`)
);
const outputDiv = el('div', root);
el('h2', outputDiv, (el) => (el.textContent = 'Permalink'));
const historyDiv = el('div', root);

el('h2', historyDiv, (el) => (el.textContent = 'Last searches'));
const latestHistoryEl = el('ul', historyDiv);
el('h2', historyDiv, (el) => (el.textContent = 'Older searches'));
const historyEl = el('ul', historyDiv);
el('button', historyEl, el => {
  el.textContent = 'Clear history';
  el.onclick = () => {
    if (confirm('Clear all history?')) {
      localStorage.removeItem(localStorageKey);
    }
  }
})

function historyEntry({ root = historyEl, date, branchLink, permaLink }) {
  let entry = el('code', el('li', root));
  entry.textContent = `${date} --- ${branchLink} ---`;
  el('button', entry, (el) => {
    el.textContent = 'restore';
    el.style.float = 'left';
    el.onclick = () => {
      urlInput.value = branchLink;
      dateInput.value = date;
      search();
    };
  });
  el('a', entry, (el) => {
    el.textContent = permaLink;
    el.href = permaLink;
  });
}

const outputEl = el('code', outputDiv, (el) => {
  el.style.minWidth = '200px';
});
const urlInput = input(controlsDiv, (el) => {
  const hash = window.location.hash;
  const urlQuery = urlParams.get('url');
  el.value = urlQuery
    ? urlQuery + hash
    : 'https://github.com/chromium/chromium/blob/main/chrome/chrome_paks.gni#L585';
  el.style.minWidth = '100%';
  // el.addEventListener('change', event => {
  // });
});
const dateInput = input(controlsDiv);
dateInput.value = urlParams.get('date');
dateInput.style.minWidth = '100%';

const submitButton = el('button', controlsDiv, (el) => {
  el.textContent = 'Search';
  el.onclick = search;
});

const history = JSON.parse(
  localStorage.getItem(localStorageKey) || '[]'
);

for (const props of history) {
  historyEntry(props);
}

const githubRegex =
  /https\:\/\/github\.com\/([^\/]+)\/([^\/]+)\/([^#]*)(#L(\d+)(-L(\d+))?)?/;

const pathRegex = /blob\/([^\/]*)\/(.*)/;

let lastResult, lastLink;

async function callGithub(path) {
  const url = `https://api.github.com/repos/${path}`;
  const response = await fetch(url);
  return await response.json();
}

async function search() {
  const branchLink = urlInput.value;
  const [, username, repo, path, , startline, , endline] = githubRegex.exec(branchLink);
  const [, branch] = pathRegex.exec(path);
  const date = dateInput.value;
  lastResult && lastResult.parentNode.removeChild(lastResult);
  const refs = await findCommitsAroundDate(username, repo, new Date(date));
  if (refs.length === 0) {
    return;
  }
  const {
    sha,
    commit: {
      committer: { name, date: commitDate },
      message,
    },
  } = refs[0];
  const permaLink = branchLink.replace(branch, sha);
  lastLink = permaLink;

  // const formatted = JSON.stringify(last, null, 4);
  const wrap = el('div', outputEl);
  lastResult = wrap;
  el('span', wrap, (el) => {
    el.textContent = `${commitDate} ${name} --- ${message}`;
    el.title = branchLink;
  });
  const anchor = el('a', wrap);
  anchor.style.cssText = 'display:block';
  anchor.target = '_blank';
  anchor.textContent = permaLink;
  anchor.href = permaLink;

  if (
    history.some(
      (entry) => entry.date === date && entry.branchLink === branchLink
    )
  )
    return;

  history.push({ date, branchLink, permaLink, sha });
  history.sort((a, b) => a.branchLink.localeCompare(b.branchLink));
  localStorage.setItem(localStorageKey, JSON.stringify(history));
  historyEntry({ root: latestHistoryEl,date, branchLink, permaLink });
}

async function findCommitsAroundDate(username, repo, date) {
  // For now this uses a hard coded range around the date.
  // If the message in which the link was posted has a minute precision and accurate post date,
  // it means we should look for commits that were authored strictly before that date.

  // If there's less precision we should look for anything before the next day.
  const messageDate = new Date(date);
  messageDate.setDate(messageDate.getDate());
  const path = `${username}/${repo}/commits?until=${messageDate.toISOString()})`;
  return callGithub(path);
}

if (dateInput.value && urlInput.value) {}
 search().then(() => {
  if (urlParams.get('autoopen') === '1' && lastLink) {
    window.location.href=lastLink
  }
 })