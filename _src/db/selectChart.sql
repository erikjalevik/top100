.mode csv
.headers on
.output ../../_data/2016.csv
select chart_pos, artist, title, release_year, group_concat(country_id, '/') as country from track t, track_country tc where t.id=tc.track_id and chart=2016 group by t.id order by chart_pos desc;
