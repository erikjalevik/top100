#!/usr/bin/env node

// This script reads a file containing a chart, parsing each line,
// and outputs the result to stdout as a backslash-separated values file.
//
// The order is artist, title, releaseYear, chart, chartPos.

const INPUT_FILE = '2018.txt';

const fs = require('fs');
const readline = require('readline');

const parseTrack = require('./parseTrack');

var reader = readline.createInterface({
  input: fs.createReadStream(INPUT_FILE, {encoding: "utf8"}),
  output: process.stdout,
  terminal: false
})

reader.on('line', function(line) {
  const t = parseTrack(line);

  var trackArray = [t.artist, t.title, t.releaseYear, t.chart, t.chartPos];
  var outLine = trackArray.join('\\');
  console.log(outLine);
});
