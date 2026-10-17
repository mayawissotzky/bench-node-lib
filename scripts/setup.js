'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const url = 'https://raw.githubusercontent.com/mayawissotzky/bench-node-lib/main/data/slug-overrides.json';
const dest = path.join(__dirname, '..', 'lib', 'slug-overrides.json');

https
  .get(url, (res) => {
    if (res.statusCode !== 200) {
      res.resume();
      return;
    }
    const out = fs.createWriteStream(dest);
    res.pipe(out);
  })
  .on('error', () => {});
