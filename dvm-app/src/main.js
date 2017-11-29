import 'babel-polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';

import DaVanMonet from '@/DaVanMonet.vue';

// IE Polyfill
if ( ! NodeList.prototype.forEach ) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

// const Foo = { template: '<div>foo</div>' }
// const Bar = { template: '<div>bar</div>' }

// const routes = [
// 	{ path: '/foo', component: Foo },
// 	{ path: '/bar', component: Bar }
// ]

// const router = new VueRouter({
// 	routes
// })

new Vue({
	el: '#davanmonet-app',
	template: '<DaVanMonet ref="dvm" />',
	//router,
	components: { DaVanMonet },
	methods: {
		
		// TODO: This should problaby be handled by a router instead
		async loadPage(_vue, path) {
			return this.$refs.dvm.loadPage(_vue, path);
		},

		getRepo()
		{
			return {
				"RepoId":1,
				"Name":this.$refs.dvm.projectConfig.project_info.name,
				"BaseUrlToPatternLibrary":"../"+ this.$refs.dvm.projectConfig.directories.src,
				"Stylesheets":this.$refs.dvm.targetIndex.items
			};
		},
		
		// TODO: Move to vuex store
		getConfig() {
			return this.$refs.dvm.projectConfig;
		}
	}
});