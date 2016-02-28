(function () {
    'use strict';

    module.exports = {
        options: {
            livereload: true
        },
        dist: {
            // run when any projectfiles or tests changed
            files: ['<%= srcBase %>ymf-editorapp/**/*.*', '<%= testSrcBase %>e2e/**/*', '<%= testSrcBase %> %>unit/**/*'],
            tasks: ['dist']
        },
        karma: {
            // run when projectJsFiles or tests changed
            files: ['<%= srcBase %>ymf-editorapp/**/*.*', '<%= testSrcBase %>unit/**/*'],
            tasks: ['dist', 'karma:continuous:run']
        },
        protractor: {
            // run when any projectfiles or tests changed
            files: ['<%= srcBase %>ymf-editorapp/**/*.*', '<%= testSrcBase %>e2e/**/*'],
            tasks: ['dist', 'protractor:continuous']
        },
        tests: {
            // run when any projectfiles or tests changed
            files: ['<%= srcBase %>ymf-editorapp/**/*.*', '<%= testSrcBase %>e2e/**/*', '<%= testSrcBase %>unit/**/*'],
            tasks: ['dist', 'karma:unit', 'protractor:e2e']
        }
    };
})();