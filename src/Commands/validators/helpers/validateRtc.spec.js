const validators = require('./validateRtc')

test('validateOffer - Throws when the type is not "offer"', () => {
  const offer = {
    type: 'answer',
    sdp: 'session description'
  }

  expect(() => validators.validateOffer(offer)).toThrow(
    'Offer type must be "offer"'
  )
})

test('validateOffer - Throws when the sdp is not a string', () => {
  const offer = {
    type: 'offer',
    sdp: { foo: 'bar' }
  }

  expect(() => validators.validateOffer(offer)).toThrow(
    'Expected value to be of type "string", got "object"'
  )
})

test('validateOffer - Does not throw when the offer is valid', () => {
  const offer = {
    type: 'offer',
    sdp: 'session description'
  }

  expect(() => validators.validateOffer(offer)).not.toThrow()
})

test('validateAnswer - Throws when the type is not "answer"', () => {
  const answer = {
    type: 'offer',
    sdp: 'session description'
  }

  expect(() => validators.validateAnswer(answer)).toThrow(
    'Answer type must be "answer"'
  )
})

test('validateAnswer - Throws when the sdp is not a string', () => {
  const answer = {
    type: 'answer',
    sdp: { foo: 'bar' }
  }

  expect(() => validators.validateAnswer(answer)).toThrow(
    'Expected value to be of type "string", got "object"'
  )
})

test('validateAnswer - Does not throw when the answer is valid', () => {
  const answer = {
    type: 'answer',
    sdp: 'session description'
  }

  expect(() => validators.validateAnswer(answer)).not.toThrow()
})

test('validateIceCandidate - Throws when the candidate attribute is not a string', () => {
  const candidate = {
    candidate: null,
    sdpMid: 'data',
    sdpMLineIndex: 0
  }

  expect(() => validators.validateIceCandidate(candidate)).toThrow(
    'Expected value to be of type "string", got "object"'
  )
})

test('validateIceCandidate - Does not throw when the candidate is valid', () => {
  const candidate = {
    candidate: 'my candidate',
    sdpMid: 'data',
    sdpMLineIndex: 0
  }

  expect(() => validators.validateIceCandidate(candidate)).not.toThrow()
})

// TODO: Test sdpMid and sdpMLineIndex ??
