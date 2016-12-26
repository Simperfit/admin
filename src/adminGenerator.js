import { promises } from 'jsonld';
import jsonLdClient from './jsonLdClient';

/**
 * Extracts the short name of a resource.
 *
 * @param {string} url
 * @param {string}  entrypointUrl
 *
 * @return {string}
 */
const guessNameFromUrl = (url, entrypointUrl) => url.substr(entrypointUrl.length + 1);

const findSupportedClass = (docs, supportedClass) => {
  var supportedClasses = docs[0]['http://www.w3.org/ns/hydra/core#supportedClass'];

  for (let i = 0; i < supportedClasses.length; i++) {
    if (supportedClasses[i]['@id'] === supportedClass) {
      return supportedClasses[i];
    }
  }

  throw new Error(`The class ${supportedClass} doesn't exist.`);
};

const fetchEntrypointAndDocs = entrypointUrl => {
  return jsonLdClient(entrypointUrl).then(response => {
    const linkHeader = response.headers.get('Link');
    if (!linkHeader) {
      Promise.reject(new Error('The response has no "Link" HTTP header.'));
    }

    const matches = linkHeader.match(/<(.+)>; rel="http:\/\/www.w3.org\/ns\/hydra\/core#apiDocumentation"/);
    if (!matches[1]) {
      Promise.reject(new Error('The "Link" HTTP header is not of the type "http://www.w3.org/ns/hydra/core#apiDocumentation".'));
    }

    return { entrypointUrl, docsUrl: matches[1], entrypoint: response.json };
  }).then(data =>
    jsonLdClient(data.docsUrl).then(response => {
      data.docs = response.json;

      return data;
    }).then(data =>
      promises.expand(data.docs, { base: data.docsUrl }).then(docs => {
        data.docs = docs;

        return data;
      })
    ).then(data =>
      promises.expand(data.entrypoint, { base: data.entrypointUrl }).then(entrypoint => {
        data.entrypoint = entrypoint;

        return data;
      })
    )
  );
};

export default (entrypointUrl) =>
  fetchEntrypointAndDocs(entrypointUrl).then(({ entrypoint, docs }) => {
    let admin = {
      title: 'Admin',
      resources: {}
    };

    if ('undefined' !== typeof docs[0]['http://www.w3.org/ns/hydra/core#title']) {
      admin.title = docs[0]['http://www.w3.org/ns/hydra/core#title'][0]['@value'];
    }

    const entrypointSupportedClass = findSupportedClass(docs, entrypoint[0]['@type'][0]);

    // Add resources
    for (let properties of entrypointSupportedClass['http://www.w3.org/ns/hydra/core#supportedProperty']) {
      let property = properties['http://www.w3.org/ns/hydra/core#property'][0];
      let resource = {
        name: (guessNameFromUrl(entrypoint[0][property['@id']][0]['@id'], entrypointUrl)),
        readableFields: {},
        writableFields: {}
      };

      var entrypointSupportedOperations = property['http://www.w3.org/ns/hydra/core#supportedOperation'];

      // Add fields
      for (var j = 0; j < entrypointSupportedOperations.length; j++) {
        let className = entrypointSupportedOperations[j]['http://www.w3.org/ns/hydra/core#returns'][0]['@id'];
        if (0 === className.indexOf('http://www.w3.org/ns/hydra/core')) {
          continue;
        }

        let supportedClass = findSupportedClass(docs, className);
        for (let supportedProperty of supportedClass['http://www.w3.org/ns/hydra/core#supportedProperty']) {
          let rdfProperty = supportedProperty['http://www.w3.org/ns/hydra/core#property'][0];
          let property = rdfProperty['http://www.w3.org/2000/01/rdf-schema#label'][0]['@value'];
          let range = rdfProperty['http://www.w3.org/2000/01/rdf-schema#range'][0]['@id'];

          let field = {
            name: property,
            required: supportedProperty['http://www.w3.org/ns/hydra/core#required'][0]['@value'],
            type: rdfProperty['@type'][0],
            range: range
          };

          console.log(rdfProperty);
          console.log(field);

          // Add placeholder
          if (supportedProperty['http://www.w3.org/ns/hydra/core#description']) {
            field.placeholder = supportedProperty['http://www.w3.org/ns/hydra/core#description'][0]['@value'];
          }

          // list fields
          if (supportedProperty['http://www.w3.org/ns/hydra/core#readable'][0]['@value']) {
            resource.readableFields[field.name] = field;
          }

          // edition and creation fields
          if (supportedProperty['http://www.w3.org/ns/hydra/core#writable'][0]['@value']) {
            resource.writableFields[field.name] = field;
          }
        }

        admin.resources[resource.name] = resource;

        break;
      }
    }

    return admin;
  });
