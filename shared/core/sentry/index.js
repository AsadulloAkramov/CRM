/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const Sentry = require('@sentry/node');

class ThrowException {
  static exception(error, options) {
    // if(options)
    Sentry.withScope((scope) => {
      // if(options.tags)
      if (options) {
        if (options.tags && Array.isArray(options.tags)) {
          for (const tagName in options.tags) {
            // console.log()
            scope.setTag(tagName, options.tags[tagName]);
          }
        }
        if (options.layer) {
          scope.setExtra('layer', options.layer);
        }
      }
      Sentry.captureException(error);
    });
  }
}

module.exports = ThrowException;
