export default () => {
  return {
    seat_group: {
      id: 1,
      name: 'Best Seats in the House',
      description: 'The best seats obviously',
      capacity_remaining: 10,
    },
    concession_types: [
      {
        id: 1,
        name: 'Adult',
        price: 100,
      },
      {
        id: 2,
        name: 'Student',
        price: 100,
      },
    ],
  };
};
