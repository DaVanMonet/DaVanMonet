<template>
    <div class="davanmonet-app">
        <!-- <component-showcase-csslinks :csslinks="targetIndex.items"></component-showcase-csslinks> -->
        <header class="davanmonet-header">
            <a href="/" class="davanmonet-header-logolink"><img class="davanmonet-header-logo" src="/static/logo.svg"></a>
            <nav class="davanmonet-header-nav">
                <a href="/" class="davanmonet-header-nav-link">Home</a>
            </nav>
            <a href="https://github.com/wezz/DaVanMonet" class="davanmonet-header-github-link" title="Go to the GitHub Repository"><img alt="Image of the github logo" class="davanmonet-header-github-logo" src="/static/github-mark.svg"></a>
        </header>
        <navigation 
            class="davanmonet-navcontainer" 
            v-if="configLoaded == true"
            :navigation="navigation" 
            :source-directory="projectConfig.directories.src"></navigation>
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

			// Rudimentary themeing support
			// TODO: Get rid of jQuery dependency here
			// TODO: Extend themeing abilities
			if(_vue.projectConfig.project_info.theme_style !== "default") {
				$('head').append('<link rel="stylesheet" type="text/css" href="' + _vue.projectConfig.project_info.theme_style + '" />');
			}
			if(_vue.projectConfig.project_info.name)
			{
				$(".davanmonet-header-nav-link").text(_vue.projectConfig.project_info.name);
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
				
				this.maincontent = pagedata;

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
