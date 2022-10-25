import GenericNodeConnection from "./support/GenericNodeConnection";
export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      lastLogin: "2021-05-08T14:00:00.000",
      isSuperuser: false,
      firstName: "Michael",
      lastName: "Pegg",
      isStaff: false,
      isActive: true,
      dateJoined: "2021-04-01T14:00:00.000",
      email: "m.pegg@example.org",
      bookings: GenericNodeConnection(),
      pk: null,
      archieved: false,
      verified: true,
      secondaryEmail: null,
    },
    overrides
  );
};
