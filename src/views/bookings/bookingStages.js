import BookingStage from '@/classes/BookingStage';
import AudienceWarningsStage from '@/views/bookings/stages/AudienceWarningsStage.vue';
import PickPerformanceStage from '@/views/bookings/stages/PickPerformanceStage.vue';
import TicketSelectionStage from '@/views/bookings/stages/TicketSelectionStage.vue';

let stages = [
  new BookingStage('Select Performance', PickPerformanceStage, {
    path: '',
    name: 'production.book.select',
  }),
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
    {
      render(createElement) {
        return createElement('h1', 'Overview Here');
      },
    },
    {
      path: 'overview',
    }
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
    }
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

export default stages;
