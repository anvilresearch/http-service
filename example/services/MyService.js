/**
 * Dependencies
 */
const HTTPService = require('../../http/HTTPService')
const handlers = HTTPService.handlers()

/**
 * MyService
 */
class MyService extends HTTPService {

  get handlers () {
    return handlers
  }

}

/**
 * Export
 */
module.exports = MyService
