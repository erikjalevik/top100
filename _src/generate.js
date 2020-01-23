// This script generates the chart data files in _data. Usage:
//
// node generate.js 2017 2016 ...
//
// to generate charts for specific years, or:
//
// node generate.js all
//
// to generate all charts.

const { exec } = require('child_process');

// Constants

const ALL_YEARS = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016, 2017, 2018];
const DB_NAME = './db/top100db.db';

// Argument parsing

if (process.argv.length < 3) {
  console.error('Missing arguments, specify the years that should be generated.');
  process.exit();
}

const args = process.argv.slice(2);
const years = (args[0] === 'all') ? ALL_YEARS : args;

// Helper function to execute select statements

function execSql(selects, year) {

  const sqliteOptions = '".mode csv" ".headers on"';

  for (const select of selects) {
    const selectStatement = select[0].replace('[year]', year);
    const outFile = select[1].replace('[year]', year);

    exec(`sqlite3 ${DB_NAME} ${sqliteOptions} "${selectStatement}" > ${outFile}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        process.exit();
      }
    });
  }
}

// Select statements for yearly charts

const selectChart = "SELECT chart_pos, artist, title, release_year, group_concat(country_id, '/') AS country, link " +
  "FROM track t, track_country tc " +
  "WHERE t.id=tc.track_id AND chart=[year] " +
  "GROUP BY t.id " +
  "ORDER BY chart_pos DESC;";

const selectCountries = "SELECT tc.country_id AS code, c.name, count(tc.track_id) AS num_tracks " +
  "FROM track t, track_country tc, country c " +
  "WHERE t.id=tc.track_id AND tc.country_id=c.code AND t.chart=[year] " +
  "GROUP BY tc.country_id " +
  "ORDER BY num_tracks DESC, country_id;";

const selectYears = "SELECT release_year, count(id) AS num_tracks " +
  "FROM track " +
  "WHERE chart=[year] " +
  "GROUP BY release_year " +
  "ORDER BY num_tracks DESC, release_year DESC;";

const selects = [
  [selectChart, '../_data/[year].csv'],
  [selectCountries, '../_data/[year]_countries.csv'],
  [selectYears, '../_data/[year]_years.csv']
];

for (const year of years) {
  execSql(selects, year);
}

// Select statements for overall charts

const selectOverallCountries = "SELECT tc.country_id AS code, c.name, count(tc.track_id) AS num_tracks " +
  "FROM track_country tc, country c " +
  "WHERE tc.country_id=c.code " +
  "GROUP BY tc.country_id " +
  "ORDER BY num_tracks DESC, country_id;";

const selectOverallYears = "SELECT release_year, count(id) AS num_tracks FROM track " +
  "GROUP BY release_year " +
  "ORDER BY num_tracks DESC, release_year DESC;";

const overallSelects = [
  [selectOverallCountries, '../_data/countries.csv'],
  [selectOverallYears, '../_data/years.csv']
];

execSql(overallSelects);
