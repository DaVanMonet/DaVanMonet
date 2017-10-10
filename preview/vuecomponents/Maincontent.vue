<template>
<div class="davanmonet-maincontentcontainer">
    <h1 class="davanmonet-maincontent-headline" v-html="content.Title"></h1>
    <div class="davanmonet-maincontent-content" v-html="content.Preamble"></div>
    
    <div v-if="content.ComponentItems" class="davanmonet-maincontent-sections">
      <div v-for="componentItem in content.ComponentItems" class="davanmonet-maincontent-section">
        Component item
        <h1 class="davanmonet-maincontent-section-headline" v-html="componentItem.Title"></h1>
        <div class="davanmonet-maincontent-section-content" v-html="componentItem.Preamble"></div>
        
        <component-showcase :css-breakpoints="cssBreakpoints" :showcase-data="componentItem"></component-showcase>

        <div v-if="componentItem.id" class="davanmonet-maincontent-section-id">{{componentItem.id}}</div>

      </div>			
    </div>
    <div v-if="content.id" class="davanmonet-maincontent-id">{{content.id}}</div>
  </div>
</template>

<script>
// import prism from 'prismjs';
// import htmlBeautifier from '@/vendor/beautify-html';
// import prismLineNumberPlugin from '@/vendor/prism-line-number-plugin';

// TODO: Move prism import and running of prism plugin to separate /vendor file
//prismLineNumberPlugin();

module.exports = {
  name: 'maincontent',
  components:
  [
    "url:/vuecomponents/component/ComponentShowcase.vue"
  ],
  template: '#vuetemplate-maincontent',
  props: ['content','cssBreakpoints']
};
</script>
