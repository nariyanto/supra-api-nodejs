const joi = require('joi')
const BaseMiddleware = require('../core/BaseMiddleware')

const headersSchema = joi.object({
  'content-type': joi.string().valid('application/json', 'multipart/form-data').required()
}).options({ allowUnknown: true })

class QueryMiddleware extends BaseMiddleware {
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }

  handler () {
    return async (req, res, next) => {
      try {
        await joi.validate(req.headers, headersSchema)

        // get method default query
        req.query = req.method === 'GET' ? {
          ...req.query,
          page: Number(req.query.page) || 0,
          limit: Number(req.query.limit) || 10,
          filter: req.query.filter || {},
          orderBy: req.query.orderBy || { field: 'createdAt', direction: 'asc' }
        } : { ...req.query }

        next()
      } catch (error) {
        next(error)
      }
    }
  }
}

module.exports = new QueryMiddleware()
