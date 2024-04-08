// PUBLIC API
// __________

// round percentages so that their sum equals exactly 100%
function roundPercentagesToAddUpTo100(stats) {
  // calulate total while ignoring decimal parts of percentages
  const totalOfTruncatedPercentages = stats.reduce(
    (accumulutar, currentEntry) => accumulutar + Math.trunc(currentEntry.percent),
    0
  );
  // this will indicate how many percentages will have to be rounded up
  const remainder = 100 - totalOfTruncatedPercentages;

  // sort by decimal part descending
  const sortedByDecimalPart = stats.toSorted(
    (a, b) => getDecimalPart(b.percent) - getDecimalPart(a.percent)
  );

  // truncate decimal parts of percentages
  const truncatedPercentages = sortedByDecimalPart.map((v) => ({
    ...v,
    percent: (v.percent = Math.trunc(v.percent)),
  }));

  // increment truncated percentages that had the largest decimal part
  for (let i = 0; i < remainder; i++) {
    truncatedPercentages[i].percent++;
  }

  // return percentages sorted by value descending
  return truncatedPercentages;
}

// PRIVATE FUNCTIONS
// _________________
function getDecimalPart(number) {
  let numberString = number.toString();
  let decimalSeparator;
  if (numberString.indexOf('.') !== -1) {
    decimalSeparator = '.';
  } else if (numberString.indexOf(',') !== -1) {
    decimalSeparator = ',';
  }

  if (!decimalSeparator) {
    return 0;
  }
  return Number('0.' + numberString.split(decimalSeparator)[1]);
}

export { roundPercentagesToAddUpTo100 };
