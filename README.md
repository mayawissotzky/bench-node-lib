# mdtoc-lite

Generate a table of contents for Markdown files. Small, no config.

## Install

```sh
npm install -g mdtoc-lite
```

## Usage

```sh
mdtoc README.md            # print the TOC
mdtoc -i README.md         # write it between <!-- toc --> and <!-- tocstop -->
mdtoc --min 2 --max 3 docs/guide.md
```

From code:

```js
const { toc, inject } = require('mdtoc-lite');
console.log(toc(fs.readFileSync('README.md', 'utf8')));
```

Slugs follow GitHub's anchor rules; duplicates get `-1`, `-2` suffixes.
Headings inside fenced code blocks are skipped.

## Releasing

Maintainers run `npm run release`, which generates the changelog, tags and pushes.
The tag triggers the Release workflow, which publishes to npm with provenance.

## License

MIT
