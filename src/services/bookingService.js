import api from '@/services/api';

export default {
  /**
   * Fetches ticket options for specified performance
   *
   * @param {string} performance_id Performance ID
   * @returns {Promise} API Response Promise
   */
  fetchDraftBooking(performance_id) {
    //TODO
    return api.get(performance_id);
  },

  /**
   * Creates a new draft booking for a performance for the user
   *
   * @param {string} performance_id Performance ID
   * @param {Array} tickets Array of tickets
   * @returns {Promise} API Response Promise
   */
  startNewBooking(performance_id, tickets = []) {
    return api.post('bookings', {
      performance_id: performance_id,
      tickets: tickets,
    });
  },

  /**
   * Updates the draft booking
   *
   * @param {number} booking_id Booking ID
   * @param {Array} tickets Array of tickets
   * @returns {Promise} API Response Promise
   */
  updateBooking(booking_id, tickets = []) {
    return api.put(`bookings/${booking_id}`, {
      tickets: tickets,
    });
  },
};
