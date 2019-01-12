// This file takes an AIMP playlist file in format aimppl4 and spits out
// a list in the format accepted by formatTrackImports.js.

const INPUT_FILE = '2018.aimppl4';
const CHART_YEAR = '2018';

const fs = require('fs');
const readline = require('readline');

var reader = readline.createInterface({
  input: fs.createReadStream(INPUT_FILE),
  output: process.stdout,
  terminal: false
})

let chartPos = 0;
reader.on('line', function(line) {
  chartPos += 1;
  const t = parseAimpTrack(line);
  if (t) {
    var outLine = `${chartPos}. ${t.artist} - ${t.title} [, ${t.releaseYear}] ||| ${CHART_YEAR}`;
    console.log(outLine);
  }
});

function parseAimpTrack(line) {
  // Ignores blank lines when file is in Windows format
  if (line.length < 2) return undefined;

  const t = line.split('|');
  const path = t[0];
  const title = t[1];
  const artist = t[2];
  const album = t[3];
  const albumArtist = t[4];
  const genre = t[5];
  const releaseYear = t[6].substr(0, 4);
  const chartPos = parseInt(t[18], 10) + 1;

  return {
    chartPos,
    artist,
    title,
    releaseYear
  }
}
