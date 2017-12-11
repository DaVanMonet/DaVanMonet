<template>
  <div class="showcase__settings-drawer">
    <div class="showcase__settings-drawer-toolbar">
      <button
        @click="onStateButtonClick()"
        :class="{ 'showcase__show-settings-drawer-button--is-expanded': isSettingsDrawerExpanded }"
        class="showcase__show-settings-drawer-button">
        <template v-if="!isSettingsDrawerExpanded">Show details</template>
        <template v-else>Hide details</template>
      </button>

      <ul class="showcase__size-selector" v-if="this.cssBreakpoints">
        <li
          v-for="cssBreakpoint in this.cssBreakpoints"
          :class="[
            `showcase__size-selector-button--${cssBreakpoint.title}`,
            cssBreakpoint.title === selectedCssBreakpointTitle ? 'showcase__size-selector-button--is-active': ''
          ]"
          :key="cssBreakpoint.id"
          @click="onCssBreakpointChange(cssBreakpoint)"
          class="showcase__size-selector-button"
          v-html="cssBreakpoint.title">
            
            <!-- <svg v-if="cssBreakpoint.id === 'mobile'" viewBox="0 0 1024 1024" width="100%" height="100%"><path d="M537.6 921.6h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path class="path2" d="M742.4 1024h-460.8c-42.347 0-76.8-34.451-76.8-76.8v-870.4c0-42.347 34.453-76.8 76.8-76.8h460.8c42.349 0 76.8 34.453 76.8 76.8v870.4c0 42.349-34.451 76.8-76.8 76.8zM281.6 51.2c-14.115 0-25.6 11.485-25.6 25.6v870.4c0 14.115 11.485 25.6 25.6 25.6h460.8c14.115 0 25.6-11.485 25.6-25.6v-870.4c0-14.115-11.485-25.6-25.6-25.6h-460.8z"></path><path d="M691.2 819.2h-358.4c-14.138 0-25.6-11.461-25.6-25.6v-665.6c0-14.138 11.462-25.6 25.6-25.6h358.4c14.139 0 25.6 11.462 25.6 25.6v665.6c0 14.139-11.461 25.6-25.6 25.6zM358.4 768h307.2v-614.4h-307.2v614.4z"></path></svg>
            <svg v-if="cssBreakpoint.id === 'tablet'" viewBox="0 0 1024 1024" width="100%" height="100%"><path d="M844.8 1024h-665.6c-42.347 0-76.8-34.451-76.8-76.8v-870.4c0-42.347 34.453-76.8 76.8-76.8h665.6c42.349 0 76.8 34.453 76.8 76.8v870.4c0 42.349-34.451 76.8-76.8 76.8zM179.2 51.2c-14.115 0-25.6 11.485-25.6 25.6v870.4c0 14.115 11.485 25.6 25.6 25.6h665.6c14.115 0 25.6-11.485 25.6-25.6v-870.4c0-14.115-11.485-25.6-25.6-25.6h-665.6z"></path><path d="M537.6 921.6h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path d="M793.6 819.2h-563.2c-14.138 0-25.6-11.461-25.6-25.6v-665.6c0-14.138 11.462-25.6 25.6-25.6h563.2c14.139 0 25.6 11.462 25.6 25.6v665.6c0 14.139-11.461 25.6-25.6 25.6zM256 768h512v-614.4h-512v614.4z"></path></svg>
            <svg v-if="cssBreakpoint.id === 'desktop'" viewBox="0 0 1024 1024" width="100%" height="100%"><path d="M896 102.4h-819.2c-42.347 0-76.8 34.453-76.8 76.8v512c0 42.349 34.453 76.8 76.8 76.8h384v102.4h-179.2c-14.138 0-25.6 11.461-25.6 25.6s11.462 25.6 25.6 25.6h409.6c14.139 0 25.6-11.461 25.6-25.6s-11.461-25.6-25.6-25.6h-179.2v-102.4h384c42.349 0 76.8-34.451 76.8-76.8v-512c0-42.347-34.451-76.8-76.8-76.8zM921.6 691.2c0 14.115-11.485 25.6-25.6 25.6h-819.2c-14.115 0-25.6-11.485-25.6-25.6v-512c0-14.115 11.485-25.6 25.6-25.6h819.2c14.115 0 25.6 11.485 25.6 25.6v512z"></path></svg> -->
        </li>
      </ul>

      <span class="showcase__render-state">{{ selectedStateTitle }} on {{ selectedCssBreakpointTitle+"".toLowerCase() }}</span>
    </div>

    <div v-if="isSettingsDrawerExpanded" class="showcase__settings-drawer-expanded container-fluid">
      <div class="row">
        <div class="col-md-3">
          <div class="demo-form-group__label">Viewport size</div>
          <div v-for="cssBreakpoint in this.cssBreakpoints" :key="cssBreakpoint.title" class="demo-radio-button demo-radio-button--white">
            <input
              :checked="cssBreakpoint.title === selectedCssBreakpointTitle"
              :value="cssBreakpoint.title"
              :id="cssBreakpoint.title"
              @change="onCssBreakpointChange(cssBreakpoint)"
              class="demo-radio-button__input visually-hidden"
              type="radio">
            <label class="demo-radio-button__label" :for="cssBreakpoint.title">
              <div class="demo-radio-button__custom-radio-button"></div>
              {{ cssBreakpoint.title }}
            </label>
          </div>
        </div>
        <div class="col-md-3">
          <div class="demo-form-group__label">States</div>
          <div v-for="state in states" :key="state.Title" class="demo-radio-button demo-radio-button--white">
            <input
              :checked="state.Title === selectedStateTitle"
              :value="state.Title"
              :id="state.Title"
              @change="onStateChange(state.Title)"
              class="demo-radio-button__input visually-hidden"
              type="radio">
            <label class="demo-radio-button__label" :for="state.Title">
              <div class="demo-radio-button__custom-radio-button"></div>
              {{ state.Title }}
            </label>
          </div>
        </div>
        <div class="col-md-3">
          <div v-if="showcaseRepo.Name" class="mb-4">
            <div class="demo-form-group__label mb-2">Repo</div>
            <a class="showcase__repo-link" :href="showcaseRepo.BaseUrlToPatternLibrary" target="_blank">{{ showcaseRepo.Name }}</a>
          </div>
          <div v-if="showcaseRepo.Version" class="mb-4">
            <div class="demo-form-group__label mb-2">Version</div>
            <div>{{ showcaseRepo.Version }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div v-if="itemKey" class="mb-4">
            <div class="demo-form-group__label mb-2">Article identifier</div>
            <div>
              <copy-to-clipboard title="Copy to clipboard" :copy-data="itemKey">
                <a href="javascript:;" class="showcase__copy-link">{{ itemKey }}</a>
              </copy-to-clipboard>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import CONFIG from '@/config';
import CopyToClipboard from '@/components/CopyToClipboard';

export default {
  name: 'component-showcase-settings-drawer',
  components: { CopyToClipboard },
  props: [
    'states',
    'selectedStateTitle',
    'isSettingsDrawerExpanded',
    'cssBreakpoints',
    'selectedCssBreakpointTitle',
    'showcaseRepo',
    'itemKey'
  ],
  data() {
    return {
      savedBreakpointTitle:null,
      saveStateTitle:null
    }
  },
  computed: {
    artifactoryHref() {
      return `${CONFIG.ARTIFACTORY_URL}/${this.showcaseRepo.Name}`;
    },
    reverseCssBreakpoints() {
      return this.cssBreakpoints.slice().reverse();
    },
  },
  methods: {
    onStateChange(stateTitle) {
      this.$emit('update:selectedStateTitle', stateTitle);
      if(sessionStorage && stateTitle)
      {
        sessionStorage.setItem("saveStateTitle", stateTitle);
      }
    },
    onStateButtonClick() {
      this.$emit('update:isSettingsDrawerExpanded', !this.isSettingsDrawerExpanded);
    },
    onCssBreakpointChange(cssBreakpoint) {
      this.$emit('onCssBreakpointChange', cssBreakpoint);
      this.$emit('update:selectedCssBreakpointTitle', cssBreakpoint.title);

      if(sessionStorage && cssBreakpoint && cssBreakpoint.title)
      {
        sessionStorage.setItem("saveCssBreakpointTitle", cssBreakpoint.title);
      }

    },
    getSelectedCssBreakpoint(title) {
      return this.cssBreakpoints.filter(p => p.title === title)[0];
    },
  },
  created()
  {
    if(sessionStorage)
    {
      this.savedBreakpointTitle = sessionStorage.getItem("saveCssBreakpointTitle")
      this.saveStateTitle = sessionStorage.getItem("saveStateTitle");
    }
  },
  mounted()
  {
    if(this.savedBreakpointTitle !== null)
    {
      const savedBreakpoint = this.getSelectedCssBreakpoint(this.savedBreakpointTitle);
      this.onCssBreakpointChange(savedBreakpoint);
    }
    if(this.saveStateTitle && this.states)
    {
      let savedState = this.states.filter(x => x.Title == this.saveStateTitle)[0];
      if(!savedState)
      {
        savedState =  this.states[0];
        
      }
      if(savedState)
      {
        this.$emit('update:selectedStateTitle', savedState.Title);
      }
    }
  }
};
</script>
