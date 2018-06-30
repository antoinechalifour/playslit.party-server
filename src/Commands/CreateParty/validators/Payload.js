const assert = require('assert')

function validatePartyName (partyName) {
  const errorMessage = 'Invalid argument partyName'

  assert(typeof partyName === 'string', errorMessage)
  assert(partyName.length <= 30, errorMessage)

  const reg = /[a-z0-9_-]+/g
  const matches = partyName.match(reg)

  if (matches === null || matches.length !== 1) {
    throw new Error('Invalid argument partyName')
  }
}

function validateCode (code) {
  const errorMessage = 'Invalid argument code'

  assert(typeof code === 'string', errorMessage)
  assert(code.length <= 30, errorMessage)

  if (code.length < 1) {
    throw new Error(errorMessage)
  }
}

function validateHostId (hostId) {
  assert(typeof hostId === 'string', 'Invalid argument hostId')
}

/**
 * Validates "CreateParty" commands.
 * @param {{ type: String, partyName: string? , code: string?, hostId: string? }} command - The command to validate.
 */
module.exports = class ValidateCreatePartyPayload {
  validate (command) {
    validatePartyName(command.partyName)
    validateCode(command.code)
    validateHostId(command.hostId)
  }
}
