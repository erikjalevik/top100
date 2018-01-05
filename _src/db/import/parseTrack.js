function parseTrack(line) {

  var firstDotIdx = line.indexOf('.')
  var chartPos = parseInt(line.slice(0, firstDotIdx))

  line = line.substr(firstDotIdx + 2)
  var firstDashIdx = line.indexOf(' - ')
  var artist = line.slice(0, firstDashIdx)

  line = line.substr(firstDashIdx + 3)
  var openBracketIdx = line.indexOf(' [')
  var title = line.slice(0, openBracketIdx)

  line = line.substr(openBracketIdx + 2)
  var firstCommaIdx = line.indexOf(',')
  var countries = line.slice(0, firstCommaIdx)
  countries = countries.split('/')

  line = line.substr(firstCommaIdx + 2)
  var closeBracketIdx = line.indexOf(']')
  var releaseYear = parseInt(line.slice(0, closeBracketIdx))

  line = line.substr(closeBracketIdx + 5)
  var chart = parseInt(line)

  return {
    chartPos,
    artist,
    title,
    countries,
    releaseYear,
    chart
  }
}

module.exports = parseTrack;
