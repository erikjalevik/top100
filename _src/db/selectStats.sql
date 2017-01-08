.mode csv
.headers on

.output ../../_data/2005_countries.csv
select tc.country_id as code, c.name, count(tc.track_id) as num_tracks from track t, track_country tc, country c where t.id=tc.track_id and tc.country_id=c.code and t.chart=2005 group by tc.country_id order by num_tracks desc, country_id;

.output ../../_data/2005_years.csv
select release_year, count(id) as num_tracks from track where chart=2005 group by release_year order by num_tracks desc, release_year desc;
