export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Booking Fee',
      description: 'Supports theatre maintainance and website',
      value: 5
    },
    overrides
  );
};
