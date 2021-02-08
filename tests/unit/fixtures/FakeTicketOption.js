export default () => {
  return {
    capacityRemaining: 10,
    seatGroup: {
      id: 1,
      name: 'Best seats in the house',
      description: 'The best seats obviously',
    },
    concessionTypes: [
      {
        concessionType: {
          id: 1,
          name: 'Adult',
        },
        price: 1000,
      },
      {
        concessionType: {
          id: 2,
          name: 'Student',
        },
        price: 800,
      },
    ],
  };
};
