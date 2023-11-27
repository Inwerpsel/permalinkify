# permalinkify

It happens to all of us. We (or somebody else) copy a link from GitHub, but forget to use a permalink.
An arbitrary amount of commits later, we stumble on this link, and scramble to find the lines being linked.

It shouldn't be too hard (🤞) to take such a link, plus a date, and give us a permalink for it with the commit hash at that time.

Todo:
* Implement this by fetching the right data from the GitHub API (or remove this repo if somebody has already made this)
* Bonus points: figure out where those lines are in the latest version. If the corresponding text object never changed,
it should be possible to get this from the repository, but probably not with the GitHub API.
