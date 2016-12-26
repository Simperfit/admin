import { fetchUtils } from 'admin-on-rest'

export default (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers();
  }

  options.headers.set('Accept', 'application/ld+json');
  if (options.body) {
    options.headers.set('Content-Type', 'application/ld+json');
  }

  return fetchUtils.fetchJson(url, options);
};
