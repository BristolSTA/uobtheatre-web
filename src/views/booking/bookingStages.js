import BookingStage from '@/classes/BookingStage';
import AudienceWarningsStage from '@/views/booking/stages/AudienceWarningsStage.vue';
import OverviewStage from '@/views/booking/stages/OverviewStage.vue';
import PickPerformanceStage from '@/views/booking/stages/PickPerformanceStage.vue';
import TicketSelectionStage from '@/views/booking/stages/TicketSelectionStage.vue';

let stages = [
  new BookingStage(
    'Select Performance',
    PickPerformanceStage,
    {
      path: '',
      name: 'production.book.select',
    },
    undefined,
    undefined,
    false
  ),
  new BookingStage(
    'Auidence Warnings',
    AudienceWarningsStage,
    {
      path: 'warnings',
    },
    (production) => production.warnings.length > 0
  ),
  new BookingStage('Ticket Selection', TicketSelectionStage, {
    path: 'tickets',
  }),
  new BookingStage(
    'Overview',
    OverviewStage,
    {
      path: 'overview',
    },
    null,
    (production, booking) => !booking.dirty
  ),
  new BookingStage(
    'Payment',
    {
      render(createElement) {
        return createElement('h1', 'Payment Here');
      },
    },
    {
      path: 'pay',
    },
    null,
    (production, booking) => !booking.dirty
  ),
];

/**
 * @returns {object} Booking Stages Routes
 */
export function getRoutes() {
  return stages.map((stage) => {
    return stage.generateRoute();
  });
}

/**
 * @param {BookingStage} stage The stage of which to find the index
 * @returns {number} The index of the stage, or -1 if not in list
 */
export function getStageIndex(stage) {
  return stages.indexOf(stage);
}

/**
 * @param {BookingStage|number} currentStage The current stage (object or index)
 * @param {object} production Production Data Object
 * @param {object|null} booking Booking Data Object
 * @returns {BookingStage|null} Next booking stage
 */
export function getNextStage(currentStage, production, booking) {
  return stages.find((stage, index) => {
    return (
      (!isNaN(currentStage)
        ? index > currentStage
        : index > getStageIndex(currentStage)) &&
      stage.shouldBeUsed(production, booking)
    );
  });
}

/**
 * @param {BookingStage|number} currentStage The current stage (object or index)
 * @param {object} production Production Data Object
 * @param {object|null} booking Booking Data Object
 * @returns {BookingStage|null} Next booking stage
 */
export function getPreviousStage(currentStage, production, booking) {
  let currentStageIndex = isNaN(currentStage)
    ? getStageIndex(currentStage)
    : currentStage;
  let stagesInReverse = stages.slice().reverse();
  return stagesInReverse.find((stage) => {
    return (
      getStageIndex(stage) < currentStageIndex &&
      stage.shouldBeUsed(production, booking) &&
      stage.eligable(production, booking)
    );
  });
}

export default stages;
