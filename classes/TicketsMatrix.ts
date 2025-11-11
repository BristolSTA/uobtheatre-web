import type { TicketOptions } from '~~/types/performance';
import type {
  PerformanceNode,
  FullPerformanceAndTicketOptionsQuery
} from '~~/graphql/codegen/operations';
import type { IdInput } from '~~/types/generic';

type Discounts = NonNullable<
  FullPerformanceAndTicketOptionsQuery['performance']
>['discounts'];

export default class {
  raw_ticket_options: TicketOptions;
  raw_discounts: Discounts;
  _performanceCapacityRemaining: number;

  constructor(
    rawPerformance: Pick<PerformanceNode, 'capacityRemaining'> & {
      ticketOptions?: TicketOptions | null;
      discounts: Discounts;
    }
  ) {
    this.raw_ticket_options = JSON.parse(
      JSON.stringify(rawPerformance.ticketOptions)
    );
    this._performanceCapacityRemaining = rawPerformance.capacityRemaining ?? 0;
    this.raw_discounts = rawPerformance.discounts;
  }

  get discounts() {
    return this.raw_discounts;
  }

  get ticketOptions() {
    return this.raw_ticket_options;
  }

  get performanceCapacityRemaining() {
    return this._performanceCapacityRemaining;
  }

  set performanceCapacityRemaining(number) {
    this._performanceCapacityRemaining = number;
  }

  decrementPerformanceCapacity() {
    this.performanceCapacityRemaining--;
  }

  incrementPerformanceCapacity() {
    this.performanceCapacityRemaining++;
  }

  /**
   * @param seatGroupId Seat group to check against
   * @returns {number} Capacity remaining
   */
  capacityRemainingForSeatGroup(seatGroupId: IdInput) {
    return Math.min(
      this.ticketOptions.find(
        (option) => option && option.seatGroup.id === seatGroupId
      )?.capacityRemaining ?? 0,
      this.performanceCapacityRemaining
    );
  }

  /**
   * @param {number} seatGroupId Seat group ID to decrease capacity by 1
   */
  decrementSeatGroupCapacity(seatGroupId: IdInput) {
    const index = this.ticketOptions.findIndex(
      (option) => option && option.seatGroup.id === seatGroupId
    );

    const ticketOption = this.raw_ticket_options[index];
    const capacityRemaining = ticketOption?.capacityRemaining;

    if (capacityRemaining == null || !ticketOption) return;
    ticketOption.capacityRemaining = capacityRemaining - 1;
  }

  /**
   * @param seatGroupId Seat group ID to increase capacity by 1
   */
  incrementSeatGroupCapacity(seatGroupId: IdInput) {
    const index = this.ticketOptions.findIndex(
      (option) => option && option.seatGroup.id === seatGroupId
    );
    const ticketOption = this.raw_ticket_options[index];
    const capacityRemaining = ticketOption?.capacityRemaining;

    if (capacityRemaining == null || !ticketOption) return;
    ticketOption.capacityRemaining = capacityRemaining + 1;
  }

  /**
   * @param  number Number of tickets requested to book
   * @param  seatGroupId Optional seat group id to also check it has enough capacity
   * @returns {boolean} Whether tickets can be added
   */
  canAddTickets(number: number, seatGroupId?: IdInput) {
    // 1st check if performance can have this many tickets added
    if (number > this.performanceCapacityRemaining) {
      return false;
    }

    // 2nd, if has a seat_group, check that has enough remaining capacity
    if (seatGroupId != null) {
      const seatGroupCapacity = this.capacityRemainingForSeatGroup(seatGroupId);
      if (number > seatGroupCapacity) {
        return false;
      }
    }

    return true;
  }
}
