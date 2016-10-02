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
        coverage: {
            singleRun: true,
            configFile: 'karma.coverage.ymf.conf.js',
        },
        // testmodus: continous
        continuous: {
            // keep karma running in the background
            background: true
        }
    };
})();