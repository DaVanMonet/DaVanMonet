<template>
    <div class="davanmonet-app">
        <!-- <component-showcase-csslinks :csslinks="targetIndex.items"></component-showcase-csslinks> -->
        <header class="davanmonet-header">
            <a :href="publicPath" class="davanmonet-header-logolink">
				<img class="davanmonet-header-logo" :src="logoPath" alt="">
				<span class="davanmonet-header-logolinktext" 
				v-if="projectConfig && projectConfig.project_info" 
				v-html="projectConfig.project_info.name">DaVanMonet</span>
			</a>
            
            <a v-if="projectConfig && projectConfig.project_info && projectConfig.project_info.repourl" 
			:href="projectConfig.project_info.repourl" 
			class="davanmonet-header-repository-link" title="Go to the Repository"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" /></svg></a>
        </header>
		<div class="davanmonet-pagecontainer">
			<navigation 
				class="davanmonet-navcontainer" 
				v-if="configLoaded == true"
				:navigation="navigation" 
				:version-data="versionData"
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
var md = require('markdown-it')();

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
			versionData:{},
            projectConfig:{},
            contentIndex:{},
            targetIndex:{},
            pageLookup:{}
        }
    },

	computed: {
		publicPath: function () {
			if (this.projectConfig
			&& this.projectConfig.directories
			&& this.projectConfig.directories.public_path)
				return this.projectConfig.directories.public_path;
			else
				return '/';
		},
		logoPath: function () {
			if (this.publicPath
			&& this.projectConfig
			&& this.projectConfig.project_info
			&& this.projectConfig.project_info.logo)
				return (this.publicPath + this.projectConfig.project_info.logo).replace('//', '/');
			else
				return (this.publicPath + '/static/logo.svg').replace('//', '/');
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
			_vue.versionData = Loader.VersionData;
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
				if(pagedata != null && (pagedata.id && pagedata.id.length > 0 || pagedata.title && pagedata.title.length > 0))
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

			console.log(pagepath);
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
				_vue.maincontent.MainBody = md.render(startpagecontent);
			}
			_vue.parseLocationAndNavigate();
			_vue.configLoaded = true;
		}
    }
}
</script>

<style lang="less" src="@/styles/style.less"></style>
<style lang="less" src="@/styles/showcase.less"></style>
