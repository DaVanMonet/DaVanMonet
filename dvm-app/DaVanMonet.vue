<template>
    <div class="davanmonet-app">
        <!-- <component-showcase-csslinks :csslinks="targetIndex.items"></component-showcase-csslinks> -->
        <header class="davanmonet-header">
            <a href="/" class="davanmonet-header-logolink">
				<img class="davanmonet-header-logo" src="/static/logo.svg" alt="">
				<span class="davanmonet-header-logolinktext" 
				v-if="projectConfig && projectConfig.project_info" 
				v-html="projectConfig.project_info.name">DaVanMonet</span>
			</a>
            
            <a v-if="projectConfig && projectConfig.project_info && projectConfig.project_info.repourl" 
			:href="projectConfig.project_info.repourl" 
			class="davanmonet-header-github-link" title="Go to the GitHub Repository"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.579 31.775"><title>Asset 2</title><path d="M16.288 0a16.29 16.29 0 0 0-5.148 31.747c.815.15 1.112-.354 1.112-.785 0-.387-.014-1.41-.022-2.77-4.53.983-5.487-2.185-5.487-2.185a4.314 4.314 0 0 0-1.81-2.383c-1.478-1.01.113-.99.113-.99a3.422 3.422 0 0 1 2.5 1.68 3.468 3.468 0 0 0 4.74 1.353 3.48 3.48 0 0 1 1.035-2.178c-3.62-.412-7.42-1.81-7.42-8.052a6.3 6.3 0 0 1 1.677-4.37 5.86 5.86 0 0 1 .16-4.312s1.368-.438 4.48 1.67a15.44 15.44 0 0 1 8.155 0c3.11-2.108 4.475-1.67 4.475-1.67a5.85 5.85 0 0 1 .162 4.31 6.286 6.286 0 0 1 1.673 4.372c0 6.258-3.81 7.635-7.437 8.038a3.888 3.888 0 0 1 1.106 3.017c0 2.178-.02 3.935-.02 4.47 0 .435.293.94 1.12.782A16.292 16.292 0 0 0 16.288 0z" fill="#fff" fill-rule="evenodd"/></svg></a>
        </header>
		<div class="davanmonet-pagecontainer">
			<navigation 
				class="davanmonet-navcontainer" 
				v-if="configLoaded == true"
				:navigation="navigation" 
				:source-directory="projectConfig.directories.src" 
				:current-page-path="currentPagePath"></navigation>
			<main-content 
				class="davanmonet-maincontentcontainer" 
				v-if="configLoaded == true && maincontent"
				:content="maincontent"
				:css-breakpoints="projectConfig.env.cssBreakpoints"
				></main-content>
			<div v-if="configLoaded == false">
				Loading...
			</div>
		</div>
    </div>
</template>

<script>
import $ from 'jquery';
import Marked from 'marked';

import Loader from '@/src/modules/loader.js';
import PageLoader from '@/src/modules/pageLoader.js';

import MainContent from '@/components/MainContent.vue';
import Navigation from '@/components/Navigation.vue';
import ComponentShowcaseRender from '@/components/preview-frame/ComponentShowcaseRender.vue';

export default {
    components: {
        ComponentShowcaseRender,
		MainContent,
		Navigation,
    },

    data() {
        return {
            configLoaded:false,
			isLocalhost:false,
			currentPagePath:"",
            navigation:[],
            maincontent:
            {
                Title:null,
                Preamble:null,
                MainBody:"<p>This project does not yet have a startpage. Create a index.md file in the root folder of your style source</p>"
            },
            projectConfig:{},
            contentIndex:{},
            targetIndex:{},
            pageLookup:{}
        }
    },
    
    created: function ()
	{
		this.init(this);
    },
	mounted()
	{
	},
	methods:
	{
		async init(_vue)
		{
			await Loader.LoadData();
			
			_vue.projectConfig = Loader.ProjectConfig;
			this.isLocalhost = (window.location.hostname === "localhost");
			
			this.fetchData(this).then(() => 
			{ 
			});

			this.currentPagePath = window.location.pathname;

			// Rudimentary themeing support
			// TODO: Get rid of jQuery dependency here
			// TODO: Extend themeing abilities
			if(_vue.projectConfig.project_info.theme_style !== "default") {
				$('head').append('<link rel="stylesheet" type="text/css" href="' + _vue.projectConfig.project_info.theme_style + '" />');
			}
			if(_vue.projectConfig.project_info.name)
			{
				$(".davanmonet-header-logolinktext").text(_vue.projectConfig.project_info.name);
			}
			if(_vue.projectConfig.project_info.logo)
			{
				$(".davanmonet-header-logo").attr('src', _vue.projectConfig.project_info.logo);
			}
		},

		async loadPage(_vue,path) 
		{
			if(path.length > 0) 
			{
				const _pageLoader = new PageLoader();
				const pagedata = await _pageLoader.getPage(path);
				if(pagedata.id && pagedata.id.length > 0 && pagedata.title && pagedata.title.length > 0)
				{
					this.currentPagePath = path;
					this.maincontent = pagedata;
				}
				// TODO: Emit as an event if needed
				//this.$nextTick(() =>
				//{
				//	afterRender(path);
				//});
			}
		},
		
		// TODO: Replace by router
		parseLocationAndNavigate()
		{
			let pagepath = window.location.pathname;
			const hash = window.location.hash;
			if(this.isLocalhost && hash.length > 0)
			{
				pagepath = hash.replace("#","");
			}
			this.loadPage(this, pagepath);
		},
		
		async fetchData(_vue)
		{	
			await Loader.LoadData();
			_vue.contentIndex = Loader.ContentIndex;
			_vue.targetIndex = Loader.TargetIndex;
			
			const _pageLoader = new PageLoader();
			const navigation = await _pageLoader.getNavigation();
			_vue.navigation = navigation;
			
			const startpagecontent = await _pageLoader.loadMDFile("index");
			if(typeof startpagecontent === "string" && startpagecontent.length > 0)
			{
				_vue.maincontent.MainBody = Marked(startpagecontent);
			}
			_vue.parseLocationAndNavigate();
			_vue.configLoaded = true;
		}
    }
}
</script>

<style lang="less" src="@/styles/style.less"></style>
<style lang="less" src="@/styles/showcase.less"></style>
