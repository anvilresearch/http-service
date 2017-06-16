/**
 * Dependencies
 */
const { BaseRequest } = require('@trust/http-service')

/**
 * BravoRequest
 */
class BravoRequest extends BaseRequest {

  static get route () {
    return {
      method: 'GET',
      path: '/bravo'
    }
  }

  static handle (req, res, service) {
    let request = new BravoRequest(req, res, service)

    Promise.resolve()
      .then(() => request.step1())
      .then(() => request.step2())
      .then(() => request.step3())
      .catch(err => request.error(err))
  }

  step1 () {
    return Promise.resolve(null)
  }
  step2 () {
    return Promise.resolve(null)
  }
  step3 () {
    this.res.send('asynchronously')
  }

}

/**
 * Export
 */
module.exports = BravoRequest
