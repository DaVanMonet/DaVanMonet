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
	mounted()
	{
		const prismElement = this.$el.querySelector('code');
		let beautifiedSource = "";
		if(this.language)
		{
			let language = "";
			switch (this.language) 
			{
				case 'vue':
				case 'html':
				case 'markup':
				{
					beautifiedSource = htmlBeautify.html_beautify(this.source, BEAUTIFY_CONFIG);
					language = 'html';
					break;
				}

				case 'css':
				case 'scss':
				{
					beautifiedSource = cssBeautify.css_beautify(this.source, BEAUTIFY_CONFIG);
					language = 'css';
					break;
				}

				case 'js':
				case 'javascript':
				{
					beautifiedSource = jsBeautify.js_beautify(this.source, BEAUTIFY_CONFIG);
					language = 'javascript';
					break;
				}

				default: break;
			}
			if(language)
			{
				prismElement.innerHTML = prism.highlight(beautifiedSource, prism.languages[language]);

				prism.highlightElement(prismElement);
			}
			else
			{
				console.log('Language was not taken care of: ', this.language)
			}
		}
		else
		{
			console.warn("Language type for component preview was undefined");
		}
	},
};
</script>

<style lang="scss" src="@/styles/vendor/prismjs.scss"></style>
