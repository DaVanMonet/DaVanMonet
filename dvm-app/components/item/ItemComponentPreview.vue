<template v-if="componentStates.length">
<div class="showcase">
	<div class="showcase__example">

		<resizeable-element 
			ref="resizeableElement" 
			@onWidthChange="onResizeableWidthChange" 
			class="showcase__render-resizeable">
			<component-showcase-render 
					v-for="state in componentStates" 
					v-if="state.Title === selectedStateTitle" 
					:key="state.Title" 
					:renderSource="state.RenderSource" 
					:stateData="state" 
					:repo="showcaseRepo" 
					:requirejs="state.Requirejs" 
					:iframeContentHeight.sync="iframeContentHeight">
                </component-showcase-render>
		</resizeable-element>
		<component-showcase-settings-drawer 
				:states="componentStates" 
				:selectedStateTitle.sync="selectedStateTitle" 
				:isSettingsDrawerExpanded.sync="isDetailExpanded" 
				:cssBreakpoints="cssBreakpoints" 
				:selectedCssBreakpointTitle.sync="selectedCssBreakpointTitle" 
				:showcase-repo="showcaseRepo"
				@onCssBreakpointChange="onCssBreakpointChange"
			></component-showcase-settings-drawer>
		<div 
			v-if="state.Title === selectedStateTitle" 
			v-for="state in componentStates" 
			:key="state.Title" >
				<div class="showcase__source-wrapper">
					<component-showcase-source :source="state.PreviewMarkup" :language="state.Language"></component-showcase-source>
				</div>
		</div>
	</div>
</div>
</template>

<script>
//import { toArray } from '@/utils';
import Loader from '@/src/modules/loader.js';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import ResizeableElement from '@/components/ResizeableElement.vue';
import ComponentShowcaseRender from '@/components/preview-frame/ComponentShowcaseRender.vue';
import ComponentShowcaseSource from '@/components/preview-frame/ComponentShowcaseSource.vue';
//import ComponentShowcaseReposStylesheets from '@/components/preview-frame/ComponentShowcaseReposStylesheets.vue';
import ComponentShowcaseSettingsDrawer from '@/components/preview-frame/ComponentShowcaseSettingsDrawer.vue';

export default
{
    name: 'item-componentpreview',
    components:
    {
		ResizeableElement,
		ComponentShowcaseRender,
        ComponentShowcaseSource,
        //ComponentShowcaseReposStylesheets,
        ComponentShowcaseSettingsDrawer,
	},
    props: ['projectconfig','html'],
    data: function()
    {
        return {
			componentStates :[],
			selectedStateTitle: '',
			isDetailExpanded: false,
			iframeContentHeight: undefined,
			selectedCssBreakpointTitle: undefined,
			cssBreakpoints:undefined,
			showcaseRepo:undefined
        };
	},
	computed:
    {
        selectedCssBreakpoint()
        {
            if (this.cssBreakpoints)
            {
                let breakpoint = this.cssBreakpoints.filter(cssBreakpoint => cssBreakpoint.title === this.selectedCssBreakpointTitle)[0];
                return breakpoint;
            }
		}
		// ,
        // showcaseRepo()
        // {
        //     return this.componentRepos[0];
        // }
    },
    methods:
    {
		onResizeableWidthChange(width)
        {
            this.setSelectedCssBreakpointIdFromWidth(width);
        },
        onCssBreakpointChange(cssBreakpoint)
        {
            this.$refs.resizeableElement.setWidth(cssBreakpoint.width);
        },
        setSelectedCssBreakpointIdFromWidth(width)
        {
            let fromWidth = width === '100%' ? Number.MAX_SAFE_INTEGER : width;
            const selectedCssBreakpoint = this.cssBreakpoints.filter(breakpoint =>
            {
                return breakpoint.fromWidth <= fromWidth && breakpoint.toWidth >= fromWidth;
            })[0];

            if (selectedCssBreakpoint && this.selectedCssBreakpointTitle !== selectedCssBreakpoint.title)
            {
                this.selectedCssBreakpointTitle = selectedCssBreakpoint.title;
                this.$emit('onCssBreakpointChange', selectedCssBreakpoint);
                this.$emit('update:selectedCssBreakpointTitle', this.selectedCssBreakpointTitle);
            }
		},
		htmlDecode(input)
		{
			var e = document.createElement('div');
			e.innerHTML = input;
			return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
		},
		parseStatesFromMarkup(html)
		{
			let states = [];
			const headingTags = ["H1","H2","H3","H4","H5","H6","STRONG","EM"];
			const preTags = html.querySelectorAll('pre');
			for (let i = 0; i < preTags.length; i++)
			{
				const preTag = preTags[i];
				const codeTag = preTag.querySelector("code");
				let previousTag = preTag.previousElementSibling;
				previousTag = (previousTag != null && previousTag.tagName === "P" && previousTag.children.length === 1) ? previousTag.children[0] : previousTag;
				const title = (headingTags.indexOf(previousTag.tagName) !== -1) ? previousTag.innerText : "State #" + (i+1);
				const markup = document.createElement("div");
				const code = this.htmlDecode(codeTag.innerHTML);
				let language = codeTag.className.replace("language-",'');
				language = language.replace("lang-",'');
				let additionalScripts = [];
				
				markup.appendChild(preTag.cloneNode(true));

				let state = {
					Title: title,
					Language:language,
					markup: markup.innerHTML,
					PreviewMarkup:code,
					RenderSource: code
				}
				states.push(state);
			}
			return states;
		},
		init(_vue)
		{
			//await Loader.LoadData();
			_vue.cssBreakpoints = _vue.projectconfig.env.cssBreakpoints;
			_vue.showcaseRepo = 
			{
				"RepoId":1,
				"Name":_vue.projectconfig.project_info.name,
				"BaseUrlToPatternLibrary":"../"+ _vue.projectconfig.directories.src
			}

			if(typeof this.html === "object")
			{
				_vue.componentStates = this.parseStatesFromMarkup(this.html);

				if (this.componentStates && this.componentStates.length > 0)
				{
					this.selectedStateTitle = this.componentStates[0].Title;
				}
				if(this.cssBreakpoints)
				{
					this.selectedCssBreakpointTitle = this.cssBreakpoints.slice(-1)[0].title;
				}
			}
		}
    },
    created()
    {
		this.init(this);
	},
	mounted()
	{
		// if(this.savedBreakpointTitle !== null)
		// {
		// 	const savedBreakpoint = this.getSelectedCssBreakpoint(this.savedBreakpointTitle);
		// 	this.onCssBreakpointChange(savedBreakpoint);
		// }
		// if(this.saveStateTitle && this.states)
		// {
		// 	let savedState = this.states.filter(x => x.Title == this.saveStateTitle)[0];
		// 	if(!savedState)
		// 	{
		// 		savedState =  this.states[0];
				
		// 	}
		// 	if(savedState)
		// 	{
		// 		this.$emit('update:selectedStateTitle', savedState.Title);
		// 	}
		// }
	}
};

