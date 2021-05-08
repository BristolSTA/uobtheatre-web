export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Joe Bloggs',
      profilePicture: {
        url: 'https://via.placeholder.com/100x100/FBD400',
      },
      role: 'Peter Pan',
      production: null,
    },
    overrides
  )
}
