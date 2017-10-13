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

      var iframeWin = this.$refs.iframe.contentWindow;
      iframeWin.addEventListener('resize', this.setIframeHeightToContentSize);
    },
    populateIframeWithRenderSource() {
      // Add this.renderSource
      this.$refs.iframe.contentDocument.body.querySelector('.showcase__render').innerHTML = this.renderSource;

      const linkStyleEls = Array.prototype.slice.call(document.querySelectorAll('link[data-previewcss]'));
      console.log(linkStyleEls);
      linkStyleEls.forEach(el => 
      {
        let clone = el.cloneNode(true);
        clone.removeAttribute('disabled');
        this.$refs.iframe.contentDocument.head.appendChild(clone);
      });
     // let scriptsToImport = Array.prototype.slice.call(document.body.querySelectorAll(['script[src$="livereload.js"]']));
      // scriptsToImport.forEach(el =>
      // {
      //   let script = el.cloneNode(true);
      //   this.$refs.iframe.contentDocument.body.appendChild(script);
      // });
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