</script>
<style lang="less">
@import '../../styles/colors';
.showcase
	{
		margin-bottom: 7.5rem;
	}

	.showcase__example
	{
		ul, ol
		{
			margin: 0;
			padding: 0;
		}
	}

	.showcase__header + .showcase__example { margin-top: 3rem; }

	.showcase__source { position: relative; }
	.showcase__source pre
	{
		margin:0 !important;
	}
	.showcase__source-link {
		position: absolute;
		z-index: 1;
		top: 2.25rem;
		right: 2.25rem;

		&:after {
			display: inline-block;
			content: '';
			width: 1.2rem;
			height: 1.2rem;
			margin-left: 0.625rem;
			background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+ICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0xMDQwLjQpIiBmaWxsPSIjMDA5M2U4Ij4gICAgPHBhdGggZD0ibTEuOTY4OCAxMDQzLjRjLTEuMDkzOSAwLTEuOTY4OCAwLjgtMS45Njg4IDEuOXY1LjA5MzVjMCAxLjA5MzggMC44NzQ5MiAxLjk3NTQgMS45Njg4IDEuOTY4N2w1LjA2MjUtMC4wMzFjMS4wOTM4IDAgMS45Njg3LTAuOSAxLjk2ODctMnYtMy4wMzEzaC0xdjNjMCAwLjU1NC0wLjQ0NjAxIDAuOTk2Ni0xIDFsLTUgMC4wMzFjLTAuNTUzOTggMC0xLTAuNDQ2LTEtMXYtNS4wMzFjMC0wLjU1NCAwLjQ0Ni0xIDEtMWgzdi0xeiIvPiAgICA8cGF0aCBkPSJtNyAxMDQwLjQtMC4wMDAwMDQ4IDFoMy4zMTI2bC03LjEzMTcgNy4xNTE0IDAuNjg3NDUgMC42ODc0IDcuMTMxNi03LjE1MTQgMC4wMDAwNjUgMy4zMTI2aDFsLTAuMDAwMDQtNC4wMDAxIDAuMDAwMDc1LTAuOTk5OXoiLz4gIDwvZz48L3N2Zz4=);
		}
	}

	.showcase__source-controls {
		float: right;;
		display: flex;
		flex-direction: row;
		margin-top: 1.75rem;
		list-style: none;

		li {
			margin-right: 2.5rem;

			&:last-child {
				margin-left: auto;
				margin-right: 0;
			}
		}
		a
		{
				color: @color--blue;
				text-decoration: none;
				display: inline-block;
				margin-top:0.5rem;
		}
	}
.showcase__source-wrapper {
    font-size: 12px;
	position: relative;
	
    border-right: 1px solid @color--grey;
    border-bottom: 1px solid @color--grey;
    border-left: 1px solid @color--grey;
}
.showcase_source-content + .showcase__source-wrapper
{
	border-top: 1px solid @color--grey;
}

.showcase__source-wrapper + .showcase_source-content
{
    margin-top:2.5rem;
}
</style>

