export default {
  name: 'Family Discount',
  percentage: 0.5,
  requirements: [
    {
      number: 1,
      concessionType: {
        id: 1,
        name: 'Adult',
      },
    },
    {
      number: 2,
      concessionType: {
        id: 2,
        name: 'Student',
      },
    },
  ],
};
