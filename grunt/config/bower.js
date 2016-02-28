(function () {
    'use strict';

    var path = require('path');
    module.exports = {
        install: {
            options: {
                targetDir: './bower/_dest',
                layout: //'byType', // 'byComponent'
                    function(type, component, source) {
                        // map type
                        var extractedType = source.replace(/.*\.(.*)?/, '$1');
                        var renamedType = 'js';
                        if ('js' === extractedType) {
                            renamedType = 'js';
                        }
                        else if ('css' === extractedType) {
                            renamedType = 'css';
                        }

                        // map compontent
                        if (-1 < component.search('ace-builds')) {
                            // map ace
                            component = 'ace';
                        } else if (-1 < component.search('jquery-ui')) {
                            // map jqueryui
                            component = 'jqueryui';
                        } else if (-1 < component.search('jqueryui')) {
                            // map jqueryui
                            component = 'jqueryui';
                        } else if (-1 < component.search('ui-contextmenu')) {
                            // map jqueryui
                            component = 'jqueryui';
                        } else if (-1 < component.search('jquery-lang')) {
                            // map jquery
                            component = 'jquery';
                        }
                        return path.join(renamedType, component);
                    },
                install: true,
                verbose: true,
                cleanTargetDir: true,
                cleanBowerDir: false,
                bowerOptions: {}
            }
        }
    };
})();

