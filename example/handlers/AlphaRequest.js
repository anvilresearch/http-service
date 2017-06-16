/**
 * Dependencies
 */

/**
 * AlphaRequest
 */
class AlphaRequest {

  static get route () {
    return {
      method: 'GET',
      path: '/alpha'
    }
  }

  static handle (req, res, service) {
    res.json({ fake: 'data' })
  }

}

/**
 * Export
 */
module.exports = AlphaRequest
