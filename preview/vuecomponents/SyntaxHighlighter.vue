<template>
  <div class="showcase__source code">
    <pre><code>{{ source }}</code></pre>
  </div>
</template>

<script>
// import prism from 'prismjs';
// import htmlBeautifier from '@/vendor/beautify-html';
// import prismLineNumberPlugin from '@/vendor/prism-line-number-plugin';

// TODO: Move prism import and running of prism plugin to separate /vendor file
//prismLineNumberPlugin();

module.exports = {
  name: 'syntax-highlighter',
  props: ['source', 'language'],
  data() {
    return {
      highlightedSource: '',
    };
  },
  mounted() {
  this.$nextTick(() =>
	{
    $(this.$el).find('pre code').each((i, block) =>
    {
      window["highlight"].highlightBlock(block);
    });
	});
  },
};
</script>
