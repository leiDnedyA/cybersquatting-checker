const dns = require('dns');
require('dotenv').config();

// /**
//  * @typedef {Object} WHOISRecord
//  * @property {number} x - The X Coordinate
//  * @property {number} y - The Y Coordinate
//  */
//
// /*
//  * Performs a WHOIS lookup on the given domain. Returns an object 
//  * with information about the domain if it exists, or undefined if it doesn't.
//  * -  Node: use this SPARINGLY, as API calls can get pricey.
//  *
//  * @param {string} domain - The domain to be looked up
//  * @returns {WHOISRecord | undefined} - Relevant data from the record returned by the lookup
//  * */
// async function whoisLookup(domain) {
//   if (process.env.X_RAPIDAPI_KEY === undefined) {
//     throw new Error('Environment variable "X_RAPIDAPI_KEY" must be declared with valid X-RapidAPI key to run this function.');
//   }
//   if (process.env.WHOIS_API_KEY === undefined) {
//     throw new Error('Environment variable "WHOIS_API_KEY" must be declared with valid WHOIS XML API key to run this function.');
//   }
//   const options = {
//     method: 'GET',
//     url: 'https://whoisapi-dns-lookup-v1.p.rapidapi.com/whoisserver/DNSService',
//     params: {
//       domainname: domain,
//       type: 'A',
//       apiKey: process.env.WHOIS_API_KEY,
//       outputFormat: 'JSON'
//     },
//     headers: {
//       'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
//       'X-RapidAPI-Host': 'whoisapi-dns-lookup-v1.p.rapidapi.com'
//     }
//   };
//
//   try {
//     const response = await axios.request(options);
//     console.log(response.data);
//
//     if (response.data.hasOwnProperty('dataError')) {
//       return undefined;
//     }
//
//     const result = {};
//
//     if (response.data.hasOwnProperty('registrant')) {
//       if (response.data.registrant.hasOwnProperty('organization')) {
//         result.name = response.data.registrant.organization;
//       } else if (response.data.registrant.hasOwnProperty('name')) {
//         result.name = response.data.registrant.name;
//       }
//     }
//
//     return result;
//
//   } catch (error) {
//     console.error(error);
//   }
// }

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

module.exports = { getURLResponseCode, dnsLookup };
