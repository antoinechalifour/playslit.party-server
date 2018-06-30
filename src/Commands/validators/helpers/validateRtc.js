const assert = require('assert')
const validateString = require('./validateString')

/**
 * Validates an RTC offer.
 * @param {{ type: String?, sdp: String? }} offer - The offer to validate.
 */
module.exports.validateOffer = offer => {
  assert(offer.type === 'offer', 'Offer type must be "offer"')

  validateString(offer.sdp)
}

/**
 * Validates an RTC answer.
 * @param {{ type: String?, sdp: String? }} answer - The answer to validate.
 */
module.exports.validateAnswer = answer => {
  assert(answer.type === 'answer', 'Answer type must be "answer"')

  validateString(answer.sdp)
}

/**
 * Validates an RTC Icee Candidate
 * @param {{ candidate: String?, sdpMid: String?, sdpMLineIndex: Number? }} candidate - The candidate to validate.
 */
module.exports.validateIceCandidate = candidate => {
  validateString(candidate.candidate)
}
