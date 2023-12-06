# permalinkify

It happens to all of us. We (or somebody else) copy a link from GitHub, but forget to use a permalink.
An arbitrary amount of commits later, we stumble on this link, and scramble to find the lines being linked.
Especially annoying if the file was removed.

Use this to locate the last commit on the main branch before the date of the message you found the link in.

## [inwerpsel.github.io/permalinkify](https://inwerpsel.github.io/permalinkify)

## Bookmarklet
Save the following as a bookmark.

```
javascript: (() => { const datetimeReg = /\d\d\d\d-\d\d-\d\d(T\d\d:\d\d:\d\d)?/; const selection = window.getSelection(); const range = selection.getRangeAt(0); let container = range.commonAncestorContainer; if (container.nodeType === 3) { container = container.parentNode; } const links = container.querySelectorAll( 'a[href^="https://github.com/"][href*="/blob/"]'); function findDatetime(node) { const timeEl = node.querySelector('relative-time'); if (timeEl) { return timeEl.datetime; } if (node === document.body) { return; } return findDatetime(node.parentNode); } function findDateTimeFallback(node) { const fromText = datetimeReg.exec(node.innerText); if (fromText) { return fromText[0]; } for (const { value } of node.attributes) { const fromAttr = datetimeReg.exec(value); if (fromAttr) { return fromAttr[0]; } } if (node === document.body) { return; } return findDateTimeFallback(node.parentNode); } const link = links[0] || container; if (!link) { return; } const date = findDatetime(link) || findDateTimeFallback(link) || '2023-11-02T18:59:25Z'; window.open( `https://inwerpsel.github.io/permalinkify?date=${date}&url=${link.href}`); })()
```

If you find a branch link on GitHub issues, put the cursor selection over it so that it starts inside the link.
Then press the bookmark.

This should locate the timestamp of the message on GitHub, and has fallbacks that can make it work in other locations
where it can find a timestamp inside of the text content or one of the attribute for the link node or any of its parents.

## Limitations
* Only works on main branch
* If the main branch changed since the link was posted, it won't work.
* Uses some random older date as default in case date is not found (might add dialog instead, on GitHub it should always find it though)
* If there are frequent commits around the date, it might pick one that is too early or too late.

## Todo
* Show multiple with dates
* Use date picker (perhaps with datalist of commit info)
* Support other branches (probably hard because the commit endpoint that is used only works on the main branch)
* Attempt to handle change of main branch (could be hard for same reason)
* If lines changed, figure out where they are in the latest version. If the corresponding text object never changed,
it should be possible to get this from the repository, but probably not with the GitHub API.
