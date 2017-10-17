<template>
  <div class="showcase__render-iframe-wrapper">
    <iframe ref="iframe" class="showcase__render-iframe" src="/static/showcase-render-iframe.html" :data-reponame="repoName" scrolling="no"></iframe>
  </div>
</template>

<script>
module.exports =  {
  name: 'component-showcase-render',
  props: ['renderSource','requirejs', 'iframeContentHeight', 'repoName'],
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
    
      let requirejsInputfield = this.$refs.iframe.contentDocument.body.querySelector('#requirejs-modules');
      if(requirejsInputfield.dataset["gotModules"] !== true && typeof this.requirejs === "string" && this.requirejs.length > 0)
      {
        requirejsInputfield.value = this.requirejs;
        requirejsInputfield.dataset["gotModules"] = true;
      }

      // Duplicate our stylesheets into the iframe document head
      const linkStyleEls = Array.prototype.slice.call(document.querySelectorAll('style,div[data-reponame="'+ this.repoName +'"] link[data-previewcss]'));
      linkStyleEls.forEach(el => 
      {
        let clone = el.cloneNode(true);
        clone.removeAttribute('disabled');
        this.$refs.iframe.contentDocument.head.appendChild(clone);
      });
      
    },
    setIframeHeightToContentSize() {
      const iframeContentHeight = `${this.$refs.iframe.contentDocument.body.scrollHeight}px`;

      this.$refs.iframe.style.height = iframeContentHeight;

      this.$emit('update:iframeContentHeight', iframeContentHeight);
    },
  },
  mounted() {
    this.$refs.iframe.addEventListener('load', this.onIframeLoad);
    console.log('this.requirejsModules',this.requirejs)
  },
  beforeDestroy() {
    this.$refs.iframe.removeEventListener('load', this.onIframeLoad);
  },
};
</script>
