module.exports = {
    registerWithGrunt: function(_gruntbase_) {
        _gruntbase_.grunt.registerTask("davanmonet-showconfig","shows the config", () =>
        {
            // this == grunt 
            console.log('\n\n\n\n\n\n')
            console.log('### mainconfig #####################################################################')
            console.log(_gruntbase_.mainconfig)
            console.log('### gruntconfig ####################################################################')
            console.log(_gruntbase_.grunt.config.get())
            console.log('### compilationFiles ####################################################################')
            console.log(JSON.stringify(_gruntbase_.fileAndDirectoryTargets.compileTargets))
            console.log('####################################################################################\n\n') ;
        });
    }
}