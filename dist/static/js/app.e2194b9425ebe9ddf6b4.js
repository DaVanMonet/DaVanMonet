webpackJsonp([0],{

/***/ "4GuE":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.navigation && _vm.navigation.length > 0)?_c('nav',{staticClass:"davanmonet-nav"},[_c('navigation-list',{attrs:{"items":_vm.navigation,"source-directory":_vm.sourceDirectory,"level":1}})],1):_vm._e()}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "BKNV":
/***/ (function(module, exports) {

//
//
//
//
//
//
//
//
//
//
//
//
//

module.exports = {
  name: 'component-showcase-render',
  props: ['renderSource', 'requirejs', 'iframeContentHeight', 'repo'],
  methods: {
    onIframeLoad() {
      this.populateIframeWithRenderSource();
      this.setIframeHeightToContentSize();
      var iframeWin = this.$refs.iframe.contentWindow;
      iframeWin.addEventListener('resize', this.setIframeHeightToContentSize);
    },
    populateIframeWithRenderSource() {
      // Add this.renderSource
      const renderElm = this.$refs.iframe.contentDocument.body.querySelector('.showcase__render');
      renderElm.innerHTML = this.renderSource;

      // Add script modules to iframe
      if (typeof this.requirejs === "string" && this.requirejs.length > 0) {
        const loadModulesEvent = new CustomEvent('LoadModulesInIframe', {});
        renderElm.dataset["requirejsModules"] = this.requirejs;
        renderElm.dataset["requirejsBaseurl"] = this.repo.BaseUrlToPatternLibrary;
        renderElm.dispatchEvent(loadModulesEvent);
      }

      // Duplicate our stylesheets into the iframe document head
      const linkStyleEls = Array.prototype.slice.call(document.querySelectorAll('div[data-repo-id="id-' + this.repo.RepoId + '"] link[data-previewcss]'));
      linkStyleEls.forEach(el => {
        let clone = el.cloneNode(true);
        clone.removeAttribute('disabled');
        this.$refs.iframe.contentDocument.head.appendChild(clone);
      });
    },
    setIframeHeightToContentSize() {
      const iframeContentHeight = `${this.$refs.iframe.contentDocument.body.scrollHeight}px`;

      this.$refs.iframe.style.height = iframeContentHeight;

      this.$emit('update:iframeContentHeight', iframeContentHeight);
    }
  },
  mounted() {
    this.$refs.iframe.addEventListener('load', this.onIframeLoad);
  },
  beforeDestroy() {
    this.$refs.iframe.removeEventListener('load', this.onIframeLoad);
  }
};

/***/ }),

/***/ "IZPY":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Navigation_vue__ = __webpack_require__("jxwc");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Navigation_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Navigation_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_40858d66_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Navigation_vue__ = __webpack_require__("4GuE");
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Navigation_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_40858d66_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Navigation_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "Q4gz":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("M4fF")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function (_) {

class Loader
{
    static async LoadData()
    {
        if(Loader.HasLoaded)
            return;
        const requestbase = "//" + window.location.host + "/";
        // Fetch project configuration
        const configreq = await fetch(requestbase + 'patternlibraryconfig.json');
        let config = await configreq.json();

        // Look for user config and extend the default config if present
        if(typeof config.userconfig === "string" && config.userconfig.length > 0)
        {
            const userconfigrequest = await fetch(requestbase + config.userconfig);
            if(userconfigrequest.status !== 404)
            {
                let userconfig = await userconfigrequest.json();
                _.maerge(config, userconfig);
            }
        }
        Loader.ProjectConfig = config;

        // Fetch content index
        const indexreq = await fetch(requestbase + Loader.ProjectConfig.indexing.contentindexoutput);
        Loader.ContentIndex = await indexreq.json();

        // Fetch css target index
        const targetreq = await fetch(requestbase + Loader.ProjectConfig.indexing.targetindexoutput);
        Loader.TargetIndex = await targetreq.json();
        Loader.HasLoaded = true;
    }
}

Loader.ContentIndex = {};
Loader.TargetIndex = {};
Loader.ProjectConfig = {};
Loader.HasLoaded = false;

return Loader;
}));

/***/ }),

