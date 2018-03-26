<template>
<div class="davanmonet-maincontentcontainer">
    <h1 class="davanmonet-maincontent-headline" v-if="content.Title" v-html="content.Title"></h1>
    <div class="davanmonet-maincontent-preamble" v-if="content.Preamble" v-html="content.Preamble"></div>
    <div class="davanmonet-maincontent-mainbody" v-if="content.MainBody" v-html="content.MainBody"></div>
    <div v-if="content.ComponentItems" class="davanmonet-maincontent-sections">
      <div v-for="(componentItem, index) in content.ComponentItems" class="davanmonet-maincontent-section" :key="componentItem.id">
       
        <component-showcase :css-breakpoints="cssBreakpoints" :showcase-data="componentItem" :showcase-is-only-component="content.ComponentItems.length === 1"></component-showcase>
        <div v-if="componentItem.componentid" class="davanmonet-idtext"><label :for="'componentid-' + index" v-on:click.stop="ClickOnIDLabel('componentid-' + index)">Component ID:</label>
        <input type="text" :id="'componentid-' + index" :value="componentItem.componentid"/></div>

        <div v-if="componentItem.id && componentItem.componentid != componentItem.id" class="davanmonet-idtext"><label :for="'documentationguid-' + index" v-on:click.stop="ClickOnIDLabel('documentationguid-' + index)">Documentation ID:</label>
        <input type="text" :id="'documentationguid-' + index" :value="componentItem.id"/></div>
        
      </div>
    </div>
    <div v-if="content.id && content.ComponentItems.length > 1" class="davanmonet-idtext" ><label for="articleid" v-on:click.stop="ClickOnIDLabel('articleid')">Article ID:</label> <input type="text" id="articleid" :value="content.id"/></div>
  </div>
</template>

<script>
// import prism from 'prismjs';
// import htmlBeautifier from '@/vendor/beautify-html';
// import prismLineNumberPlugin from '@/vendor/prism-line-number-plugin';

// TODO: Move prism import and running of prism plugin to separate /vendor file
//prismLineNumberPlugin();

import ComponentShowcase from '@/components/preview-frame/ComponentShowcase.vue';

export default {
  name: 'maincontent',
  components: {
    ComponentShowcase
  },
  props: ['content','cssBreakpoints'],
  methods: {
    ClickOnIDLabel(inputid)
    {
      let input = document.getElementById(inputid);
      input.select();
      try {
      let copyresult = document.execCommand('copy');
      console.info('Result of copy to clipboard', copyresult)
      } catch(e)
      {
        console.error('Could not copy to clipboard');
      }
    }
  }
};
</script>
