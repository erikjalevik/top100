DROP TABLE track;
DROP TABLE country;
DROP TABLE genre;
DROP TABLE track_country;

CREATE TABLE track (
  id           INTEGER PRIMARY KEY,
  artist       VARCHAR NOT NULL,
  title        VARCHAR NOT NULL,
  release_year INTEGER,
  genre_id     INTEGER,
  chart        INTEGER NOT NULL,
  chart_pos    INTEGER NOT NULL,
  link         VARCHAR,
  FOREIGN KEY(genre_id) REFERENCES genre(id)
);

CREATE TABLE country (
  sort_order     INTEGER,
  name           VARCHAR NOT NULL,
  formal_name    VARCHAR,
  type           VARCHAR,
  sub_type       VARCHAR,
  sovereignty    VARCHAR,
  capital        VARCHAR,
  currency_code  VARCHAR,
  currency_name  VARCHAR,
  telephone_code VARCHAR,
  code           CHARACTER(2) PRIMARY KEY,
  code3          CHARACTER(3),
  code_number    INTEGER,
  iana_code      VARCHAR
);

CREATE TABLE genre (
  id   INTEGER PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE track_country (
  id         INTEGER PRIMARY KEY,
  track_id   INTEGER NOT NULL,
  country_id CHARACTER(2) NOT NULL,
  FOREIGN KEY(track_id) REFERENCES track(id),
  FOREIGN KEY(country_id) REFERENCES country(code)
);
