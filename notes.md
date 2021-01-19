# Full process

## Preprocess

If starting from an AIMP playlist, remove any lines except for the playlist lines and make sure to convert the file's encoding to UTF-8. Then run `_src/db/import/convertAimpPlaylist.js` to produce output suitable for the next step of the process:

```
cd _src/db/import
node convertAimpPlaylist.js top100.aimppl4 2020 > trackImports
```

This prepares a playlist in the format:

`chart_pos. artist - track_title [country, release_year] ||| chart_year`

For example:

`1. Dead Can Dance - Persephone (The Gathering of Flowers) [AU/UK, 1987] ||| 2016`

Add in the missing bits in this list, e.g. country.

Then run:

`node formatTrackImports.js trackImports > track.bsv`.

Then run:

`node formatTrackCountryImports.js trackImports > track_country.bsv`.

## Import new chart into db

These bsv's need to be imported into the database. (Note: sqlite3.exe doesn't seem to work in the GitBash terminal, use Powershell in Windows.)

```
cd ..
sqlite3.exe .\top100db.db
```

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
SELECT id, artist, title FROM track WHERE chart=2020; // or
SELECT id, artist, title FROM track WHERE link IS NULL OR link="";
.output
```

Use `searchYoutube.js` to find the YouTube links. Run the script and capture the CSV output in a file:

`node ../searchYoutube.js youtube.csv > youtubelinks2020.csv`

Then import the file into the temp table `youtube`:

```
.read createImportTables.sql (if needed)
.mode csv
.import youtubelinks2020.csv youtube
```

Update track table:

```
UPDATE track SET link = (SELECT link FROM youtube yt WHERE yt.id = track.id) WHERE EXISTS (SELECT * FROM youtube WHERE youtube.id = track.id);
```

## Generate served files

```
cd _src
node ./generate.js 2020
```

This outputs the chart csv files in the `_data` folder.

## Publish

Create a new file in `_posts` following the format of the last one.

# Site structure

`_site` is generated content.
`_posts` is where the source content for each article lives.

# Jekyll

Jekyll takes files in `_posts` as input and generates the static HTML under `_site`. To build the site, run:

```
jekyll build
```

To serve locally, run

```
jekyll serve --baseurl=
```

Defaults to `http://localhost:4000`.

To publish, push to branch `gh-pages`.

The templating language is called Liquid and enables those curly percent escapes.

# Scraping notes

Soundcloud

Either https://soundcloud.com/search?q=urbani%20undefined for HTML, which doesn't seem to contain the ID we need, or

https://api-v2.soundcloud.com/search?q=urbani undefined&sc_a_id=ef7c0b3a-650b-4014-bea2-5e12b418e534&variant_ids=&facet=model&user_id=391062-863789-473126-321063&client_id=UytiOw5CoZz7YuKteRrXYZQcGjwGohXl&limit=10&offset=0&linked_partitioning=1&app_version=1515756093&app_locale=en

for the API, if possible. For the latter, a top-level array collection is returned, get collection[0].permalink_url. That looks like:
https://soundcloud.com/slimetime/urbani-undefined-slm167

No, need to get collection[0].uri:
https://api.soundcloud.com/tracks/15031536

Embed with:

<iframe width="100%" height="166" scrolling="no" frameborder="no"
  src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/277326381&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true"></iframe>


Bandcamp

<iframe style="border: 0; width: 100%; height: 120px;"
  src="http://bandcamp.com/EmbeddedPlayer/album=959247280/size=large/bgcol=333333/linkcol=ffffff/tracklist=false/artwork=small/track=2537223362/transparent=true/"
  seamless>
    <a href="http://tqdukg.com/album/ukg">ukg by t q d</a>
</iframe>

Spotify

<iframe src="https://open.spotify.com/embed/track/4kAflSfOBf6Wv5ZD5abUvZ" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
