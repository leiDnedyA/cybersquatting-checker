function isValidURL(url) {
  try {
    // Check if the URL has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // If not, prepend 'http://' and try to parse the URL
      url = 'http://' + url;
    }

    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { isValidURL };
