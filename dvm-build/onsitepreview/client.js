import 'babel-polyfill';
import Zepto from 'webpack-zepto';

import Loader from '../../dvm-app/src/modules/Loader';

Zepto(function ($) {

    Loader.LoadData();
    const dvmConfig = Loader.ProjectConfig;

    var api_endpoint = "http://localhost:" + dvmConfig.env.devSitePort + '/';

    // Add css entries to site head
    for (let entry of Object.keys(dvmConfig.compilation.targets).filter(e => e.endsWith('.css')))
    {
        // Check if this entry should be included
        if (typeof dvmConfig.onsitepreview.styleTargets === "object"
        && dvmConfig.onsitepreview.styleTargets.indexOf(entry) < 0)
        {
            continue;
        }

        $('head').append('<link rel="stylesheet" href="' + api_endpoint + 'static/css/' + entry + '" type="text/css" />');
    }

    $.each(dvmConfig.onsitepreview.components, function(i, item) {
        loadComponent(item);
    });

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

});