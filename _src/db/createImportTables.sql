CREATE TEMP TABLE trackimp (
  artist       VARCHAR,
  title        VARCHAR,
  release_year INTEGER,
  chart        INTEGER,
  chart_pos    INTEGER
);

CREATE TEMP TABLE poscountryimp (
  chart        INTEGER,
  chart_pos    INTEGER,
  country      CHARACTER(2)
);

CREATE TEMP TABLE youtube (
  id     INTEGER,
  artist VARCHAR,
  title  VARCHAR,
  link   VARCHAR
);
