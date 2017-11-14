<template>
  <div class="showcase">
    <div class="showcase__header row">
      <div class="col-md-8 col-sm-12">

        <h3 class="heading heading--smaller" v-if="showcaseData.Title && showcaseIsOnlyComponent == false" v-html="showcaseData.Title"></h3>
        <div v-if="showcaseData.Preamble"><p v-html="showcaseData.Preamble"></p></div>
        <div v-if="showcaseData.Content" v-html="showcaseData.Content"></div>
      </div>
    </div>
     <div class="showcase__example" v-if="hasStates">
      <component-showcase-repos-stylesheets :repos="componentRepos"></component-showcase-repos-stylesheets>
      <div class="showcase__render-wrapper">
        <resizeable-element
          ref="resizeableElement"
          @onWidthChange="onResizeableWidthChange"
          class="showcase__render-resizeable">
          <component-showcase-render
            v-for="state in showcaseData.States"
            v-if="state.Title === selectedStateTitle"
            :key="state.Title"
            :renderSource="state.RenderSource"
            :repo="showcaseRepo"
            :requirejs="state.Requirejs"
            :iframeContentHeight.sync="iframeContentHeight">
          </component-showcase-render>
        </resizeable-element>
      </div>
  
      <component-showcase-settings-drawer
        :states="showcaseData.States"
        :selectedStateTitle.sync="selectedStateTitle"
        :isSettingsDrawerExpanded.sync="isDetailExpanded"
        :cssBreakpoints="cssBreakpoints"
        :selectedCssBreakpointId.sync="selectedCssBreakpointId"
        :showcase-repo="showcaseRepo"
        :itemKey="itemKey"
        @onCssBreakpointChange="onCssBreakpointChange">
      </component-showcase-settings-drawer>

      <div v-if="state.Title === selectedStateTitle" v-for="state in showcaseData.States"  :key="state.Title">
        <component-showcase-source>
          <syntax-highlighter :source="state.PreviewMarkup" language="markup"></syntax-highlighter>
        </component-showcase-source>

        <ul class="showcase__source-controls">
          <li>
            <copy-to-clipboard copied-title="Copied!" :copy-data="state.PreviewMarkup">
              <a href="javascript:;">Copy to clipboard</a>
            </copy-to-clipboard>
          </li>
          <li v-if="showcaseData.SourceUrl"><a class="link--secondary" :href="showcaseData.SourceUrl" target="_blank">Source</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import CopyToClipboard from '@/components/CopyToClipboard.vue';
import SyntaxHighlighter from '@/components/SyntaxHighlighter.vue';
import ResizeableElement from '@/components/ResizeableElement.vue';
import ComponentShowcaseRender from '@/components/preview-frame/ComponentShowcaseRender.vue';
import ComponentShowcaseSource from '@/components/preview-frame/ComponentShowcaseSource.vue';
import ComponentShowcaseReposStylesheets from '@/components/preview-frame/ComponentShowcaseReposStylesheets.vue';
import ComponentShowcaseSettingsDrawer from '@/components/preview-frame/ComponentShowcaseSettingsDrawer.vue';

export default {
  name: 'component-showcase',
  components: {
    CopyToClipboard,
    SyntaxHighlighter,
    ResizeableElement,
    ComponentShowcaseRender,
    ComponentShowcaseSource,
    ComponentShowcaseReposStylesheets,
    ComponentShowcaseSettingsDrawer,
  },
  props: ['showcaseData',"cssBreakpoints","showcaseIsOnlyComponent", "itemKey"],
  data() {
    return {
      hasStates: true,
      selectedStateTitle: '',
      isDetailExpanded: false,
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
    },
    showcaseRepo()
    {
      return this.componentRepos[0];
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

      if (selectedCssBreakpoint && this.selectedCssBreakpointId !== selectedCssBreakpoint.id) {
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
