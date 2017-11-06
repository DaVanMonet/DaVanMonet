module.exports = {
    registerWithGrunt: function(_gruntbase_) {

        const mainconfig = _gruntbase_.mainconfig;
        const grunt = _gruntbase_.grunt;

        grunt.registerTask('davanmonet-startservers','Starts connect and express', function ()
        {
            let mode = 'dev';
            const tasksToRun = [];
            if(this.args.length !== 0)
            {
                mode = this.args[0];
            }
            if(mode === 'dev')
            {
                if(mainconfig.developmentenvironment.devwebsiteport !== null)
                {
                    tasksToRun.push('connect:livereload');
                }
                if(mainconfig.developmentenvironment.onsitepreviewport !== null)
                {
                    tasksToRun.push('express:onsitepreview');
                }
            }
            if(mode === 'build')
            {
                if(mainconfig.developmentenvironment.buildwebsiteport !== null)
                {
                    tasksToRun.push('connect:build');
                }
            }
            if(tasksToRun.length !== 0)
            {
                grunt.task.run(tasksToRun);
            }
        });

    }
}
