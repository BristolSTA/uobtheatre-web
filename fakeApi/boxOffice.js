import BookingModel from './booking.model'

export default {
  registerGQLMutations() {
    return `
            createBoxOfficeBooking(performanceId: IdInputField, tickets: [CreateTicketInput]): CreateBooking
            updateBoxOfficeBooking(bookingId: IdInputField, tickets: [UpdateTicketInput]): UpdateBooking
            payBoxOfficeBooking(bookingId: IdInputField!, nonce: String!, price: Int!): PayBooking
        `
  },
  registerGQLMutationResolvers() {
    return {
      createBoxOfficeBooking: BookingModel.registerGQLMutationResolvers()
        .createBooking,
      updateBoxOfficeBooking: BookingModel.registerGQLMutationResolvers()
        .updateBooking,
      payBoxOfficeBooking: BookingModel.registerGQLMutationResolvers()
        .payBooking,
    }
  },
}
