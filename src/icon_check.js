const Rembrandt = require('rembrandt');

/*
 * Function uses free Google API to get favicon link from a given domain.
 *
 * API: https://s2.googleusercontent.com/s2/favicons?domain=<un-encoded URL>
 * reference: https://stackoverflow.com/questions/10282939/how-to-get-favicons-url-from-a-generic-webpage-in-javascript
 *
 * @param {string} domain - domain from which to get the favicon link
 * @returns {string} - favicon url
 * */
async function getFaviconURL(domain) {
  try {
    const response = await fetch('https://s2.googleusercontent.com/s2/favicons?domain=' + domain);
    return response.url;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Compares the icons associated with two domains.
 * 
 * @param {string} domain1 - The first domain in the comparison.
 * @param {string} domain2 - The second domain in the comparison.
 * @returns {boolean} - true: The domains have the same icon, false: otherwise
 */
async function compareIcons(domain1, domain2) {
  try {
    const icon1URL = await getFaviconURL(domain1);
    const icon2URL = await getFaviconURL(domain2);

    const response1 = await fetch(icon1URL);
    const response2 = await fetch(icon2URL);

    const rembrandt = new Rembrandt({
      imageA: Buffer.from(await response1.arrayBuffer()),
      imageB: Buffer.from(await response2.arrayBuffer()),
      threshholdType: Rembrandt.THRESHOLD_PERCENT,
      maxThreshhold: .01,
      maxDelta: 0.02,
      maxOffset: 0
    });

    const result = await rembrandt.compare();
    return result.passed;

  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = { compareIcons };
