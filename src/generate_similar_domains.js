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
 * @returns {object} - An array of strings representing similar domains.
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

module.exports = { swapCommonTLDs };
