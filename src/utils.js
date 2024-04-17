function isValidURL(url) {
  const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
        '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return urlPattern.test(url);
}

function parseDomain(rawDomain) {
  let domain;
  if (rawDomain.startsWith('http://') || rawDomain.startsWith('https://')) {
    domain = new URL(rawDomain).host;
  } else {
    domain = new URL('http://' + rawDomain).host;
  }
  if (domain.split('.').length == 3) { // in case host contains prefix like www.
    domain = domain.split('.').slice(1).join('.');
  }
  return domain;
}

module.exports = { isValidURL, parseDomain };
