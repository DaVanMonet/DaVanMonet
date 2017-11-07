/* ### Babel https://github.com/babel/grunt-babel
	Compiles modern JS to older versions */
module.exports = function(_gruntbase_)
{
	let mainconfig = _gruntbase_.mainconfig;
	let previewsitescripts = {};
	previewsitescripts[__dirname + '/../../preview/static/main.js'] = __dirname + '/../../preview/static/main.es6.js';
	previewsitescripts[__dirname + '/../../preview/static/preview.js'] = __dirname + '/../../preview/static/preview.es6.js';
	previewsitescripts[__dirname + '/../../preview/static/modules/dataStructureParser.js'] = __dirname + '/../../preview/static/modules/dataStructureParser.es6.js';
	previewsitescripts[__dirname + '/../../preview/static/modules/loader.js'] = __dirname + '/../../preview/static/modules/loader.es6.js';
	previewsitescripts[__dirname + '/../../preview/static/modules/pageLoader.js'] = __dirname + '/../../preview/static/modules/pageLoader.es6.js';
	previewsitescripts[__dirname + '/../../preview/static/modules/parsequery.js'] = __dirname + '/../../preview/static/modules/parsequery.es6.js';
    return {
		babel:
		{
			options:
			{
				sourceMap: false,
				presets: ['env'],
				plugins: ["transform-object-rest-spread"]
			},
			files:previewsitescripts
		}
	};
}