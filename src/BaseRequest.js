/**
 * Dependencies
 */
const TerminationError = require('./TerminationError')

/**
 * BaseRequest
 */
class BaseRequest {

  /**
   * Constructor
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   * @param {HTTPService} service
   */
  constructor (req, res, service) {
    this.req = req
    this.res = res
    this.service = service
  }

  /**
   * Request Handler
   *
   * @param {HTTPRequest} req
   * @param {HTTPResponse} res
   * @param {Provider} provider
   */
  static handle (req, res, provider) {
    throw new Error('Handle must be implemented by BaseRequest subclass')
  }

  /**
   * 204 No Content
   *
   * @param {Boolean} promised
   */
  noContent (promised = true) {
    let { res } = this

    // Response
    res.sendStatus(204)

    // Terminate promise chain
    if (promised) {
      throw new TerminationError()
    }
  }

  /**
   * badRequest
   *
   * @description
   * HTTP 400 Bad Request response
   *
   * @param {Error} error
   * @param {Boolean} promised
   */
  badRequest (err, promised = true) {
    let { res, service: { log } } = this

    // Cache Headers
    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    })

    if (log) {
      log.error(err)
    }

    // Response
    res.status(400).json(err)

    // Terminate promise chain
    if (promised) {
      throw new TerminationError()
    }
  }

  /**
   * unauthorized
   *
   * @description
   * HTTP 401 Unauthorized response
   *
   * @param {Error} err
   * @param {Boolean} promised
   */
  unauthorized (err, promised = true) {
    let { res } = this
    let { realm, message, error, error_description: description } = err

    // WWW-Authenticate Challenge
    let challenge = `Bearer `
    challenge += `realm=${ realm || user } `

    if (error || message) {
      challenge += `error=${ error || message } `
    }

    if (error_description) {
      challenge += `error_description=${ description }`
    }

    // WWW-Authenticate Header
    res.set({
      'WWW-Authenticate': challenge
    })

    // Response
    res.sendStatus(401)

    // Terminate promise chain
    if (promised) {
      throw new TerminationError()
    }
  }

  /**
   * notFound
   *
   * @description
   * HTTP 404 Not Found response
   *
   * @param {object} err
   * @param {Boolean} promised
   */
  notFound (err, promised = true) {
    let { res, service: { log } } = this

    // Cache Headers
    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    })

    if (log) {
      log.error(err)
    }

    // Response
    res.status(404).json(err)

    // Terminate promise chain
    if (promised) {
      throw new TerminationError()
    }
  }

  /**
   * internalServerError
   *
   * @description
   * HTTP 500 Internal Server Error response
   *
   * @param {Error} err
   */
  internalServerError (err) {
    let { res, service: { log } } = this

    // log error if a logger is defined
    if (log) {
      log.error(err)
    }

    res.sendStatus(500)
  }

  /**
   * error
   *
   * @description
   * Uncaught exception handler
   *
   * @param {Error} err
   */
  error (err) {
    if (!(err instanceof TerminationError)) {
      this.internalServerError(err)
    }
  }

}

/**
 * Export
 */
module.exports = BaseRequest
