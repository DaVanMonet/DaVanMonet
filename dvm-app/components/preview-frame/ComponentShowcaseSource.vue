<template>
	<div class="showcase__source">
		<syntax-highlighter :source="source" :language="language"></syntax-highlighter>

		<ul class="showcase__source-controls">
			<li>
				<copy-to-clipboard copied-title="Copied!" :copy-data="source">
					<a href="javascript:;">Copy to clipboard</a>
				</copy-to-clipboard>
			</li>
		</ul>
	</div>
</template>

<script>
import CopyToClipboard from '@/components/CopyToClipboard';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';

export default {
	name: 'component-showcase-source',
	components: { CopyToClipboard, SyntaxHighlighter },
	mounted()
	{
	},
	props: {
		source: String,
		language: {
			type: String,
			default: 'markup',
		},
	},
};
</script>


<style lang="less">

@import '../../styles/colors';

/* _showcase default */

	

</style>
