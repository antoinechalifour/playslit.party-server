const Response = require('../Response')

module.exports = class ValidatorDecorator {
  /**
   * Builds the decorator.
   * @param {{ handle: Function }} handler - The decorated handler.
   * @param {Function} validator - A callback function to validate the command.
   */
  constructor (handler, validator) {
    this.handler = handler
    this.validator = validator
  }

  async handle (command) {
    try {
      await this.validator(command)
      return this.handler.handle(command)
    } catch (err) {
      return Response.withError(err)
    }
  }
}
