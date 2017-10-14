/* postcss https://github.com/nDmitry/grunt-postcss
    Do adjustments to the compiled css such as autoprefixer
*/
module.exports = function(_gruntbase_) {

    let mainconfig = _gruntbase_.mainconfig;

    return {
        options:
        {
            map: mainconfig.compilation.postcss.map,
            processors: mainconfig.compilation.postcss.processors.map( (processor) => {
                return require(processor.name)(processor.options);
            })
        },
        build:
        {
            src: mainconfig.directories.build + '/' + mainconfig.directories.cssdest + '/' + '*.css'
        }
    }
}