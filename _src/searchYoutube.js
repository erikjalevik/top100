#!/usr/bin/env node

// Run this and capture the output in a file
// Import file into temp table youtube:
//   .import ../youtube2016.csv youtube
// Update track table:
//  update track
//  set link = (select link from youtube yt
//              where yt.id = track.id)

var fs = require('fs'),
    readline = require('readline')

var parse = require('csv-parse/lib/sync');

var fetch = require('node-fetch');

const urly = require('url');

var reader = readline.createInterface({
    input: fs.createReadStream('../_data/2016one.csv'),
    output: process.stdout,
    terminal: false
})

reader.on('line', function(line) {
  const a = parse(line)[0]
  const id = a[0]
  const artist = a[1]
  const title = a[2]
  const searchString = artist + ' ' + title

  const url = new urly.URL("http://www.youtube.com/results")
  const params = {search_query:searchString}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  fetch(url.href).then(result => {
    return result.text()
  }).then(result => {
    var firstTileIdx = result.indexOf('yt-uix-tile-link')

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

    console.log(id + ',"' + artist + '","' + title + '",' + yid2)
  })

})
