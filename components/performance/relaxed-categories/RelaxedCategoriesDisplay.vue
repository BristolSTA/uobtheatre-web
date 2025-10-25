<template>
  <modal @close="$emit('close')">
    <div class="lg:w-1/3-screen">
      <h2 class="text-lg font-semibold px-3">
        {{ thisRelaxedName }} Performance
      </h2>
      <p v-if="relaxedCategories.length !== 0" class="p-3">
        This performance has been adapted to be more accessible to different
        audience members. The following adaptations have been made:
      </p>
      <p v-else ref="no-categories" class="p-3">
        This performance has been adapted to be more accessible to different
        audience members. For further details, please contact the production
        team.
      </p>

      <ul class="gap-y-2 flex flex-col">
        <li v-for="rc in relaxedCategories" :key="rc.id">
          <relaxed-category-display :relaxed-category="rc" />
        </li>
      </ul>
    </div>
  </modal>
</template>

<script>
import RelaxedCategoryDisplay from './RelaxedCategoryDisplay.vue';
import Modal from '~/components/ui/Modal.vue';
export default {
  components: { Modal, RelaxedCategoryDisplay },
  props: {
    relaxedCategories: {
      required: true,
      type: Array
    },
    thisRelaxedName: {
      required: true,
      type: String
    }
  },

  emits: ['close']
};
</script>
