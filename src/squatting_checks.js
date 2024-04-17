const dns = require('dns');
require('dotenv').config();

const { swapCommonTLDs, deleteDomainChars } = require('./generate_similar_domains');
const { getSearchResultDomains } = require('./search_result_comparison');
const { compareIcons } = require('./icon_check');
const { parseDomain } = require('./utils');

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

async function checkSingleDomain(rawDomain) {
  let domain = parseDomain(rawDomain);

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
    console.log(`Checking ${record.domain} icon and ${domain}`)
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

async function checkKeyword(keyword, whitelistedDomains) {
  const queryResults = await getSearchResultDomains(keyword);
  for (let domain of whitelistedDomains) {
    if (queryResults.has(domain)) {
      queryResults.delete(domain);
    }
  }
  const results = [];
  for (let domain of queryResults) {
    let logoDetected = false;
    for (let whitelistedDomain of whitelistedDomains) {
      if (compareIcons(whitelistedDomain, domain)) {
        logoDetected = true;
        break;
      }
    }
    const result = {
      domain: domain,
      ipAddress: '',
      urlConstruction: 'Found in search',
      category: 'unknown',
      logoDetected: logoDetected,
      detectedInSearch: true,
      riskLevel: 2,
      redirectToOriginal: false
    };
    if (result.logoDetected) {
      result.riskLevel = 5;
    }
    const ip = await dnsLookup(result.domain);
    if (ip !== null) {
      result.ipAddress = ip;
      results.push(result);
    }
  }
  return results;
}

async function fullSquattingCheck(domains, keywords) {
  const results = [];
  const seenDomains = new Set();
  for (let domain of domains) {
    const domainResult = await checkSingleDomain(domain);
    for (let result of domainResult) {
      if (seenDomains.has(result.domain)) {
        continue;
      }
      seenDomains.add(result.domain)
      results.push(result);
    }
  }
  for (let keyword of keywords) {
    const keywordResults = await checkKeyword(keyword, domains);
    for (let result of keywordResults) {
      if (seenDomains.has(result.domain)) {
        continue;
      }
      seenDomains.add(result.domain)
      results.push(result);
    }
  }
  return results;
}

if (require.main === module) {
  (async () => {
    const results = await fullSquattingCheck(['google.net'], ['google']);
    console.log(results);
  })();
}

module.exports = { getURLResponseCode, dnsLookup, fullSquattingCheck };
