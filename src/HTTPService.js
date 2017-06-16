/**
 * Dependencies
 */
const fs = require('fs')
const path = require('path')
const callsite = require('callsite')

/**
 * HTTPService
 */
class HTTPService {

  /**
   * constructor
   */
  constructor (data) {
    Object.assign(this, data)
  }

  /**
   * create
   */
  static create (data, dependencies = {}) {
    let ExtendedHTTPService = this
    let service = new ExtendedHTTPService(data)
    service.inject(dependencies)
    return service
  }

  /**
   * with
   */
  static with (shared, data = {}, dependencies = {}) {
    let service = this.create(data, dependencies)

    shared.dependencies.forEach(key => {
      Object.defineProperty(service, key, {
        enumerable: false,
        get: () => shared[key]
      })
    })

    // reference the shared service object
    Object.defineProperty(service, 'shared', {
      enumerable: false,
      value: shared
    })

    // reference the new service on the shared service
    //shared.siblings.push(service)

    return service
  }

  /**
   * handlers
   *
   * @description
   * Require handler modules from a directory
   *
   * @param {String} directory
   * @returns {Array}
   */
  static handlers (directory = '../handlers') {
    let caller = callsite()[1]
    let callerpath = caller.getFileName()
    let dirname = path.join(path.dirname(callerpath), directory)
    let files = fs.readdirSync(dirname)
    let modules = []

    files.forEach(filename => {
      let extname = path.extname(filename)
      let handler = path.basename(filename, '.js')
      let modulePath = path.join(dirname, handler)

      if (extname === '.js' && handler !== 'index') {
        modules.push(require(modulePath))
      }
    })

    return modules
  }

  /**
   * handlers
   */
  get handlers () {
    throw new Error('Handlers must be defined for subclass')
  }

  /**
   * inject
   */
  inject (dependencies) {
    let keys = Object.keys(dependencies)

    Object.defineProperty(this, 'dependencies', {
      enumerable: false,
      value: keys
    })

    keys.forEach(key => {
      let value = dependencies[key]
      Object.defineProperty(this, key, {
        enumerable: false,
        value
      })
    })
  }

  /**
   * router
   */
  get router () {
    let service = this
    let router = this.express.Router()

    service.handlers.forEach(request => {
      let { path, method, methods, middleware } = request.route

      if (method && !methods) {
        methods = [method]
      }

      methods.forEach(m => {
        router[m.toLowerCase()](path, (req, res) => {
          request.handle(req, res, service)
        })
      })
    })

    return router
  }

  /**
   * mount
   */
  mount () {
    this.server.use(this.router)
  }

  /**
   * unmount
   */
  unmount () {
    let stack = this.server._router.stack
    let index = stack.indexOf(this)

    stack.splice(index, 1)
  }

}

/**
 * Export
 */
module.exports = HTTPService
