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
      //this.setIframeHeightToContentSize();
      this.$root.iframeResizer = iframeResizer( { log: false }, 'iframe' );

      var iframeWin = this.$refs.iframe.contentWindow;
      
      iframeWin.addEventListener('resize', () => { this.$refs.iframe.iFrameResizer.resize(); this.$parent.setHeight(this.$refs.iframe.clientHeight) });
    },
    populateIframeWithRenderSource() {
      // Add this.renderSource
      const renderElm = this.$refs.iframe.contentDocument.body.querySelector('.showcase__render');
      renderElm.innerHTML = this.renderSource;

      // Add script modules to iframe
      // if(typeof this.requirejs === "string" && this.requirejs.length > 0)
      // {
      //   const loadModulesEvent = new CustomEvent('LoadModulesInIframe', {});
      //   renderElm.dataset["requirejsModules"] = this.requirejs;
      //   renderElm.dataset["requirejsBaseurl"] = this.repo.BaseUrlToPatternLibrary;
      //   renderElm.dispatchEvent(loadModulesEvent);
      // }

      // Duplicate our stylesheets into the iframe document head
      // const linkStyleEls = Array.prototype.slice.call(document.querySelectorAll('div[data-repo-id="id-'+ this.repo.RepoId +'"] link[data-previewcss]'));
      // linkStyleEls.forEach(el => 
      // {
      //   let clone = el.cloneNode(true);
      //   clone.removeAttribute('disabled');
      //   this.$refs.iframe.contentDocument.head.appendChild(clone);
      // });

      // TODO: Put isLocalhost in vuex store
      //let isLocalhost = (window.location.hostname === "localhost");

      // Inject live reload script into iframe
      //if(isLocalhost && this.$root.getConfig().developmentenvironment && this.$root.getConfig().developmentenvironment.livereloadport)
      //{
      //  var liveReloadScript = document.createElement('script');
      //  liveReloadScript.setAttribute('src', '//localhost:' + this.$root.getConfig().developmentenvironment.livereloadport + '/livereload.js');
      //  this.$refs.iframe.contentDocument.head.appendChild(liveReloadScript);
      //}
      
    },
    // setIframeHeightToContentSize() {
    //   const iframeContentHeight = `${this.$refs.iframe.contentDocument.body.scrollHeight}px`;

    //   this.$refs.iframe.style.height = iframeContentHeight;

    //   this.$emit('update:iframeContentHeight', iframeContentHeight);
    // },
  },
  mounted() {
    this.$refs.iframe.addEventListener('load', this.onIframeLoad);
  },
  beforeDestroy() {
    this.$refs.iframe.removeEventListener('load', this.onIframeLoad);
  },
};
</script>
