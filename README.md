# permalinkify

It happens to all of us. We (or somebody else) copy a link from GitHub, but forget to use a permalink.
An arbitrary amount of commits later, we stumble on this link, and scramble to find the lines being linked.
Especially annoying if the file was removed.

Use this to locate the last commit on the main branch before the date of the message you found the link in.

## [inwerpsel.github.io/permalinkify](https://inwerpsel.github.io/permalinkify)

Todo:
* Show multiple with dates
* Use date picker (perhaps with datalist of commit info)
* As a bookmarklet
* Support other branches (probably hard because the commit endpoint that is used only works on the main branch)
* Attempt to handle change of main branch (could be hard for same reason)
* If lines changed, figure out where they are in the latest version. If the corresponding text object never changed,
it should be possible to get this from the repository, but probably not with the GitHub API.
