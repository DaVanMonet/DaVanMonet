<template>
    <div class="showcase">
        <div class="showcase__header row">
            <div class="col-md-8 col-sm-12">
                <span v-if="showcaseData.private === true" class="showcase_privatecomponent">Non public</span>
                <h3 class="heading heading--smaller" v-if="showcaseData.Title && showcaseIsOnlyComponent == false" v-html="showcaseData.Title"></h3>
                
                <div v-if="showcaseData.Preamble">
                    <p v-html="showcaseData.Preamble"></p>
                </div>
                <item-richtext v-if="showcaseData.Content" :content="showcaseData.Content" collapsed></item-richtext>
            </div>
        </div>
        <div class="showcase__example" v-if="hasStates">
            <component-showcase-repos-stylesheets :repos="componentRepos"></component-showcase-repos-stylesheets>

            <resizeable-element 
				ref="resizeableElement" 
				@onWidthChange="onResizeableWidthChange" 
				v-if="showPreview(showcaseData.States)"
				class="showcase__render-resizeable">
                <component-showcase-render 
					v-for="state in showcaseData.States" 
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
				v-if="showPreview(showcaseData.States)" 
				:states="showcaseData.States" 
				:selectedStateTitle.sync="selectedStateTitle" 
				:isSettingsDrawerExpanded.sync="isDetailExpanded" 
				:cssBreakpoints="cssBreakpoints" 
				:selectedCssBreakpointTitle.sync="selectedCssBreakpointTitle" 
				:showcase-repo="showcaseRepo" 
                :itemKey="itemKey" 
				@onCssBreakpointChange="onCssBreakpointChange">
            </component-showcase-settings-drawer>

            <template v-if="showPreview(showcaseData.States)">
            <div 
				v-if="state.Title === selectedStateTitle" 
				v-for="state in showcaseData.States" 
				:key="state.Title" >
					<div class="showcase__source-wrapper">
                    	<component-showcase-source :source="state.PreviewMarkup" :language="state.Language"></component-showcase-source>
					</div>
            </div>
            </template>
            <template v-else class="showcase">
                <template v-for="state in showcaseData.States">
                    <div class="showcase_source-content" v-bind:key="state.Title + 'content'">
                        <h3 v-if="cleanStateContent(state.Title)" v-html="cleanStateContent(state.Title)"></h3>
                        <div v-if="cleanStateContent(state.Preamble)" v-html="cleanStateContent(state.Preamble)"></div>
                    </div>
                    <div class="showcase__source-wrapper" v-bind:key="state.Title + 'wrapper'">
                        
                        <component-showcase-source :source="state.PreviewMarkup" :language="state.Language"></component-showcase-source>
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
import CopyToClipboard from '@/components/CopyToClipboard.vue';
import SyntaxHighlighter from '@/components/SyntaxHighlighter.vue';
import ResizeableElement from '@/components/ResizeableElement.vue';
import ItemRichtext from '@/components/item/ItemRichtext';
import ComponentShowcaseRender from '@/components/preview-frame/ComponentShowcaseRender.vue';
import ComponentShowcaseSource from '@/components/preview-frame/ComponentShowcaseSource.vue';
import ComponentShowcaseReposStylesheets from '@/components/preview-frame/ComponentShowcaseReposStylesheets.vue';
import ComponentShowcaseSettingsDrawer from '@/components/preview-frame/ComponentShowcaseSettingsDrawer.vue';

export default
{
    name: 'component-showcase',
    components:
    {
        CopyToClipboard,
        SyntaxHighlighter,
        ResizeableElement,
        ItemRichtext,
        ComponentShowcaseRender,
        ComponentShowcaseSource,
        ComponentShowcaseReposStylesheets,
        ComponentShowcaseSettingsDrawer,
    },
    props: ['showcaseData', "cssBreakpoints", "showcaseIsOnlyComponent", "itemKey"],
    data()
    {
        return {
			hasStates: true,
            selectedStateTitle: '',
            isDetailExpanded: false,
            iframeContentHeight: undefined,
            selectedCssBreakpointTitle: undefined,
            componentRepos: [],
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
        },
        showcaseRepo()
        {
            return this.componentRepos[0];
        }
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
		cleanStateContent(content)
		{
			return (typeof content === "string" && content.length > 0) ? content.replace(/nopreview/ig,"").replace(/<p><\/p>/ig,"").trim() : "";
		},
        showPreview(states)
        {
            let shouldShow = true;
			let statelist = states;
            if (typeof states.Preamble === "string")
            {
                statelist = [states];
			}
			statelist.forEach(state =>
			{
				if(shouldShow)
				{
                    shouldShow = [state.Preamble, state.Title, state.markdownsource].filter(x => x.indexOf('nopreview') !== -1).length === 0;
				}
			});
            return shouldShow;
        }
    },
    created()
    {

        console.log("Showcase Data: ", this.showcaseData);

        // Set first showcase state as the selected state per default
        this.hasStates = (this.showcaseData.States.length > 0);
        if (this.hasStates)
        {
            this.selectedStateTitle = this.showcaseData.States[0].Title;
		}
		
        // Set preset CSS breakpoints and select the last breakpoint as selected per default
        //this.cssBreakpoints = CSS_BREAKPOINTS;
        this.selectedCssBreakpointTitle = this.cssBreakpoints.slice(-1)[0].title;
        //Set repo information and add the stylesheet references
        const repo = this.$root.getRepo();
        this.componentRepos.push(repo);
    },
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
