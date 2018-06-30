module.exports = class PropertyValidator {
  /**
   * Builds the validator.
   * @param {Function} validatorHelper - The validator function.
   */
  constructor (property, validatorHelper) {
    this.property = property
    this.validator = validatorHelper
  }

  async validate (command) {
    await this.validator(command[this.property])
  }
}
