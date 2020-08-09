const chalk = require("chalk");

function getRuleLink(ruleId) {
  let ruleLink = `http://eslint.org/docs/rules/${ruleId}`;

  if (ruleId === "prettier/prettier") {
    ruleLink = `https://github.com/prettier/eslint-plugin-prettier#options`;
  }

  return ruleLink;
}

function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}

function renderSummary(totalErrors, totalWarnings) {
  const totalProblems = totalErrors + totalWarnings;
  let renderedText = `${totalProblems} ${pluralize("problem", totalProblems)}`;

  if (totalProblems !== 0) {
    renderedText += ` (${totalErrors} ${pluralize(
      "error",
      totalErrors
    )}, ${totalWarnings} ${pluralize("warning", totalWarnings)})`;
  }
  return renderedText;
}

// Renders the source code for the files that have issues and marks the lines that have problems, customised to work with handlebars
function renderSourceCode(sourceCode, messages) {
  const code = [];
  sourceCode.split("\n").map((line, lineNumber) => {
    const codeLine = {};
    codeLine.line = line;
    codeLine.lineNumber = lineNumber + 1;
    messages.map((message) => {
      if (message.line === lineNumber + 1) {
        codeLine.status = message.severity === 1 ? "warning" : "error";
        codeLine.message = message;
      }
      return message;
    });
    code.push(codeLine);
    return line;
  });
  return code;
}

function topWarningsAndErrors(array) {
  // get and set count of the existing rules in result
  array.map((e, index, self) => {
    let count = 1;
    self.filter((el) => {
      if (el.ruleId === e.ruleId) {
        el.count = count++;
      }
      return e;
    });
    return e;
  });

  // reverse array to get max count at top instead of least
  array = array.reverse();

  const noDuplicatesArray = [];

  // remove duplicates and store resulting in a temporary array
  array.map((element, index, self) => {
    if (index === self.findIndex((el) => el.ruleId === element.ruleId)) {
      noDuplicatesArray.push(element);
    }
    return element;
  });
  return noDuplicatesArray;
}

const formatResults = (results) => {
  results = results || [];

  // object format for the formatted data from the results
  const formattedData = {
    data: [],
    errorCount: 0,
    warningCount: 0,
    details: [],
    topWarnings: [],
    topErrors: [],
    failure: false,
  };

  results.map((result) => {
    // get counts of errors and warnings
    formattedData.errorCount += result.errorCount;
    formattedData.warningCount += result.warningCount;
    formattedData.totalErrorsAndWarnings =
      formattedData.warningCount + formattedData.errorCount;

    // change source code to include error and warning messages
    if (result.source) {
      result.code = renderSourceCode(result.source, result.messages);
    }

    // set error messages with error and warning counts
    result.errorMessages = renderSummary(
      result.errorCount,
      result.warningCount
    );

    // set class for view file
    if (result.errorCount === 0 && result.warningCount === 0) {
      result.class = "bg-success";
    } else if (result.errorCount > 0) {
      result.class = "bg-error";
    } else if (result.warningCount > 0 && result.errorCount === 0) {
      result.class = "bg-warning";
    }

    // include rule Links and list based on severity
    result.messages.map((message) => {
      if (message.severity === 1) {
        message.warningType = true;
        message.ruleLink = getRuleLink(message.ruleId);
        formattedData.topWarnings.push(message);
      } else if (message.severity === 2) {
        message.errorType = true;
        message.ruleLink = getRuleLink(message.ruleId);
        formattedData.topErrors.push(message);
      }
      return message;
    });

    return result;
  });

  // remove duplicates and get count of warnings and errors
  formattedData.topWarnings = topWarningsAndErrors(formattedData.topWarnings);
  formattedData.topErrors = topWarningsAndErrors(formattedData.topErrors);

  // to set theme(error or success) of the report
  if (formattedData.errorCount !== 0 || formattedData.warningCount !== 0) {
    formattedData.failure = true;
  }

  // include original data
  formattedData.data = results;

  return formattedData;
};

const getMessage = (formattedData) => {
  let message = "";

  if (formattedData.totalErrorsAndWarnings === 0) {
    message = `${chalk.greenBright(
      "Success"
    )} : No errors (or) warnings in source code`;
  } else {
    message = `${chalk.redBright("Error")} : ${
      formattedData.errorCount
    } errors and ${
      formattedData.warningCount
    } warnings found by linter \n------------------------------------------\nCheck ${chalk.yellowBright(
      "/reports/lint-report.html"
    )} for further details`;
  }

  return message;
};

module.exports.formatResults = formatResults;
module.exports.getMessage = getMessage;
