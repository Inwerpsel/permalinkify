# permalinkify

It happens to all of us. We (or somebody else) copy a link from GitHub, but forget to use a permalink.
An arbitrary amount of commits later, we stumble on this link, and scramble to find the lines being linked.
Especially annoying if the file was removed.

Use this to locate the last commit on the main branch before the date of the message you found the link in.

## [inwerpsel.github.io/permalinkify](https://inwerpsel.github.io/permalinkify)

## Bookmarklet
Create a new bookmark with any name (e.g. "⛓permalinkify" or just "⛓" for maximal compactness),
and the entire contents of [bookmarklet.js](https://github.com/Inwerpsel/permalinkify/blob/main/bookmarklet.js) as the URL (needs the `javascript:` at the start to work as bookmarklet).

If you find a branch link on GitHub issues, put the cursor selection over it so that it starts inside the link.
Then press the bookmark.

This should locate the timestamp of the message on GitHub, and has fallbacks that can make it work in other locations
where it can find a timestamp inside of the text content or one of the attribute for the link node or any of its parents.

## Limitations
* Only works on main branch (might work to some extent on other branches)
* If there are frequent commits around the date, it might pick one that is too early or too late.
You can try changing the date value but it's still tricky.
Will be resolved by showing a list of commits.

## Examples
[July 2018 issue comment on the React repo](https://github.com/facebook/react/issues/13206#issuecomment-404950040)


## Todo
* Show multiple with dates
* Use date picker (perhaps with datalist of commit info)
* Support other branches (probably hard because the commit endpoint that is used only works on the main branch)
* If lines changed, figure out where they are in the latest version. If the corresponding text object never changed,
it should be possible to get this from the repository, but probably not with the GitHub API.
