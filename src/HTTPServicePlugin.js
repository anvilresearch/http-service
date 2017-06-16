/**
 * Dependencies
 */
const AbstractPlugin = require('../architecture/AbstractPlugin')

/**
 * HTTPServicePlugin
 *
 * @todo
 * `start()` and `stop()` should filter addtionally by the plugin
 */
class HTTPServicePlugin extends AbstractPlugin {

  /**
   * Start
   *
   * @description
   * Find all the routers for this plugin and mount them to the server
   */
  start () {
    let routers = this.injector.filter({
      type: 'router',
      // plugin: this
    })
    .values()
    .forEach(router => router.mount())
  }

  /**
   * Stop
   *
   * @description
   * Find all the routers for this plugin and unmount them from the server
   */
  stop () {
    this.injector.filter({
      type: 'router',
      // plugin: this
    })
    .values()
    .forEach(router => router.unmount())
  }

}

/**
 * Export
 */
module.exports = HTTPServicePlugin
