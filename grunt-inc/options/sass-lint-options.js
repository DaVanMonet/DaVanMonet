/* sasslint https://github.com/sasstools/sass-lint
    Verify code style in scss sources
*/
module.exports = function(_gruntbase_) {

    let mainconfig = _gruntbase_.mainconfig;

    return {
        options: {
            //outputFile: 'linters/sass-lint.html'
        },
        target: [mainconfig.directories.src + '/**/*.scss'] // Lint all the files
    }
}