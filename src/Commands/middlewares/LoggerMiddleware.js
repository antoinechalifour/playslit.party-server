module.exports = class LoggerMiddleware {
  /**
   * Builds the middleware
   * @param {{ dispatch: any => any }} next - The next middleware.
   * @param {object} logger - The logger.
   */
  constructor (next, logger) {
    this.next = next
    this.logger = logger
  }

  async dispatch (command) {
    const before = new Date()
    const commandType = command.type
    let response

    try {
      response = await this.next.dispatch(command)
    } catch (err) {
      this.logger.error(`(command)/${commandType} ERROR:`, {
        command,
        err
      })
      throw err
    }

    const after = new Date()

    console.log('\n---\n')
    this.logger.log(`(command)/${commandType} took ${after - before}ms`)
    this.logger.log({
      command,
      response
    })

    return response
  }
}
