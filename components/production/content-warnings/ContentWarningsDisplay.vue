<template>
  <modal @close="$emit('close')">
    <div ref="warnings-modal" class="max-w-screen-sm">
      <h2 class="text-lg font-semibold px-1">Content Warnings</h2>
      <p class="py-2 px-1 text-wrap inline-block">
        This performance contains references to, depictions of, and/or
        discussions around topics that may cause distress or challenging
        emotions for some of our audience members. If you have any questions
        about the content of this production or the information below, please
        contact
        <a :href="`mailto:${contactEmail}`" class="underline">{{
          contactEmail
        }}</a
        >.
      </p>
      <ul class="gap-y-2 flex flex-col">
        <li v-for="cw in contentWarnings" :key="cw.warning.id">
          <content-warning-display :content-warning="cw.warning" />
        </li>
        <li
          v-if="contentWarnings.length === 0"
          ref="no-categories"
          class="w-full px-3 text-sta-rouge font-bold"
        >
          No further information is available.
        </li>
      </ul>
    </div>
  </modal>
</template>

<script>
import ContentWarningDisplay from './ContentWarningDisplay.vue';
import Modal from '~/components/ui/Modal.vue';
export default {
  components: { Modal, ContentWarningDisplay },
  props: {
    contentWarnings: {
      required: true,
      type: Array
    },
    contactEmail: {
      required: true,
      type: String
    }
  },

  emits: ['close']
};
</script>
