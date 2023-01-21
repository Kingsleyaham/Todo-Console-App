function removeQuotesAroundString(str = "") {
  const startQuote = str.charAt(0) === '"' || str.charAt(0) === "'";
  const endQuote =
    str.charAt(str.length - 1) === '"' || str.charAt(str.length - 1) === "'";

  if (str && str.length >= 2 && startQuote && endQuote) {
    const sanitizedString = str.substring(1, str.length - 1);

    return sanitizedString;
  }

  return str;
}

const remove = removeQuotesAroundString("'ada is a girl'");
console.log(remove);
