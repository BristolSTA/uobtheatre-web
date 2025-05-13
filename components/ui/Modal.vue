<template>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 flex bg-black bg-opacity-50 items-center justify-center p-2 md:p-5 -my-2"
  >
    <div class="shadow flex flex-col overflow-x-auto bg-sta-gray max-h-full">
      <header
        class="bg-sta-gray-light border-b border-sta-gray-dark flex justify-between p-4"
      >
        <slot name="header" />
        <button type="button" @click="close">
          <font-awesome-icon icon="times" />
        </button>
      </header>

      <section class="modal-body p-4 overflow-y-auto">
        <slot />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>
