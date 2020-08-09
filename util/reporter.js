const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const generateReport = (formattedData) => {
  // Read template from .hbs file
  const source = fs.readFileSync(
    path.join(__dirname, '../report/lint-report.hbs'),
    'utf8'
  );

  // Compile template using handlebars
  const template = handlebars.compile(source, { strict: true });

  // Inject data to the template
  const report = template(formattedData);

  // Create /reports directory to store the results
  if (!fs.existsSync(path.join(__dirname, '../../../../reports'))) {
    fs.mkdirSync(path.join(__dirname, '../../../../reports'));
  }

  // Store report into a .html file
  fs.writeFileSync(
    path.join(__dirname, '../../../../reports/lint-report.html'),
    report
  );

  return true;
};

module.exports.generateReport = generateReport;
