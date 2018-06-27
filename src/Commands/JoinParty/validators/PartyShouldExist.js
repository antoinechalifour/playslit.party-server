module.exports = class PartyShouldExistValidator {
  /**
   * Builds the validator.
   * @param {{ findByName: Function }} partyRepository - The party repository.
   */
  constructor (partyRepository) {
    this.partyRepository = partyRepository
  }

  /**
   * Validates that the party exists.
   * @param {{ partyName: string }} command - The command to validate.
   */
  async validate (command) {
    const party = await this.partyRepository.findByName(command.partyName)

    if (!party) {
      throw new Error(`Party "${command.partyName}" does not exist`)
    }
  }
}
