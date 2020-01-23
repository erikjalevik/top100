#!/usr/bin/env node

// This script reads a file containing a chart, parsing each line,
// and outputs the result to stdout as a backslash-separated values file.
//
// The order is artist, title, releaseYear, chart, chartPos.

const INPUT_FILE = process.argv[2];

const fs = require('fs');
const readline = require('readline');

const parseTrack = require('./parseTrack');

var reader = readline.createInterface({
  input: fs.createReadStream(INPUT_FILE),
  output: process.stdout,
  terminal: false
})

reader.on('line', function(line) {
  const t = parseTrack(line);

  var trackCountryArray = t.countries.map(function(country) {return [t.chart, t.chartPos, country]})
  trackCountryArray.map(function(entry) {
    var outLine = entry.join('\\')
    console.log(outLine)
    return true;
  })
})
