const formatter = require('./util/formatter');
const reporter = require('./util/reporter');

// export function that takes results and handles formatter
module.exports = (results) => {
  // Get formatted data from the eslint results
  const formattedData = formatter.formatResults(results);

  // Generate the html report for the linter
  reporter.generateReport(formattedData);

  // Get the console message to print feedback to the user
  const message = formatter.getMessage(formattedData);

  return message;
};
