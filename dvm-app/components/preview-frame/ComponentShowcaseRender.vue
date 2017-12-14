<template>
  <div class="showcase__render-iframe-wrapper">
    <iframe
      ref="iframe"
      class="showcase__render-iframe"
      src="/showcase-render-iframe.html"
      scrolling="no"
      :data-repo-name="repo.Name"
      :data-repo-id="'id-'+ repo.RepoId"
      ></iframe>
  </div>
</template>

<script>
import { iframeResizer } from 'iframe-resizer'

export default {
  name: 'component-showcase-render',
  props: ['renderSource','requirejs', 'iframeContentHeight', 'repo'],
  methods: {
    
    onIframeLoad() {
      this.populateIframeWithRenderSource();
      this.$root.iframeResizer = iframeResizer( { log: false }, 'iframe' );

      var iframeWin = this.$refs.iframe.contentWindow;

      this.$parent.$emit('register-iframe', this.$refs.iframe);
      
      iframeWin.addEventListener('resize', () => { this.$refs.iframe.iFrameResizer.resize(); this.$parent.setHeight(this.$refs.iframe.clientHeight) });
    },

    populateIframeWithRenderSource() {
      // Add this.renderSource
      const renderElm = this.$refs.iframe.contentDocument.body.querySelector('.showcase__render');
      renderElm.innerHTML = this.renderSource; 
    }

  },

  mounted() {
    this.$refs.iframe.addEventListener('load', this.onIframeLoad);
  },

  beforeDestroy() {
    this.$refs.iframe.removeEventListener('load', this.onIframeLoad);
  },

};
</script>

<style lang="less">
  @import '../../styles/colors';

  .showcase__render-iframe-wrapper {
    position: relative;
    z-index: 2;
  }

  .showcase__render-wrapper,
  .showcase__render-resizeable {
    position: relative;
    margin: 0 auto;
    line-height: 0;
  }

  .showcase__render-wrapper {
    overflow: hidden;
  }

  .showcase__render-iframe {
    position: relative;
    z-index: 2;
    width: 100%;
    border: none;
  }

  .showcase__render {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rem 2.5rem;

    &--buttons {
      flex-direction: row;

      * {
        margin-right: 2.5%;

        &:last-child { margin-right: 0; }
      }
    }

    &--checkboxes,
    &--radio-buttons { flex-direction: column; }

    &--checkboxes * {
      margin-bottom: 1.25rem;

      &:last-child { margin-bottom: 0; }
    }
  }

  .showcase__render-iframe-wrapper {
      
  }


</style>