export const state = () => ({
  currentStage: null,
})

export const mutations = {
  SET_STAGE(state, component) {
    state.currentStage = component
  },
}
