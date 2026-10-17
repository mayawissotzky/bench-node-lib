'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { toc, inject } = require('../lib');

const doc = '# Title\n\n## Install\n\n```\n# not a heading\n```\n\n## Usage\n\n### Options\n\n## Usage\n';

test('builds nested toc with unique slugs', () => {
  assert.strictEqual(
    toc(doc, { minDepth: 2 }),
    '- [Install](#install)\n- [Usage](#usage)\n  - [Options](#options)\n- [Usage](#usage-1)'
  );
});

test('injects between markers', () => {
  const out = inject('# A\n<!-- toc -->\nold\n<!-- tocstop -->\n## B\n');
  assert.match(out, /<!-- toc -->\n\n- \[A\]\(#a\)\n  - \[B\]\(#b\)\n\n<!-- tocstop -->/);
});
