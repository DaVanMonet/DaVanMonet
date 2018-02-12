<template>
  <syntax-highlighter :source="code" :language="language"></syntax-highlighter>
</template>

<script>
//import { toArray } from '@/utils';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';

export default {
  name: 'item-codeblock',
  components: { SyntaxHighlighter },
  props: ['html'],
  data: function() {
    return {
      language: undefined,
      code: undefined
    };
  },
  methods: {
    htmlDecode(input) {
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    },
  },
  created() {
    const classnames = this.html.className.split('-');
    const codeElementFromItem = Array.prototype.slice.call(this.html.querySelectorAll('code'))[0];
    this.language = classnames[classnames.length-1];
    this.code = this.htmlDecode(codeElementFromItem.innerHTML);
  },
};
</script>