/***/ "UM5O":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_MainContent_vue__ = __webpack_require__("pWFA");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_MainContent_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_MainContent_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2dff3f2c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_MainContent_vue__ = __webpack_require__("qZ98");
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_MainContent_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2dff3f2c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_MainContent_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "cy+C":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"showcase__render-iframe-wrapper"},[_c('iframe',{ref:"iframe",staticClass:"showcase__render-iframe",attrs:{"src":"/static/showcase-render-iframe.html","scrolling":"no","data-repo-name":_vm.repo.Name,"data-repo-id":'id-'+ _vm.repo.RepoId}})])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "iJtm":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ComponentShowcaseRender_vue__ = __webpack_require__("BKNV");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ComponentShowcaseRender_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ComponentShowcaseRender_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f328bc96_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ComponentShowcaseRender_vue__ = __webpack_require__("cy+C");
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ComponentShowcaseRender_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f328bc96_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ComponentShowcaseRender_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "jxwc":
/***/ (function(module, exports) {

//
//
//
//
//
//

module.exports = {
  name: 'navigation',
  components: ["url:/vuecomponents/NavigationList.vue"],
  props: ['navigation', 'sourceDirectory']
};

/***/ }),

/***/ "pWFA":
/***/ (function(module, exports) {

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import prism from 'prismjs';
// import htmlBeautifier from '@/vendor/beautify-html';
// import prismLineNumberPlugin from '@/vendor/prism-line-number-plugin';

// TODO: Move prism import and running of prism plugin to separate /vendor file
//prismLineNumberPlugin();

module.exports = {
  name: 'maincontent',
  components: ["url:/vuecomponents/component/ComponentShowcase.vue"],
  props: ['content', 'cssBreakpoints'],
  methods: {
    ClickOnIDLabel(inputid) {
      let input = document.getElementById(inputid);
      input.select();
      try {
        let copyresult = document.execCommand('copy');
        console.log('Result of copy to clipboard', copyresult);
      } catch (e) {
        console.error('Could not copy to clipboard');
      }
    }
  }
};

/***/ }),

