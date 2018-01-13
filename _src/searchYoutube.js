#!/usr/bin/env node

// This file reads through a CSV file of tracks and writes their YouTube embeds to stdout.

const INPUT_FILE = './db/withoutLinks.csv';

const fs = require('fs');
const stream = require('stream');
const urly = require('url');
const parse = require('csv-parse/lib/sync');
const fetch = require('node-fetch');

const split = new stream.Transform({
  transform(chunk, encoding, done) {
    const lines = chunk.toString().split('\r\n');
    for (const l of lines) {
      this.push(l);
    }
    done();
  }
})

const delay = (millis) => new stream.Transform({
  transform(chunk, encoding, done) {
    setTimeout(() => {
      this.push(chunk);
      done();
    }, millis);
  }
});

function makeSearchUrl(artist, title) {
  const searchString = artist + ' ' + title
  const url = new urly.URL("http://www.youtube.com/results")
  const params = {search_query:searchString}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return url;
}

function scrapeId(result) {
  const firstTileIdx = result.indexOf('yt-uix-tile-link')
  const before = result.substr(0, firstTileIdx)
  const hrefIdx = before.lastIndexOf('href')
  const href = before.substr(hrefIdx)
  const watchIdx = href.indexOf('="')
  // watch?v=
  const yid = href.substr(watchIdx + 11)
  var closeIdx = yid.indexOf('&')
  if (closeIdx == -1) {
    closeIdx = yid.indexOf('"')
  }
  const yid2 = yid.substr(0, closeIdx)
  return yid2;
}

const lookup = new stream.Transform({
  transform(line, encoding, done) {
    line = line.toString();
    if (line.startsWith('chart_pos') || line.length === 0) done();

    const a = parse(line)[0]
    const id = a[0]
    const artist = a[1]
    const title = a[2]

    const url = makeSearchUrl(artist, title);

    // TODO: Could make this into a stream as well if using the request lib instead of fetch
    fetch(url.href).then(result => {
      return result.text()
    }).then(result => {
      const yid = scrapeId(result);
      const output = id + ',"' + artist + '","' + title + '",https://www.youtube.com/embed/' + yid + '\r\n';
      this.push(output);
      done();
    })
  }
});

fs.createReadStream(INPUT_FILE)
  .pipe(split)
  .pipe(delay(500))
  .pipe(lookup)
  .pipe(process.stdout);
