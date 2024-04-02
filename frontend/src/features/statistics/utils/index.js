// PUBLIC API
// __________

// round percentages so that their sum equals exactly 100%
function roundPercentagesToAddUpTo100(percentages) {
  // calulate total while ignoring decimal parts of percentages
  const total = percentages.reduce(
    (accumulutar, currentValue) => accumulutar + Math.trunc(currentValue),
    0
  );
  // this will indicate how many percentages will have to be rounded up
  const remainder = 100 - total;

  // sort by decimal part descending
  const sortedByDecimalPart = percentages.toSorted((a, b) => getDecimalPart(b) - getDecimalPart(a));

  // truncate decimal parts of percentages
  const truncatedPercentages = sortedByDecimalPart.map((v) => Math.trunc(v));

  // increase truncated percentages that had the largest decimal part
  for (let i = 0; i < remainder; i++) {
    truncatedPercentages[i] = truncatedPercentages[i] + 1;
  }

  // return percentages sorted by value descending
  return truncatedPercentages.toSorted((a, b) => b - a);
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
