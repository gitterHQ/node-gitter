'use strict';

var createError = require('create-error');

// an error this library threw
var NodeGitterError = createError('NodeGitterError');
// gitter's threw this error
var GitterError = createError(NodeGitterError, 'GitterError');

module.exports = {
  NodeGitterError: NodeGitterError,
  GitterError: GitterError
};
