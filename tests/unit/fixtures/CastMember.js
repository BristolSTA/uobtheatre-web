export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: "Joe Bloggs",
      profilePicture: {
        url: "http://pathto.example/profile-pic.png",
      },
      role: "Peter Pan",
      production: null,
    },
    overrides
  );
};
