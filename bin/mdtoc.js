#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { program } = require('commander');
const { toc, inject } = require('../lib');
const pkg = require('../package.json');

program
  .name('mdtoc')
  .version(pkg.version)
  .argument('<file>', 'Markdown file')
  .option('-i, --in-place', 'write the TOC between <!-- toc --> markers')
  .option('--min <n>', 'minimum heading depth', Number, 1)
  .option('--max <n>', 'maximum heading depth', Number, 6)
  .option('-b, --bullet <char>', 'list bullet', '-')
  .action((file, opts) => {
    const src = fs.readFileSync(file, 'utf8');
    const options = { minDepth: opts.min, maxDepth: opts.max, bullet: opts.bullet };
    if (opts.inPlace) {
      fs.writeFileSync(file, inject(src, options));
    } else {
      process.stdout.write(toc(src, options) + '\n');
    }
  });

program.parse();