/***/ "qZ98":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"davanmonet-maincontentcontainer"},[(_vm.content.Title)?_c('h1',{staticClass:"davanmonet-maincontent-headline",domProps:{"innerHTML":_vm._s(_vm.content.Title)}}):_vm._e(),_vm._v(" "),(_vm.content.Preamble)?_c('div',{staticClass:"davanmonet-maincontent-preamble",domProps:{"innerHTML":_vm._s(_vm.content.Preamble)}}):_vm._e(),_vm._v(" "),(_vm.content.MainBody)?_c('div',{staticClass:"davanmonet-maincontent-mainbody",domProps:{"innerHTML":_vm._s(_vm.content.MainBody)}}):_vm._e(),_vm._v(" "),(_vm.content.ComponentItems)?_c('div',{staticClass:"davanmonet-maincontent-sections"},_vm._l((_vm.content.ComponentItems),function(componentItem,index){return _c('div',{key:componentItem.id,staticClass:"davanmonet-maincontent-section"},[_c('component-showcase',{attrs:{"css-breakpoints":_vm.cssBreakpoints,"showcase-data":componentItem,"showcase-is-only-component":_vm.content.ComponentItems.length === 1}}),_vm._v(" "),(componentItem.componentid)?_c('div',{staticClass:"davanmonet-idtext"},[_c('label',{attrs:{"for":'componentid-' + index},on:{"click":function($event){$event.stopPropagation();_vm.ClickOnIDLabel('componentid-' + index)}}},[_vm._v("Component ID:")]),_vm._v(" "),_c('input',{attrs:{"type":"text","id":'componentid-' + index},domProps:{"value":componentItem.componentid}})]):_vm._e(),_vm._v(" "),(componentItem.id && componentItem.componentid != componentItem.id)?_c('div',{staticClass:"davanmonet-idtext"},[_c('label',{attrs:{"for":'documentationguid-' + index},on:{"click":function($event){$event.stopPropagation();_vm.ClickOnIDLabel('documentationguid-' + index)}}},[_vm._v("Documentation ID:")]),_vm._v(" "),_c('input',{attrs:{"type":"text","id":'documentationguid-' + index},domProps:{"value":componentItem.id}})]):_vm._e()],1)})):_vm._e(),_vm._v(" "),(_vm.content.id && _vm.content.ComponentItems.length > 1)?_c('div',{staticClass:"davanmonet-idtext"},[_c('label',{attrs:{"for":"articleid"},on:{"click":function($event){$event.stopPropagation();_vm.ClickOnIDLabel('articleid')}}},[_vm._v("Article ID:")]),_vm._v(" "),_c('input',{attrs:{"type":"text","id":"articleid"},domProps:{"value":_vm.content.id}})]):_vm._e()])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "z8RQ":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("7+uW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_modules_loader_js__ = __webpack_require__("Q4gz");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_modules_loader_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__src_modules_loader_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_MainContent_vue__ = __webpack_require__("UM5O");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_Navigation_vue__ = __webpack_require__("IZPY");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_preview_frame_ComponentShowcaseRender_vue__ = __webpack_require__("iJtm");








//window["highlight"] = highlight;

new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
	el: '#davanmonet-app',
	components:
	[
		__WEBPACK_IMPORTED_MODULE_4__components_preview_frame_ComponentShowcaseRender_vue__["a" /* default */],
		__WEBPACK_IMPORTED_MODULE_2__components_MainContent_vue__["a" /* default */],
		__WEBPACK_IMPORTED_MODULE_3__components_Navigation_vue__["a" /* default */]
	],
	data:
	{
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
	},
	created: function ()
	{
		this.init(this);
	},
	methods:
	{
		init: async function(_vue)
		{
			await __WEBPACK_IMPORTED_MODULE_1__src_modules_loader_js___default.a.LoadData();
			
			_vue.projectConfig = __WEBPACK_IMPORTED_MODULE_1__src_modules_loader_js___default.a.ProjectConfig;
			
			this.isLocalhost = (window.location.hostname === "localhost");

			if(this.isLocalhost && _vue.projectConfig.developmentenvironment && _vue.projectConfig.developmentenvironment.livereloadport)
			{
				$('<script src="//localhost:'+ _vue.projectConfig.developmentenvironment.livereloadport +'/livereload.js"></script>')
					.appendTo('body');
			}

			this.fetchData(this).then(() => 
			{ 
			});

			// Rudimentary themeing support
			if(_vue.projectConfig.project_info.theme_style !== "default") {
				$('head').append('<link rel="stylesheet" type="text/css" href="' + _vue.projectConfig.project_info.theme_style + '" />');
			}
			$(".davanmonet-header-nav-link").text(_vue.projectConfig.project_info.name);
			$(".davanmonet-header-logo").attr('src', _vue.projectConfig.project_info.logo);
		},

		loadPage: async function(_vue,path) 
		{
			if(path.length > 0) 
			{
				const _pageLoader = new PageLoader();
				const pagedata = await _pageLoader.getPage(path);
				
				this.maincontent = pagedata;
				this.$nextTick(() =>
				{
					afterRender(path);
				});	
			}
		},
		getRepo()
		{
			return {
				"RepoId":1,
				"Name":this.projectConfig.project_info.name,
				"BaseUrlToPatternLibrary":"../"+ this.projectConfig.directories.src,
				"Stylesheets":this.targetIndex.items
			};
		},
		fetchData: async function(_vue)
		{	
			await __WEBPACK_IMPORTED_MODULE_1__src_modules_loader_js___default.a.LoadData();
			_vue.contentIndex = __WEBPACK_IMPORTED_MODULE_1__src_modules_loader_js___default.a.ContentIndex;
			_vue.targetIndex = __WEBPACK_IMPORTED_MODULE_1__src_modules_loader_js___default.a.TargetIndex;
			
			const _pageLoader = new PageLoader();
			const navigation = await _pageLoader.getNavigation();
			_vue.navigation = navigation;

			const startpagecontent = await _pageLoader.loadMDFile("index");
			if(typeof startpagecontent === "string" && startpagecontent.length > 0)
			{
				_vue.maincontent.MainBody = marked(startpagecontent);
			}
			

			_vue.parseLocationAndNavigate();
			_vue.configLoaded = true;
		},

		parseLocationAndNavigate: function()
		{
			let pagepath = window.location.pathname;
			if(this.isLocalhost)
			{
				const hash = window.location.hash
				pagepath = hash.replace("#","");

			}
			this.loadPage(this, pagepath);
		},
	}
});

/***/ })

},["z8RQ"]);
//# sourceMappingURL=app.e2194b9425ebe9ddf6b4.js.map