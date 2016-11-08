/**
 * software for projectmanagement and documentation
 *
 * @FeatureDomain                Collaboration
 * @author                       Michael Schreiner <michael.schreiner@your-it-fellow.de>
 * @category                     collaboration
 * @copyright                    Copyright (c) 2014, Michael Schreiner
 * @license                      http://mozilla.org/MPL/2.0/ Mozilla Public License 2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * taskconfiguration
 *
 * @author                       Michael Schreiner <michael.schreiner@your-it-fellow.de>
 * @category                     collaboration
 * @copyright                    Copyright (c) 2014, Michael Schreiner
 * @license                      http://mozilla.org/MPL/2.0/ Mozilla Public License 2.0
 */
(function () {
    'use strict';
    var path = require('path');

    /**
     * baseconfig
     **/
    var srcBase = 'src/main/web/';
    var resSrcBase = 'src/main/resources/';
    var destBase = 'build/';
    var bowerSrcBase = 'bower/_src/';
    var vendorSrcBase = 'vendors/src/';
    var vendorDestBase = 'vendors/';
    var archivSrcBase = 'vendors/archiv/';
    var testSrcBase = 'src/test/javascript/';
    var devserverPort = 8501;

    /**
     * configure tasks
     **/
    module.exports = function(grunt) {
        require('load-grunt-config')(grunt, {
            path: path,
            configPath: path.join(process.cwd(), 'grunt/config'),
            jitGrunt: {
                customTasksDir: 'grunt/tasks'
            },
            data: {
                pkg: grunt.file.readJSON('package.json'),
                srcBase: srcBase,
                resSrcBase: resSrcBase,
                destBase: destBase,
                bowerSrcBase: bowerSrcBase,
                vendorSrcBase: vendorSrcBase,
                vendorDestBase: vendorDestBase,
                archivSrcBase: archivSrcBase,
                testSrcBase: testSrcBase,
                devserverPort: devserverPort,

                // define files
                vendorJsFiles: [
                    vendorDestBase + 'js/jquery/jquery.min.js',
                    vendorDestBase + 'js/jqueryui/jquery-ui.min.js',
                    vendorDestBase + 'js/jqueryui/jquery-ui-i18n.min.js',
                    vendorDestBase + 'js/jquery/jquery-lang.js',
                    vendorDestBase + 'js/marked/marked.js',
// loaded standalone because of plugins
//              vendorDestBase + 'js/ace/ace.js',
//              vendorDestBase + 'js/ace/ext-spellcheck.js',
                    vendorDestBase + 'js/js-deflate/rawdeflate.js',
                    vendorDestBase + 'js/strapdown/strapdown-toc.js',
                    vendorDestBase + 'js/highlightjs/highlight.pack.js',
                    vendorDestBase + 'js/slimbox2/slimbox2.js',
                    vendorDestBase + 'js/toastr/toastr.min.js',
// loaded standalone because of problems
//              vendorDestBase + 'js/mermaid/mermaid.full.js',
                    vendorDestBase + 'js/findandreplacedomtext/findAndReplaceDOMText.js',
// loaded standalone because of plugins
                    vendorSrcBase + 'freemind-flash/flashobject.js'
                ],
                vendorCssFiles: [
                    vendorDestBase + 'css/jqueryui/jquery-ui.css',
                    vendorDestBase + 'css/jqueryui/jquery-ui-timepicker-addon.css',
// loaded standalone because of plugins
                    vendorDestBase + 'css/highlightjs/default.css',
                    vendorDestBase + 'css/slimbox2/slimbox2.css',
                    vendorDestBase + 'css/toastr/toastr.css',
                    vendorDestBase + 'css/mermaid/mermaid.css',
                    vendorSrcBase + 'css/yaio/style.css',
                    vendorSrcBase + 'css/yaio/main.css'
                ],
                vendorJshJsFiles: [
                    vendorDestBase + 'js/jquery/jquery.min.js',
                    vendorDestBase + 'js/marked/marked.js',
                    vendorDestBase + 'js/js-deflate/rawdeflate.js',
                    vendorDestBase + 'js/strapdown/strapdown-toc.js',
                    vendorDestBase + 'js/highlightjs/highlight.pack.js',
                    vendorDestBase + 'js/toastr/toastr.min.js',
                    vendorDestBase + 'js/findandreplacedomtext/findAndReplaceDOMText.js',
                    vendorSrcBase + 'freemind-flash/flashobject.js'
                ],
                vendorJshCssFiles: [
                    vendorDestBase + 'css/jqueryui/jquery-ui.css',
                    vendorDestBase + 'css/highlightjs/default.css',
                    vendorDestBase + 'css/toastr/toastr.css',
                    vendorDestBase + 'css/mermaid/mermaid.css',
                    vendorSrcBase + 'css/yaio/style.css',
                    vendorSrcBase + 'css/yaio/main.css'
                ],
                projectJsFiles: [
                    // services
                    srcBase + 'ymf-editorapp/js/jshelferlein/JsHelferlein.js',
                    srcBase + 'ymf-editorapp/js/jshelferlein/**/*.js',
                    srcBase + 'ymf-editorapp/js/YmfAppBaseConfig.js',
                    srcBase + 'ymf-editorapp/js/YmfAppBase.js',
                    srcBase + 'ymf-editorapp/js/layout/*.js',
                    srcBase + 'ymf-editorapp/js/widgets/*.js',
                    srcBase + 'ymf-editorapp/js/editor/*.js'
                ],
                projectCssFiles: [
                    srcBase + 'ymf-editorapp/js/jshelferlein/ui/toggler.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/speech/speech.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/parser/checklist.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/parser/diagrams.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/renderer/markdown.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/renderer/renderer.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/ui/base.css',
                    srcBase + 'ymf-editorapp/js/layout/base.css',
                    srcBase + 'ymf-editorapp/js/layout/support.css',
                    srcBase + 'ymf-editorapp/js/layout/toc.css',
                    srcBase + 'ymf-editorapp/js/editor/editor.css'
                ],
                projectJshJsFiles: [
                    // services
                    srcBase + 'ymf-editorapp/js/jshelferlein/JsHelferlein.js',
                    srcBase + 'ymf-editorapp/js/jshelferlein/**/*.js'
                ],
                projectJshCssFiles: [
                    srcBase + 'ymf-editorapp/js/jshelferlein/ui/toggler.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/speech/speech.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/parser/checklist.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/parser/diagrams.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/renderer/markdown.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/renderer/renderer.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/ui/base.css',
                    srcBase + 'ymf-editorapp/js/layout/base.css',
                    srcBase + 'ymf-editorapp/js/layout/toc.css'
                ],
                projectPrintCssFiles: [
                    srcBase + 'ymf-editorapp/js/jshelferlein/ui/toggler-print.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/parser/diagrams-print.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/renderer/markdown-print.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/renderer/renderer-print.css',
                    srcBase + 'ymf-editorapp/js/layout/base-print.css',
                    srcBase + 'ymf-editorapp/js/layout/toc-print.css',
                    srcBase + 'ymf-editorapp/js/editor/editor-print.css'
                ],
                projectJshPrintCssFiles: [
                    srcBase + 'ymf-editorapp/js/jshelferlein/ui/toggler-print.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/parser/diagrams-print.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/renderer/markdown-print.css',
                    srcBase + 'ymf-editorapp/js/jshelferlein/renderer/renderer-print.css'
                ],
                projectPrintDataOnlyCssFiles: [
                    srcBase + 'ymf-editorapp/js/layout/print-dataonly.css'
                ],
                projectResetCssFiles: [
                    srcBase + 'ymf-editorapp/js/layout/reset.css'
                ],
                vendorJsTestFiles: [
                    testSrcBase + 'unit/resources/js/jasmine/jasmine-jquery.js',
                    testSrcBase + 'unit/jasmine-config.js'
                ],
                projectUnitJsTestFiles: [
                    testSrcBase + 'unit/ymf-editorapp/**/*_test.js'
                ],
                projectE2EJsTestFiles: [
                    testSrcBase + 'e2e/ymf-editorapp/**/*_test.js'
                ]
            }
        });

        // register tasks
        grunt.registerTask('default',      ['distfull']);

        grunt.registerTask('css-images',   ['css_image']);
        grunt.registerTask('sprites',      ['sprite']);
        grunt.registerTask('data-uri',     ['dataUri']);
        grunt.registerTask('images',       ['sprites', 'css-images', 'data-uri']);

        grunt.registerTask('vendorslocal', ['copy:bower2vendors', 'copy:bowerbin2vendors']);
        grunt.registerTask('vendorsfull',  ['clean:bower', 'bower', 'vendorslocal']);
        grunt.registerTask('distymf',      ['images', 'concat', 'copy:ymfres2dist', 'replace:noVersionOnDist', 'copy:dist2archiv']);
        grunt.registerTask('distlocal',    ['vendorslocal', 'copy:vendors2dist', 'copy:vendors2distWithoutVersion', 'distymf']);
        grunt.registerTask('distversioned', ['vendorsfull', 'clean:dist', 'copy:archiv2dist', 'images', 'concat', 'copy:vendors2dist', 'copy:vendors2distWithoutVersion', 'copy:ymfres2dist', 'replace:versionOnDist', 'copy:dist2archiv']);
        grunt.registerTask('distfull',     ['vendorsfull', 'clean:dist', 'copy:archiv2dist', 'images', 'concat', 'copy:vendors2dist', 'copy:vendors2distWithoutVersion', 'copy:ymfres2dist', 'replace:noVersionOnDist', 'copy:dist2archiv', 'karma:unit', 'coverage', 'jshint']);
        grunt.registerTask('dist',         ['distfull']);
        grunt.registerTask('coverage',     ['karma:coverage']);
        grunt.registerTask('unit-test',    ['dist', 'karma:continuous:start', 'watch:karma']);
        grunt.registerTask('e2e-test',     ['dist', 'protractor:continuous', 'watch:protractor']);
        grunt.registerTask('devserver',    ['connect:devserver']);

        // load grunt tasks
        grunt.loadNpmTasks('grunt-bower-task');
        grunt.loadNpmTasks('grunt-css-image');
        grunt.loadNpmTasks('grunt-connect');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-data-uri');
        grunt.loadNpmTasks('grunt-jsdoc');
        grunt.loadNpmTasks('grunt-karma');
        grunt.loadNpmTasks('grunt-protractor-runner');
        grunt.loadNpmTasks('grunt-replace');
        grunt.loadNpmTasks('grunt-spritesmith');
    };

})();
