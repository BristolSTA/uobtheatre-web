export default (overrides = {}) => {
  return Object.assign(
    {
      createdAt: '2020-05-08T14:00:00.000',
      updatedAt: '2020-05-08T14:00:00.000',
      id: 1,
      type: {
        paymentType: 'PAYMENT',
      },
      providerPaymentId: '1234',
      provider: {
        value: 'SQUARE_ONLINE',
      },
      value: '1265',
      currency: 'GBP',
      cardBrand: 'VISA',
      last4: '4441',
      url: 'String',
      payObject: null, // TODO
    },
    overrides
  );
};
