.mode csv
.headers on

.output ../../_data/countries.csv
select tc.country_id as code, c.name, count(tc.track_id) as num_tracks from track_country tc, country c where tc.country_id=c.code group by tc.country_id order by num_tracks desc, country_id;

.output ../../_data/years.csv
select release_year, count(id) as num_tracks from track group by release_year order by num_tracks desc, release_year desc;
