export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Adult',
      description: 'People over 18 years of age',
      seatBooking: null
    },
    overrides
  );
};
