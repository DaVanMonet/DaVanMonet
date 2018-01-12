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

export default {
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

<style lang="scss">
$color--white: #fff;
$color--black: #000;

$color--grey: #d6d6d6;

  .tooltip {
    font-size:1.4rem;
    display: none;
    position: absolute;
    padding: 1.4rem 1.3rem 1.2rem;
    margin-bottom: 1rem;
    color: $color--black;
    background-color: $color--white;
    border: 1px solid $color--grey;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);

    &--is-visible { display: block; }

    &:after,
    &:before {
      content: '';
    	top: 100%;
    	left: 50%;
    	border: solid transparent;
    	height: 0;
    	width: 0;
    	position: absolute;
    	pointer-events: none;
    }

    &:after {
    	border-color: transparent;
    	border-top-color: $color--white;
    	border-width: 6px;
    	margin-left: -6px;
    }

    &:before {
    	border-color: transparent;
    	border-top-color: $color--grey;
    	border-width: 7px;
    	margin-left: -7px;
    }
  }




</style>
