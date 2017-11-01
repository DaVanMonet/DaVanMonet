'use strict';
module.exports = function(grunt) {
  grunt.registerTask('davanmonet', 'A pattern library thingie', function()
  {
      var options = this.options();

      let taskNames = this.args;
      if(taskNames.length === 0)
      {
        taskNames = ["dev"];
      }
      let modifiedTaskNames = taskNames.map(task => "davanmonet-" + task);


      require('jit-grunt')(grunt);
      require('time-grunt')(grunt);
      
      // jit-grunt can't find this :(
      grunt.loadNpmTasks('grunt-express-server');
      
      // In this object we'll put stuff that will need to be accessed in various places
      let _gruntbase_ = { grunt: grunt };
      
      // Path to main config file
      _gruntbase_.mainConfFilePath = (options.config) ? options.config : "./patternlibraryconfig.json";
      
      // Load default config and optional user config
      // -----------------------------------------------------------------------
    
      let mainconfig = grunt.file.readJSON(_gruntbase_.mainConfFilePath);
      let _ = require('lodash');
      if (grunt.file.exists(mainconfig.userconfig))
      {
        let userconfig = grunt.file.readJSON(mainconfig.userconfig);
        _.merge(mainconfig, userconfig);
      }
      _gruntbase_.mainconfig = mainconfig;
      
      // Get style targets for compilation and watch. I.e, .less and .scss files
      // -----------------------------------------------------------------------
    
      _gruntbase_.fileAndDirectoryTargets = require('../grunt-inc/gather-file-directory-targets')(_gruntbase_);
      
    
    
      // Load grunt task configs
      // -----------------------------------------------------------------------
    
      grunt.initConfig(require('../grunt-inc/load-task-options')(_gruntbase_));
    
    
      
      // Register tasks that...
      // -----------------------------------------------------------------------
    
      // ...outputs the configuration tree in console
      require('../grunt-inc/tasks/show-config').registerWithGrunt(_gruntbase_);
    
      // ...runs compilers that outputs the CSS
      require('../grunt-inc/tasks/build-css').registerWithGrunt(_gruntbase_);
    
      // ...creates the target index json file
      require('../grunt-inc/tasks/create-target-index').registerWithGrunt(_gruntbase_);
    
      // ...creates the content index json file that lists the components in the pattern library
      require('../grunt-inc/tasks/create-content-index').registerWithGrunt(_gruntbase_);
    
      // ...creates the content index json file that lists the components in the pattern library
      require('../grunt-inc/tasks/create-version-file').registerWithGrunt(_gruntbase_);
    
      // Bundle tasks in useful combinations
      // -----------------------------------------------------------------------
    
      grunt.registerTask("davanmonet-createindexes", ["davanmonet-createcontentindex","davanmonet-createtargetindex"]);
      grunt.registerTask("davanmonet-builddev", ["davanmonet-showconfig","clean:build","davanmonet-createindexes","davanmonet-buildcss","copy:assets",]);
      grunt.registerTask("davanmonet-dev", ["davanmonet-builddev","connect:livereload","express:onsitepreview","watch"]);
    
      grunt.registerTask("davanmonet-build", ["clean:build","davanmonet-createindexes","davanmonet-buildcss","copy:build","copy:assets","copy:preview","davanmonet-createversionfile"]);
      grunt.registerTask("davanmonet- ", ["davanmonet-build","connect:build"]);


      grunt.task.run(modifiedTaskNames);
  });

};
