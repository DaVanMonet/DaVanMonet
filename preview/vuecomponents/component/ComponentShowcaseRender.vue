<template>
  <div class="showcase__render-iframe-wrapper">
    <iframe ref="iframe" class="showcase__render-iframe" src="/static/showcase-render-iframe.html" scrolling="no"></iframe>
  </div>
</template>

<script>
module.exports =  {
  name: 'component-showcase-render',
  props: ['renderSource', 'iframeContentHeight'],
  methods: {
    onIframeLoad() {
      this.populateIframeWithRenderSource();
      this.setIframeHeightToContentSize();
    },
    populateIframeWithRenderSource() {
      // Add this.renderSource
      this.$refs.iframe.contentDocument.body.querySelector('.showcase__render').innerHTML = this.renderSource;

      // Duplicate our stylesheets into the iframe document head
      // TODO: Remove this and add a static reference in the iframe src document?
      const linkStyleEls = Array.prototype.slice.call(document.head.querySelectorAll('style, link[rel="stylesheet"]'));

      linkStyleEls.forEach(el => this.$refs.iframe.contentDocument.head.appendChild(el.cloneNode(true)));
    },
    setIframeHeightToContentSize() {
      const iframeContentHeight = `${this.$refs.iframe.contentDocument.body.scrollHeight}px`;

      this.$refs.iframe.style.height = iframeContentHeight;

      this.$emit('update:iframeContentHeight', iframeContentHeight);
    },
  },
  mounted() {
    this.$refs.iframe.addEventListener('load', this.onIframeLoad);
  },
  beforeDestroy() {
    this.$refs.iframe.removeEventListener('load', this.onIframeLoad);
  },
};
</script>
