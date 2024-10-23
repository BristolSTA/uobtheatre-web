export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Booking Fee',
      description: 'Supports theatre maintainance and website',
      percentage: 0.05
    },
    overrides
  );
};
