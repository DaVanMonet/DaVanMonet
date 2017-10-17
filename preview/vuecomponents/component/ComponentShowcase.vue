<template>
  <div class="showcase">
    <div class="showcase__header row">
      <div class="col-md-8 col-sm-12">
        <h3 class="heading heading--smaller" v-if="showcaseData.Title" v-html="showcaseData.Title"></h3>
        <div v-if="showcaseData.Preamble" v-html="showcaseData.Preamble"></p>
      </div>
    </div>
     <div class="showcase__example" v-if="hasStates">
      <component-showcase-repos-stylesheets :repos="componentRepos"></component-showcase-repos-stylesheets>
      <div class="showcase__render-wrapper">
        <resizeable-element
          ref="resizeableElement"
          @on-width-change="onResizeableWidthChange"
          class="showcase__render-resizeable">
          <component-showcase-render 
            v-if="state.Title === selectedStateTitle" 
            v-for="state in showcaseData.States" 
            :key="state.Title" 
            :render-source="state.RenderSource" 
            :repo-name="componentRepos[0].Name"
            :iframe-content-height.sync="iframeContentHeight"
            :requirejs="state.requirejs"
            ></component-showcase-render>
        </resizeable-element>
      </div>
  
      <component-showcase-settings-drawer
        :states="showcaseData.States"
        :selected-state-title.sync="selectedStateTitle"
        :is-settings-drawer-expanded.sync="isSettingsDrawerExpanded"
        :css-breakpoints="cssBreakpoints"
        :selected-css-breakpoint-id.sync="selectedCssBreakpointId"
        @on-css-breakpoint-change="onCssBreakpointChange">
      </component-showcase-settings-drawer>

      <div v-if="state.Title === selectedStateTitle" v-for="state in showcaseData.States"  :key="state.Title">
        <component-showcase-source>
          <syntax-highlighter :source="state.PreviewMarkup" language="markup"></syntax-highlighter>
        </component-showcase-source>

        <!-- <ul class="showcase__source-controls">
          <li>
            <copy-to-clipboard copied-title="Copied!" :copy-data="state.PreviewMarkup">
              <a href="javascript:;">Copy to clipboard</a>
            </copy-to-clipboard>
          </li>
          <li v-if="showcaseData.SourceUrl"><a class="link--secondary" :href="showcaseData.SourceUrl" target="_blank">Source</a></li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>

module.exports = {
  name: 'component-showcase',
  components: [
    "url:/vuecomponents/CopyToClipboard.vue",
    "url:/vuecomponents/SyntaxHighlighter.vue",
    "url:/vuecomponents/ResizeableElement.vue",
    "url:/vuecomponents/component/ComponentShowcaseRender.vue",
    "url:/vuecomponents/component/ComponentShowcaseSource.vue",
    "url:/vuecomponents/component/ComponentShowcaseReposStylesheets.vue",
    "url:/vuecomponents/component/ComponentShowcaseSettingsDrawer.vue",
  ],
  props: ['showcaseData',"cssBreakpoints"],
  data() {
    return {
      hasStates: true,
      selectedStateTitle: '',
      isSettingsDrawerExpanded: false,
      iframeContentHeight: undefined,
      selectedCssBreakpointId: undefined,
      componentRepos: [],
    };
  },
  computed: {
    selectedCssBreakpoint() {
      if (this.cssBreakpoints) {
        return this.cssBreakpoints.filter(cssBreakpoint => cssBreakpoint.id === this.selectedCssBreakpointId)[0];
      }
    }
  },
  methods: {
    onResizeableWidthChange(width) {
      this.setSelectedCssBreakpointIdFromWidth(width);
    },
    onCssBreakpointChange(cssBreakpoint) {
      this.$refs.resizeableElement.setWidth(cssBreakpoint.width);
    },
    setSelectedCssBreakpointIdFromWidth(width) {
      let fromWidth = width === '100%' ? Number.MAX_SAFE_INTEGER : width;

      const selectedCssBreakpoint = this.cssBreakpoints.filter(breakpoint => {
        return breakpoint.fromWidth <= fromWidth && breakpoint.toWidth >= fromWidth;
      })[0];

      if (!selectedCssBreakpoint || this.selectedCssBreakpointId !== selectedCssBreakpoint.id) {
        this.selectedCssBreakpointId = selectedCssBreakpoint.id;
      }
    },
  },
  created() {
    // Set first showcase state as the selected state per default
    this.hasStates = (this.showcaseData.States.length > 0);
    if (this.hasStates) {
      
      this.selectedStateTitle = this.showcaseData.States[0].Title;
    }
    // Set preset CSS breakpoints and select the last breakpoint as selected per default
    //this.cssBreakpoints = CSS_BREAKPOINTS;
    this.selectedCssBreakpointId = this.cssBreakpoints.slice(-1)[0].id;
  
  //Set repo information and add the stylesheet references
    const repo = this.$root.getRepo();
    this.componentRepos.push(repo);
  },
};
</script>
