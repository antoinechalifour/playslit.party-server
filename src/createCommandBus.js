// Middlewares
const Dispatcher = require('./Commands/Dispatcher')
const EventBusDispatcherMiddleware = require('./Commands/middlewares/EventDispatcher')
const LoggerMiddleware = require('./Commands/middlewares/LoggerMiddleware')

// Utils
const ValidatorDecorator = require('./Commands/decorators/Validator')

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
    new ValidatorDecorator(
      new ValidatorDecorator(
        new CreatePartyHandler(userRepository, partyRepository),
        new PartyShouldNotExistValidator(partyRepository)
      ),
      new CreatePartyPayloadValidator()
    ),
    new DeletePartyHandler(userRepository, partyRepository),
    new ValidatorDecorator(
      new ValidatorDecorator(
        new JoinPartyHandler(tokenService, partyRepository, userRepository),
        new CheckPasscodeValidator(partyRepository)
      ),
      new PartyShouldExistValidator(partyRepository)
    ),
    new LeavePartyHandler(userRepository),
    new SendSignalingAnswerHandler(userRepository),
    new SendSignalingCandidateHandler(userRepository),
    new SendSignalingOfferHandler(userRepository)
  ]
  const bus = new LoggerMiddleware(
    new EventBusDispatcherMiddleware(new Dispatcher(handlers), eventBus),
    console
  )

  return bus
}
