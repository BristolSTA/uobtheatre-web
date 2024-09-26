<template>
  <div
    class="relative p-2 bg-sta-gray-dark rounded"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragOver"
  >
    <div
      v-if="draggingOver"
      class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-sta-gray-dark bg-opacity-80"
      @dragleave.prevent="onDragLeave"
    >
      <strong>Release to swap</strong>
    </div>
    <div class="flex flex-col items-center space-y-2">
      <div v-if="file">
        <img
          :src="fileDataUrl"
          class="max-h-52 pointer-events-none select-none"
        />
        <div class="mt-3 text-center">
          <error-helper v-if="error">
            {{ error }}
          </error-helper>
          <button
            class="p-1 mr-0.5 bg-sta-orange hover:bg-sta-orange-dark rounded transition-colors"
            @click="file = null"
          >
            Remove
          </button>
          <button
            class="p-1 ml-0.5 bg-sta-orange hover:bg-sta-orange-dark rounded transition-colors"
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
            class="p-1 bg-sta-orange hover:bg-sta-orange-dark rounded transition-colors"
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
import ErrorHelper from '../ErrorHelper.vue';
import { swal } from '@/utils/alerts';
export default {
  components: { ErrorHelper },
  props: {
    modelValue: {
      default: null,
      type: [String]
    },
    maxFileSizeMb: {
      default: 2,
      type: Number
    },
    requiredRatio: {
      default: null,
      type: Number
    },
    minWidth: {
      default: null,
      type: Number
    },

    ratioFlexability: {
      // How flexiable we can be on accepting perfect ratio
      default: 0.05,
      type: Number
    }
  },
  emits: ['change'],
  data() {
    return {
      draggingOver: false,

      file: this.modelValue,
      fileDataUrl: this.modelValue,
      error: null
    };
  },
  watch: {
    file(newFile, oldFile) {
      this.$emit('change', newFile);

      if (!newFile) {
        return (this.fileDataUrl = null);
      }
      if (!(newFile instanceof Blob)) {
        return (this.fileDataUrl = newFile);
      }
      const fr = new FileReader();
      fr.onload = () => {
        this.fileDataUrl = fr.result;

        this.validateFile(newFile, fr.result).then((result) => {
          if (!result) {
            this.file = oldFile;
          }
        });
      };
      fr.readAsDataURL(newFile);
    }
  },
  methods: {
    validateFile(file, fileReaderResult) {
      return new Promise((resolve) => {
        if (file.size / 1000000 > this.maxFileSizeMb) {
          swal.fire({
            title: 'Sorry, this image is too large',
            text: `Please ensure your file is under ${this.maxFileSizeMb}MB`
          });
          return resolve(false);
        }

        const image = new Image();
        image.onload = () => {
          if (this.requiredRatio) {
            const ratio = image.width / image.height;
            const maxAllowableRatio =
              this.requiredRatio * (1 + this.ratioFlexability);
            const minAllowableRatio =
              this.requiredRatio * (1 - this.ratioFlexability);

            if ((ratio > maxAllowableRatio) | (ratio < minAllowableRatio)) {
              swal.fire({
                title: "Sorry, this image doesn't have the correct ratio",
                text: `Please ensure your image has a ratio of ${this.requiredRatio}:1`
              });
              return resolve(false);
            }
          }
          if (this.minWidth) {
            if (image.width < this.minWidth) {
              swal.fire({
                title: "Sorry, this image doesn't have the correct width",
                text: `Please ensure your image has width of atleast ${this.minWidth}px`
              });
              return resolve(false);
            }
          }

          resolve(true);
        };
        image.src = fileReaderResult;
      });
    },
    onDrop(event) {
      this.draggingOver = false;

      const files = Array.from(event.dataTransfer.files).filter((file) =>
        file.type.startsWith('image')
      );
      if (event && files.length) {
        this.file = files[0];
      } else {
        this.error = 'Unsupported file type';
      }
    },
    handleFileSelection(e) {
      this.file = e.target.files[0];
    },
    onDragOver() {
      this.draggingOver = true;
    },
    onDragLeave() {
      this.draggingOver = false;
    }
  }
};
</script>
