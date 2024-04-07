const TLDS = [
  "com",
  "net",
  "org",
  "de",
  "icu",
  "uk",
  "ru",
  "info",
  "top",
  "xyz",
  "tk",
  "cn",
  "ga",
  "cf",
  "nl"
];

/*
 * Creates a list of variants of a given domain with its TLD swapped out.
 *
 * @param {string} domain - The input domain string.
 * @returns {strings[]} - An array of strings representing the original domain with different TLDs.
 * */
function swapCommonTLDs(domain) {
  const [domainName, tld] = domain.split('.');
  const result = [];
  for (let altTLD of TLDS) {
    const newDomain = `${domainName}.${altTLD}`
    if (newDomain !== domain) {
      result.push(newDomain);
    }
  }
  return result;
}

function swapDomainLetters(domain) {
  const [domainName, tld] = domain.split('.');
}

/*
 * Creates a list of variants of a given domain with individual chars deleted.
 *
 * @param {string} domain - The input domain string.
 * @returns {strings[]} - An array of strings representing the domain variations.
 * */
function deleteDomainChars(domain) {
  const [domainName, tld] = domain.split('.');
  const result = [];
  const resultSet = new Set(); // avoid duplicates
  for (let i = 0; i < domainName.length; i++) {
    if (i === 0) {
      const newDomain = domainName.slice(1, domainName.length) + '.' + tld;
      if (!resultSet.has(newDomain)) {
        result.push(newDomain);
        resultSet.add(newDomain);
      }
    }
    else if (i === domainName.length - 1) {
      const newDomain = domainName.slice(0, i) + '.' + tld;
      if (!resultSet.has(newDomain)) {
        result.push(newDomain);
        resultSet.add(newDomain);
      }
    } else {
      const newDomain = domainName.slice(0, i) + domainName.slice(i + 1, domainName.length) + '.' + tld;
      if (!resultSet.has(newDomain)) {
        result.push(newDomain);
        resultSet.add(newDomain);
      }
    }
  }
  return result;
}

module.exports = { swapCommonTLDs, deleteDomainChars };
