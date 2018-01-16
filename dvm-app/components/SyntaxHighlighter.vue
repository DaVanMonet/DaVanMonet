<template>
  <div class="showcase__source code">
    <pre :class="`line-numbers language-${this.language}`"><code :class="`line-numbers language-${this.language}`"></code></pre>
  </div>
</template>

<script>
import prism from 'prismjs';
import prismScssGrammar from '@/vendor/prism-scss-grammar';
import prismLineNumberPlugin from '@/vendor/prism-line-number-plugin';

import jsBeautify from 'js-beautify/js/lib/beautify';
import htmlBeautify from 'js-beautify/js/lib/beautify-html';
import cssBeautify from 'js-beautify/js/lib/beautify-css';

prismScssGrammar(prism);
prismLineNumberPlugin();

var BEAUTIFY_CONFIG = {
  indent_size: 2,
  max_preserve_newlines: 5,
  break_chained_methods: false,
  indent_scripts: 'normal',
  brace_style: 'collapse',
  space_before_conditional: true,
  wrap_line_length: 0,
};

export default {
  name: 'syntax-highlighter',
  props: {
    source: String,
    language: String,
  },
  data() {
    return {
      highlightedSource: '',
    };
  },
  mounted() {
    const prismElement = this.$el.querySelector('code');
    let beautifiedSource;
    
    switch (this.language) {
      case 'html':
      case 'markup': {
        beautifiedSource = htmlBeautify.html_beautify(this.source, BEAUTIFY_CONFIG);
        break;
      }

      case 'css':
      case 'scss': {
        beautifiedSource = cssBeautify.css_beautify(this.source, BEAUTIFY_CONFIG);
        break;
      }

      case 'js':
      case 'javascript': {
        beautifiedSource = jsBeautify.js_beautify(this.source, BEAUTIFY_CONFIG);
        break;
      }

      default: break;
    }

    prismElement.innerHTML = prism.highlight(beautifiedSource, prism.languages[this.language]);

    prism.highlightElement(prismElement);
  },
};
</script>

<style lang="scss" src="@/styles/vendor/prismjs.scss"></style>