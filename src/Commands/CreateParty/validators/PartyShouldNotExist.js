module.exports = class PartyShouldNotExist {
  /**
   * Builds the validator.
   * @param {{ findByName: Function }} partyRepository - The party repository.
   */
  constructor (partyRepository) {
    this.partyRepository = partyRepository
  }

  /**
   * Throws whenever the party already exists.
   * @param {{ partyName: string }} command - The command to validate.
   */
  async validate (command) {
    const existingParty = await this.partyRepository.findByName(
      command.partyName
    )

    if (existingParty) {
      throw new Error(`Party "${command.partyName}" already exists`)
    }
  }
}
