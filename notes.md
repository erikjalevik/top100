# Full process

Prepare a playlist in the format:

`chart_pos. artist - track_title [country, release_year] ||| chart_year`

For example:

`1. Dead Can Dance - Persephone (The Gathering of Flowers) [AU/UK, 1987] ||| 2016`

Then run `formatTrackImports.js` over it capturing the output as `track.bsv`.
Then run `formatCountryTrackImports.js` over it capturing the output as `track_country.bsv`.

These bsv's needs to be imported into the database.
Run `createImportTables.sql`.
Set separator to backslash.
Run `.import track.bsv trackimp`
Insert all entries from `trackimp` into `track`.

```
INSERT INTO track SELECT * FROM trackimp;
```

Run `.import track_country.bsv trackcountryimp`
Insert all entries from `trackcountryimp` into `track_country`.

Open `selectChart.sql` and edit output file to current year.
Run it.
That produces the chart file in `_data` which is used by the site.

Open `selectStats.sql` and edit output file to current year.
Run it.
That produces the stat files for countries and years in `_data`.

Run `selectOverallStats.sql`.
That produces the stat files for overall countries and years in `_data`.

Add YouTube links by modifying the input file at the top of `searchYoutube.js`. TODO: output whole link and modify `_includes/track.html` to use it as is.
Run it and follow the instructions at the top of the file.

Create a new file in `_posts` following the format of the last one.

# Site structure

`_site` is generated content.
`_posts` is where the source content for each article lives.

# How to scrape YouTube for links

Search through `www.youtube.com/results?search_query=query`.
Find `yt-uix-tile-link`.
Track back to previous `href`.
Check if it starts with `/watch`.
