/* cssmin https://github.com/gruntjs/grunt-contrib-cssmin
Minify the finished css files
For more options: https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api
*/
module.exports = function(_gruntbase_) {

    let mainconfig = _gruntbase_.mainconfig;

    return {
        options:
        {
            report: mainconfig.compilation.minifycss.report,
            level: mainconfig.compilation.minifycss.level,
            sourceMap:mainconfig.compilation.sourceMaps
        },
        target:
        {
            files: [{
                expand: true,
                cwd: mainconfig.directories.build + '/' + mainconfig.directories.cssdest,
                src: ['*.css', '!*.min.css'],
                dest: mainconfig.directories.build + '/' + mainconfig.directories.cssdest,
                ext: '.min.css'
            }]
        }
    }
};