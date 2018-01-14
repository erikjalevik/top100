# Full process

## Preprocess

If starting from an AIMP playlist, remove any lines except for the playlist lines and make sure to convert the file's encoding to UTF-8. Then modify the constants at the top of `convertAimpPlaylist.js` and run it to produce output suitable for the next step of the process.

Prepare a playlist in the format:

`chart_pos. artist - track_title [country, release_year] ||| chart_year`

For example:

`1. Dead Can Dance - Persephone (The Gathering of Flowers) [AU/UK, 1987] ||| 2016`

Then run `formatTrackImports.js` over it capturing the output as `track.bsv`.
Then run `formatCountryTrackImports.js` over it capturing the output as `track_country.bsv`.

## Import new chart into db

These bsv's need to be imported into the database.
Run `.read createImportTables.sql`.
Set separator to backslash: `.separator \`.
Run `.import import/track.bsv trackimp`

Run `.import import/track_country.bsv trackcountryimp`

Insert all entries from `trackimp` into `track`.
```
INSERT INTO track (artist, title, release_year, chart, chart_pos) SELECT artist, title, release_year, chart, chart_pos FROM trackimp;
```

Insert all entries from `trackcountryimp` into `track_country`.
```
INSERT INTO track_country (track_id, country_id) SELECT t.id, i.country FROM track t, trackcountryimp i WHERE i.chart=t.chart AND i.chart_pos=t.chart_pos;
```

## Add YouTube links

First export tracks from the db including their ID to a file, format `id,artist,title`.

```
.mode csv
.output youtube.csv
SELECT id, artist, title FROM track WHERE chart=2017; // or
SELECT id, artist, title FROM track WHERE link IS NULL OR link="";
.output
```

Modify the input file at the top of `searchYoutube.js` so that INPUT_FILE points to the file generated above.

Run the script and capture the CSV output in a file. Then import the file into the temp table `youtube`:

```
.import youtubelinks2017.csv youtube
```

Update track table:

```
UPDATE track SET link = (SELECT link FROM youtube yt WHERE yt.id = track.id) WHERE EXISTS (SELECT * FROM youtube WHERE youtube.id = track.id);
```

## Generate served files

```
cd _src
node ./generate.js 2017
```

This outputs the chart csv files in the `_data` folder.

## Publish

Create a new file in `_posts` following the format of the last one.

# Site structure

`_site` is generated content.
`_posts` is where the source content for each article lives.

# How to scrape YouTube for links

Search through `www.youtube.com/results?search_query=query`.
Find `yt-uix-tile-link`.
Track back to previous `href`.
Check if it starts with `/watch`.

# Jekyll

Jekyll takes files in `_posts` as input and generates the static HTML under `_site`. To build the site, run:

```
jekyll build
```

To server locally, run

```
jekyll serve
```

Defaults to `http://localhost:4000`.

The templating language is called Liquid and enables those `{% %}` escapes.