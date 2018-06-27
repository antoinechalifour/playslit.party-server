module.exports = class PartyShouldExistValidator {
  /**
   * Builds the validator.
   * @param {{ findByName: Function }} partyRepository - The party repository.
   */
  constructor (partyRepository) {
    this.partyRepository = partyRepository
  }

  /**
   * Validates the party passcode.
   * @param {{ partyName: string, code: string }} command - The command to validate.
   */
  async validate (command) {
    const party = await this.partyRepository.findByName(command.partyName)

    if (party.code !== command.code) {
      throw new Error(`Invalid passcode for party "${command.partyName}"`)
    }
  }
}
