module.exports = function(_gruntbase_) {

    let mainconfig = _gruntbase_.mainconfig;
    let grunt = _gruntbase_.grunt;
    let gruntconfig = {};

    if (mainconfig.compilation.compilers.scss["lint"] === true)
	{
		grunt.loadNpmTasks('grunt-sass-lint')
		gruntconfig["sasslint"] = require('./options/sass-lint-options')(_gruntbase_);
	}

	if (typeof mainconfig.compilation["postcss"] === "object")
	{
		gruntconfig["postcss"] = require('./options/postcss-options')(_gruntbase_);
	}

	if (typeof mainconfig.compilation["minifycss"] === "object")
	{
		gruntconfig["cssmin"] =	require('./options/cssmin-options')(_gruntbase_);
	}

	gruntconfig["watch"] = require('./options/watch-options')(_gruntbase_);
	gruntconfig["connect"] = require('./options/connect-options')(_gruntbase_);
	gruntconfig['express'] = require('./options/express-options')(_gruntbase_);
	gruntconfig["copy"] = require('./options/copy-options')(_gruntbase_);
	gruntconfig["clean"] = require('./options/clean-options')(_gruntbase_);
	gruntconfig["less"] = require('./options/less-options')(_gruntbase_);
    gruntconfig["sass"] = require('.//options/sass-options')(_gruntbase_);
    
    return gruntconfig;
}