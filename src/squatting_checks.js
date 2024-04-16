const dns = require('dns');
require('dotenv').config();

const { swapCommonTLDs, deleteDomainChars } = require('./generate_similar_domains');
const { getSearchResultDomains } = require('./search_result_comparison');
const { compareIcons } = require('./icon_check');

async function getURLResponseCode(url) {
  const response = await fetch(url);
  return response.status;
}

/*
 * Does a DNS lookup of a given domain, and returns 
 * the associated IP, or null if nothing comes up.
 * @param {string} domain - domain to be looked up
 * @returns {string | null } - IP string of lookup result or null
 * */
async function dnsLookup(domain) {
  try {
    const results = await dns.promises.lookup(domain);
    return results.address;
  } catch (error) {
    return null;
  }
}

async function fullSquattingCheck(domains, keywords) {
  const rawDomain = domains[0];

  let domain;

  if (rawDomain.startsWith('http://') || rawDomain.startsWith('https://')) {
    domain = new URL(rawDomain).host;
  } else {
    domain = new URL('http://' + rawDomain).host;
  }

  const result = []; // return value, only records with URLS that don't 404
  const allRecords = []; // stores all records, even those that 404

  const tldSwaps = swapCommonTLDs(domain);
  const charDeletions = deleteDomainChars(domain);

  for (let tldSwap of tldSwaps) {
    allRecords.push({
      domain: tldSwap,
      ipAddress: '',
      urlConstruction: 'New TLD',
      category: 'unknown',
      logoDetected: false,
      detectedInSearch: false,
      riskLevel: 1,
      redirectToOriginal: false
    });
  }

  for (let charDeletion of charDeletions) {
    allRecords.push({
      domain: charDeletion,
      ipAddress: '',
      urlConstruction: 'Character deletion',
      category: 'unknown',
      logoDetected: false,
      detectedInSearch: false,
      riskLevel: 1,
      redirectToOriginal: false
    });
  }

  for (let record of allRecords) {
    const ip = await dnsLookup(record.domain);
    if (ip !== null) {
      record.ipAddress = ip;
      result.push(record);
    }
  }

  // Check search engine for other associated with original domain
  const fullDomainSearch = await getSearchResultDomains(domain);
  const domainNameSearch = await getSearchResultDomains(domain.split('/')[0]);

  for (let record of result) {
    record.logoDetected = await compareIcons(domain, record.domain);
    record.detectedInSearch = fullDomainSearch.has(record.domain) || domainNameSearch.has(record.domain);

    if (record.logoDetected && record.detectedInSearch) {
      record.riskLevel = 5;
    } else if (record.logoDetected) {
      record.riskLevel = 2;
    } else if (record.detectedInSearch) {
      record.riskLevel = 2;
    }
  }
  
  return result;
}

if (require.main === module) {
  (async () => {
    const results = await fullSquattingCheck(['google.net'], ['google']);
    console.log(results);
  })();
}

module.exports = { getURLResponseCode, dnsLookup, fullSquattingCheck };
