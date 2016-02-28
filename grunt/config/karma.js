(function () {
    'use strict';

    module.exports = {
        options: {
            configFile: 'karma.ymf.conf.js',
            noColor: false
        },
        // testmodus: unit only
        unit: {
            singleRun: true
        },
        // testmodus: continous
        continuous: {
            // keep karma running in the background
            background: true
        }
    };
})();