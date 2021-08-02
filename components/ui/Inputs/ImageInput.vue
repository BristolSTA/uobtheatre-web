<template>
  <div
    class="relative p-2 rounded bg-sta-gray-dark"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragOver"
  >
    <div
      v-if="draggingOver"
      class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-sta-gray-dark bg-opacity-80"
      @dragleave.prevent="onDragLeave"
    >
      <strong>Release to swap</strong>
    </div>
    <div class="flex flex-col items-center space-y-2">
      <div v-if="file">
        <img
          :src="fileDataUrl"
          class="pointer-events-none select-none max-h-52"
        />
        <div class="mt-3 text-center">
          <error-helper v-if="error">{{ error }}</error-helper>
          <button
            class="p-1 transition-colors rounded bg-sta-orange hover:bg-sta-orange-dark"
            @click="file = null"
          >
            Remove
          </button>
          <button
            class="p-1 transition-colors rounded bg-sta-orange hover:bg-sta-orange-dark"
            @click="$refs.fileInput.click()"
          >
            Replace
          </button>
        </div>
      </div>
      <div v-else class="text-center">
        <font-awesome-icon icon="image" class="fa-8x" />
        <p>
          Drag an image here or
          <button
            class="p-1 transition-colors rounded bg-sta-orange hover:bg-sta-orange-dark"
            @click="$refs.fileInput.click()"
          >
            Select
          </button>
        </p>
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelection"
    />
  </div>
</template>

<script>
import ErrorHelper from '../ErrorHelper.vue'
export default {
  components: { ErrorHelper },
  props: {
    value: {
      default: null,
      type: [String],
    },
  },
  data() {
    return {
      draggingOver: false,

      file: this.value,
      fileDataUrl: this.value,
      error: null,
    }
  },
  watch: {
    file(newFile) {
      this.$emit('changed', newFile)
      if (!newFile) return (this.fileDataUrl = null)
      const fr = new FileReader()
      fr.onload = () => {
        this.fileDataUrl = fr.result
      }
      fr.readAsDataURL(newFile)
    },
  },
  methods: {
    onDrop(event) {
      this.draggingOver = false

      const files = Array.from(event.dataTransfer.files).filter((file) =>
        file.type.startsWith('image')
      )
      if (event && files.length) {
        this.file = files[0]
      } else {
        this.error = `Unsupported file type`
      }
    },
    handleFileSelection(e) {
      this.file = e.target.files[0]
    },
    onDragOver() {
      this.draggingOver = true
    },
    onDragLeave(e) {
      this.draggingOver = false
    },
  },
}
</script>
