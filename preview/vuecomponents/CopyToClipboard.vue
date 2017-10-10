<template>
  <span
    ref="clipboard"
    @mouseover="onMouseover()"
    @mouseout="onMouseout()"
    :data-clipboard-text="copyData">
    <popper ref="popper" trigger="hover" :options="{ placement: 'top' }">
      <div class="popper tooltip" :class="{ 'tooltip--is-visible': currentTitle }">{{ currentTitle }}</div>
      <span slot="reference">
        <slot></slot>
      </span>
    </popper>
  </span>
</template>

<script>
import Vue from 'vue';
import Clipboard from 'clipboard';
import Popper from 'vue-popperjs';

module.exports = {
  name: 'copy-to-clipboard',
  components: { Popper },
  props: {
    title: String,
    copiedTitle: {
      type: String,
      default: 'Copied!',
    },
    copyData: null
  },
  clipboardInstance: undefined,
  data() {
    return {
      currentTitle: '',
      copiedTitleDuration: 1000,
    };
  },
  watch: {
    currentTitle() {
      this.updatePopper();
    },
  },
  methods: {
    onCopySuccess() {
      if (this.copiedTitleTimeout) { clearTimeout(this.copiedTitleTimeout); }

      this.currentTitle = this.copiedTitle;

      this.copiedTitleTimeout = setTimeout(() => {
        this.resetData();
      }, this.copiedTitleDuration);
    },
    onMouseover() {
      if (this.setCurrentTitleTimeout) { clearTimeout(this.setCurrentTitleTimeout); }

      this.currentTitle = this.title;
    },
    onMouseout() {
      if (this.setCurrentTitleTimeout) { clearTimeout(this.setCurrentTitleTimeout); }

      this.resetData();
    },
    resetData() {
      if (this.copiedTitleTimeout) { clearTimeout(this.copiedTitleTimeout); }

      setTimeout(() => {
        this.currentTitle = this.title;
      }, 20);
    },
    updatePopper() {
      if (this.$refs.popper && this.$refs.popper.popperJS) {
        this.$refs.popper.popperJS.update();
      }
    },
    destroyPopper() {
      if (this.$refs.popper && this.$refs.popper.popperJS) {
        this.$refs.popper.popperJS.destroy();
      }
    },
  },
  created() {
    this.currentTitle = this.title;
  },
  mounted() {
    this.clipboardInstance = new Clipboard(this.$refs.clipboard);

    this.clipboardInstance.on('success', this.onCopySuccess);
  },
  beforeDestroy() {
    this.destroyPopper();

    this.clipboardInstance.destroy();
  },
};
</script>
