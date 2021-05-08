export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      createdAt: '2021-05-08T14:00:00.000',
      updatedAt: '2021-05-08T16:00:00.000',
      reference: 'yOIYg6Co8vGR',
      user: null, // TODO: Implement user node
      performance: null, // TODO: Performance node
      status: {
        value: 'PAID',
        description: 'Paid',
      },
      tickets: [], // TODO: Tickets
      priceBreakdown: null, // TODO: Pricebreakdown
      payments: [], // TODO Payments node connection
    },
    overrides
  )
}
