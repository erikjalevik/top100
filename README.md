# top100

https://erikjalevik.github.io/top100/

A website for hosting my yearly top 100 tracks.

## Development

To run the development server:

```
jekyll serve --baseurl=
```

View at `localhost:4000` in the browser.

The empty `--baseurl` is necessary since otherwise the base URL specified in `_config.yml`, which is needed for the deployed GitHub Pages site to work, will lead to broken paths when using the development server.

## Deployment

To build the site, run:

```
jekyll build
```

Then push to branch `gh-pages`.
