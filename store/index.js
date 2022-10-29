export const state = () => ({
  breadcrumbs: []
});

export const mutations = {
  SET_BREADCRUMBS(state, crumbs) {
    state.breadcrumbs = crumbs;
  }
};
