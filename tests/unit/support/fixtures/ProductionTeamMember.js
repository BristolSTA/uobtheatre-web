export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Alexis Toof',
      role: 'Producer',
      production: null,
    },
    overrides
  );
};
