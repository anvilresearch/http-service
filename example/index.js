/**
 * Dependencies
 */
const HTTPServicePlugin = require('../../http/HTTPServicePlugin')

/**
 * MyServicePlugin
 */
class MyServicePlugin extends HTTPServicePlugin {

  /**
   * initialize
   */
  initialize () {

    // import the main code from another module
    this.directory('services')

    // register the router
    this.router('my:http:service', (MyService, server) => {
      return MyService.create(null, { server })
    })
  }

}

/**
 * Export
 */
module.exports = MyServicePlugin
