<template>
  <div>
    <div v-if="editor" class="flex px-3">
      <editor-button
        active-key="bold"
        icon="bold"
        title="Bold"
        class="pl-3 rounded-tl-md"
        :editor="editor"
        @click="$event.toggleBold().run()"
      />
      <editor-button
        active-key="italic"
        icon="italic"
        title="Italic"
        :editor="editor"
        @click="$event.toggleItalic().run()"
      />
      <div class="w-6 bg-white" />
      <editor-button
        active-key="paragraph"
        icon="paragraph"
        title="Paragraph"
        :editor="editor"
        @click="$event.setParagraph().run()"
      />
      <editor-button
        :active-key="['heading', { level: 1 }]"
        title="Heading 1"
        class="font-bold"
        :editor="editor"
        @click="$event.toggleHeading({ level: 1 }).run()"
      >
        H1
      </editor-button>
      <editor-button
        :active-key="['heading', { level: 2 }]"
        title="Heading 2"
        class="font-bold"
        :editor="editor"
        @click="$event.toggleHeading({ level: 2 }).run()"
      >
        H2
      </editor-button>
      <div class="w-6 bg-white" />
      <editor-button
        active-key="bulletList"
        icon="list-ul"
        title="Bullet List"
        :editor="editor"
        @click="$event.toggleBulletList().run()"
      />
      <editor-button
        active-key="orderedList"
        icon="list-ol"
        title="Numbered List"
        :editor="editor"
        @click="$event.toggleOrderedList().run()"
      />
      <editor-button
        active-key="blockquote"
        icon="quote-right"
        title="Block Quote"
        :editor="editor"
        @click="$event.toggleBlockquote().run()"
      />
      <div class="w-6 bg-white" />
      <editor-button
        icon="undo"
        title="Undo"
        :editor="editor"
        @click="$event.undo().run()"
      />
      <editor-button
        icon="redo"
        title="Redo"
        class="mr-3 rounded-tr-md"
        :editor="editor"
        @click="$event.redo().run()"
      />
    </div>
    <div class="p-2 border-2 border-white">
      <editor-content :editor="editor" class="cursor-text" />
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import EditorButton from './EditorButton.vue';

export default {
  components: {
    EditorContent,
    EditorButton
  },

  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],

  data() {
    return {
      editor: null
    };
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value;

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(this.value, false);
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [StarterKit],
      content: this.modelValue,
      editorProps: {
        attributes: {
          class: 'tiptap-output'
        }
      },
      onUpdate: () => {
        // HTML
        this.$emit('update:modelValue', this.editor.getHTML());
      }
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  }
};
</script>
