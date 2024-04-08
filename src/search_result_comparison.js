const { JSDOM } = require('jsdom');

// Used to avoid being blocked by google search
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36" 
];

function randomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/*
 * Returns all of the domains that come up on the first page of Google for a
 * given query.
 *
 * @param {string} query - The query to be passed to Google
 * @returns {Set<string>} - The set of domains found in search results
 * */
async function getSearchResultDomains(query) {
  const userAgent = randomUserAgent();
  const headers = {
    "User-Agent": userAgent
  }
  const response = await fetch('https://google.com/search?q=' + encodeURI(query), {
    headers: headers
  });
  const responseText = await response.text();
  const dom = new JSDOM(responseText);
  const foundDomains = Array.from(dom.window.document.getElementsByTagName("cite")).map(
    (element) => {
      /*
       * The text for the <cite> elements usually has the URL, followed by some special characters, like 
       * "https://about.google › products"
       * because of this, we split the text along whitespaces and take the first element in the split
       * */
      const text = element.textContent;
      const url = text.split(' ')[0];

      try {
        if (url.startsWith('http')) {
          return url.split('/')[2];
        } else {
          return "";
        }
      } catch (error) {
        console.error(`Invalid URL result returned from search query "${query}"`);
        console.error(error);
        return "";
      }
    }
  );
  
  return new Set(foundDomains);
}

module.exports = { getSearchResultDomains };
