export default (overrides) => {
  return Object.assign(
    {
      id: 1,
      buildingName: 'The Richmond Building',
      street: 'The Long Road',
      buildingNumber: '100',
      city: 'Bristol',
      postcode: 'BS11AX',
      latitude: 51.156,
      longitude: 0.1234,
    },
    overrides
  )
}
