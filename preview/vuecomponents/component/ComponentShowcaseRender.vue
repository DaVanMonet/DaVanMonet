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
      let stylesToImport = [];
      stylesToImport = stylesToImport.concat(Array.prototype.slice.call(document.head.querySelectorAll('style')));
      stylesToImport = stylesToImport.concat(Array.prototype.slice.call(document.body.querySelectorAll('link[rel="preview-stylesheet"]')));
      
      stylesToImport.forEach(el =>
      {
        let style = el.cloneNode(true);
        style.setAttribute("rel","stylesheet");
        this.$refs.iframe.contentDocument.head.appendChild(style);
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
