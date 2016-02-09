'use strict';

var _ = require('lodash');
var request = require('request');
var Promise = require('bluebird');
var url = require('url');
var errors = require('./errors');
var requestExt = require('request-extensible');
Client.PACKAGE_VERSION = require('../package.json').version;
var resources = require('./resources');
Client.resources = resources;
var debug = require('debug')('node-gitter:client');

/* Constructs the request which the client will use */
function getRequestLib(options) {
  var underlyingRequest = options.request || request;
  /* If extensions have been specified, use request-extensible */
  if (options.extensions) {
    return requestExt({
      request: underlyingRequest,
      extensions: options.extensions
    });
  }

  return underlyingRequest;
}

function Client(options) {
  if (!options) options = {};
  this.spread = options.spread;
  this.accessToken = options.accessToken;
  this.requestLib = getRequestLib(options);
  this.defaultHeaders = _.extend({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'NodeGitter/' + Client.PACKAGE_VERSION
  }, options.headers);

  this._prepResources();
}

Client.prototype = {
  _prepResources: function() {

    for (var name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }

  },

  _request: function(method, path, data, spec, options) {
    var self = this;

    var headers = _.extend({}, this.defaultHeaders, spec.headers, options.headers);

    headers.Authorization = 'Bearer ' + (options.accessToken || this.accessToken);

    return new Promise(_.bind(function(resolve, reject) {
      var uri = url.format({
        protocol: "https:",
        host: "api.gitter.im",
        pathname: path,
        query: options.query
      });

      debug(method+' '+uri, headers);

      var useSpread = options.spread !== undefined  ? options.spread : this.spread;

      function spreadResponse(body, response) {
        resolve([body, response]);
      }

      function noSpreadResponse(body) {
        resolve(body);
      }

      var resolver = useSpread ? spreadResponse : noSpreadResponse;

      // Pass the options through to the extensions, but don't include the options
      // that have been mutated by this method
      var passThroughOptions = _.omit(options, 'query', 'accessToken', 'spread', 'headers', 'body', 'url', 'json', 'followRedirect', 'followAllRedirects');

      var requestOptions = _.defaults({
        method: method,
        uri: uri,
        headers: headers,
        body: data,
        json: !!data,
        gzip: true,
        encoding: options.encoding === undefined ? 'utf8' : options.encoding,
        followRedirect: true,
        followAllRedirects: true, // Redirects for non-GET requests
      }, passThroughOptions);

      this.requestLib(requestOptions, function(err, response, body) {
        if (err) {
          err.response = response;
          return reject(err);
        }

        if (spec.checkOperation) {
          /* 404 means "false" */
          if (response.statusCode === 404) {
            return resolver(false, response);
          }

          /* 2XX means "true" */
          if (response.statusCode < 300) {
            return resolver(true, response);
          }
        }

        if (options.treat404asEmpty && response.statusCode === 404) {
          return resolver(null, response);
        }

        try {
          var parsedBody = self._parseBody(response, body);

          if (response.statusCode >= 400) {
            var message = typeof parsedBody.message === 'string' ? parsedBody.message.replace(/\n+/g, ' ') : "HTTP " + response.statusCode;
            debug(message, parsedBody || body);
            return reject(new errors.GitterError(message, {
              url: uri,
              statusCode: response.statusCode,
              headers: response.headers,
              body: parsedBody || body
            }));
          }

          return resolver(parsedBody, response);

        } catch(e) {
          return reject(e);
        }

      });

    }, this));

  },

  _parseBody: function(response, body) {
    if (typeof body !== 'string') return body;

    // TODO: deal with various types
    var contentType = response.headers['content-type'];
    if (contentType) {
      var ct = contentType.split(';')[0];

      if (ct === 'application/json') {
        return JSON.parse(body);
      }

    }

    return body;
  }

};

module.exports = Client;
