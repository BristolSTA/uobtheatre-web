import CrewRole from './CrewRole';
export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Jill Bloggs',
      role: CrewRole(),
      production: null
    },
    overrides
  );
};
