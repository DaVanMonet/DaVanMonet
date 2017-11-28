import Zepto from 'zepto';

import Loader from '../../dvm-app/src/modules/Loader';

Zepto(function ($) {

    Loader.LoadData();
    const mainconfig = Loader.ProjectConfig;

    var api_endpoint = "http://localhost:" + mainconfig.env.devsiteport + '/';
    
    // Load compontent markup
    function loadComponent(cmpnt_info) {

        var state = 0;
        if (cmpnt_info.state !== undefined) {
            var state = cmpnt_info.state
        }

        $.ajax({
            type: 'GET',
            url: api_endpoint + 'osp/component/' + cmpnt_info.guid + '/' + state + '/markup.html', 
            dataType: 'text',
            success: function(markup) {
                injectComponentMarkupAtSelector(markup, cmpnt_info);
            }
        })
    }
    
    // Inject the markup using specified otions
    function injectComponentMarkupAtSelector(markup, cmpnt_info) {
        
        // Add css entries to site head
        for (entry of Object.keys(dvmConfig.compilation.entry).filter(e => e.endsWidth('.css')))
        {
            $('head').append('<link rel="stylesheet" href="' + api_endpoint + 'static/css/' + entry + '" type="text/css" />');
        }
        
        markup = $(markup);

        // Wrap the compontent if a wrapper is configured
        if (cmpnt_info.wrapper !== undefined) {
            markup = $(cmpnt_info.wrapper).append(markup);
        }

        // Inject before, after or append or prepend to selector
        if (cmpnt_info.inject_pos !== undefined) {
            switch (cmpnt_info.inject_pos) {
                
                default:
                case 'after':
                    $(cmpnt_info.hook).after(markup);
                    break;
                
                case 'before':
                    $(cmpnt_info.hook).before(markup);
                    break;

                case 'append':
                    $(cmpnt_info.hook).append(markup);
                    break;

                case 'prepend':
                    $(cmpnt_info.hook).prepend(markup);
                    break;
            }
        } else {
            $(cmpnt_info.hook).after(markup);
        }

        // Inject inline extra css if configured
        if (cmpnt_info.extra_css !== undefined) {
            markup.after('<style>' + cmpnt_info.extra_css + '</style>');
        }
    }

    // Load config
    $.ajax({
        type: 'GET',
        url: api_endpoint + 'config', 
        dataType: 'json',
        success: function(data) {
            $.each(data.onsitepreview.components, function(i, item) {
                loadComponent(item);
            });
        }
    });

});