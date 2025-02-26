import UserNode from './User.js';

export default (overrides = {}, ongoing = false) => {
  // If ongoing is true, eventStart is 1 hour ago, otherwise 2 hours in the future
  const eventStart = ongoing
    ? new Date(Date.now() - 3600000).toISOString()
    : new Date(Date.now() + 7200000).toISOString();
  const eventDuration = ongoing ? 1500 : 1320;

  return Object.assign(
    {
      id: 1,
      message: 'Test message',
      active: true,
      indefiniteOverride: false,
      // displayStart is 2 hour ago
      displayStart: new Date(Date.now() - 7200000).toISOString(),
      // eventStart depends on ongoing
      eventStart: eventStart,
      // eventEnd is 24 hours in the future
      eventEnd: new Date(Date.now() + 86400000).toISOString(),
      creator: UserNode(),
      type: 'ALERT',
      dismissalPolicy: 'DEFAULT',
      eventDuration: eventDuration,
      toDisplay: true
    },
    overrides
  );
};
