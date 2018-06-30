// Middlewares
const Dispatcher = require('./Commands/Dispatcher')
const EventBusDispatcherMiddleware = require('./Commands/middlewares/EventDispatcher')
const LoggerMiddleware = require('./Commands/middlewares/LoggerMiddleware')

// Utils
const ValidatorDecorator = require('./Commands/decorators/Validator')
const PropertyValidator = require('./Commands/validators/PropertyValidator')
const validateRtc = require('./Commands/validators/helpers/validateRtc')

// Handles
const CreatePartyHandler = require('./Commands/CreateParty/Handler')
const CreatePartyPayloadValidator = require('./Commands/CreateParty/validators/Payload')
const PartyShouldNotExistValidator = require('./Commands/CreateParty/validators/PartyShouldNotExist')

const DeletePartyHandler = require('./Commands/DeletePartyCommand/Handler')

const JoinPartyHandler = require('./Commands/JoinParty/Handler')
const PartyShouldExistValidator = require('./Commands/JoinParty/validators/PartyShouldExist')
const CheckPasscodeValidator = require('./Commands/JoinParty/validators/CheckPasscode')

const LeavePartyHandler = require('./Commands/LeaveParty/Handler')

const SendSignalingAnswerHandler = require('./Commands/SendSignalingAnswer/Handler')

const SendSignalingCandidateHandler = require('./Commands/SendSignalingCandidate/Handler')

const SendSignalingOfferHandler = require('./Commands/SendSignalingOffer/Handler')

module.exports = function createCommandBus ({
  eventBus,
  tokenService,
  partyRepository,
  userRepository
}) {
  const handlers = [
    // CreateParty
    new ValidatorDecorator(
      new ValidatorDecorator(
        new CreatePartyHandler(userRepository, partyRepository),
        new PartyShouldNotExistValidator(partyRepository)
      ),
      new CreatePartyPayloadValidator()
    ),

    // DeleteParty
    new DeletePartyHandler(userRepository, partyRepository),

    // JoinParty
    new ValidatorDecorator(
      new ValidatorDecorator(
        new JoinPartyHandler(tokenService, partyRepository, userRepository),
        new CheckPasscodeValidator(partyRepository)
      ),
      new PartyShouldExistValidator(partyRepository)
    ),

    // LeaveParty
    new LeavePartyHandler(userRepository),

    // SendSignalingAnswer
    new ValidatorDecorator(
      new SendSignalingAnswerHandler(userRepository),
      new PropertyValidator('description', validateRtc.validateAnswer)
    ),

    // SendSignalingCandidate
    new ValidatorDecorator(
      new SendSignalingCandidateHandler(userRepository),
      new PropertyValidator('candidate', validateRtc.validateIceCandidate)
    ),

    // SendSignalingOffer
    new ValidatorDecorator(
      new SendSignalingOfferHandler(userRepository),
      new PropertyValidator('description', validateRtc.validateOffer)
    )
  ]
  const bus = new LoggerMiddleware(
    new EventBusDispatcherMiddleware(new Dispatcher(handlers), eventBus),
    console
  )

  return bus
}
