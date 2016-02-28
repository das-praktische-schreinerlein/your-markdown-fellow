(function () {
    'use strict';

    module.exports = {
        // copy bower-text resources (js/css/html-files) to dest and patch them
        bower2vendors: {
            options: {
                process: function (content, srcpath) {
                    if (-1 < srcpath.search('slimbox2.')) {
                        return patchFileSlimbox2(content, srcpath);
                    } else if (-1 < srcpath.search('highlightjs')) {
                        return patchFileHighlightJsLang(content, srcpath);
                    } else if (-1 < srcpath.search('jquery-lang')) {
                        return patchFileJQueryLang(content, srcpath);
                    } else if (-1 < srcpath.search('jquery-ui')) {
                        return patchFileJQueryUi(content, srcpath);
                    }
                    return content;
                }
            },
            files: [
                // JS
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>ace-builds/src-min-noconflict',
                    src: ['**'],
                    dest: '<%= vendorDestBase %>js/ace/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>find-and-replace-dom-text/src',
                    src: ['findAndReplaceDOMText.js'],
                    dest: '<%= vendorDestBase %>js/findandreplacedomtext/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>highlightjs/',
                    src: ['**/highlight.pack.js'],
                    dest: '<%= vendorDestBase %>js/highlightjs/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>jquery/dist',
                    src: ['jquery.min.js'],
                    dest: '<%= vendorDestBase %>js/jquery/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>jquery-lang-js/js',
                    src: ['jquery-lang.js'],
                    dest: '<%= vendorDestBase %>js/jquery/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>jquery-ui',
                    src: ['**/jquery-ui.min.js', '**/jquery-ui-i18n.min.js'],
                    dest: '<%= vendorDestBase %>js/jqueryui/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>jqueryui-timepicker-addon',
                    src: ['dist/jquery-ui-sliderAccess.js', 'dist/jquery-ui-timepicker-addon.js'],
                    dest: '<%= vendorDestBase %>js/jqueryui/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>js-deflate',
                    src: ['rawdeflate.js'],
                    dest: '<%= vendorDestBase %>js/js-deflate/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>marked',
                    src: ['lib/marked.js'],
                    dest: '<%= vendorDestBase %>js/marked/',
                    flatten: true
                },
                // mermaid 0.5
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>mermaid',
                    src: ['dist/mermaid.js'],
                    dest: '<%= vendorDestBase %>js/mermaid/',
                    flatten: true,
                    filter: 'isFile',
                    rename: function (dest, src) {
                        return dest + src.replace('mermaid.js', 'mermaid.full.js');
                    }
                },
                // mermaid 0.4
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>mermaid',
                    src: ['dist/mermaid.full.js'],
                    dest: '<%= vendorDestBase %>js/mermaid/',
                    flatten: true,
                    filter: 'isFile',
                    rename: function (dest, src) {
                        return dest + src.replace('-legacy.full.js', '.full.js');
                    }
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>select2',
                    src: ['dist/js/select2.full.min.js'],
                    dest: '<%= vendorDestBase %>js/select2/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>slimbox2',
                    src: ['js/slimbox2.js'],
                    dest: '<%= vendorDestBase %>js/slimbox2/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>strapdown',
                    src: ['src/js/strapdown-toc.js'],
                    dest: '<%= vendorDestBase %>js/strapdown/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>toastr',
                    src: ['build/toastr.min.js'],
                    dest: '<%= vendorDestBase %>js/toastr/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>ui-contextmenu',
                    src: ['jquery.ui-contextmenu.min.js'],
                    dest: '<%= vendorDestBase %>js/jqueryui/',
                    flatten: true
                },
                // CSS
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>highlightjs/',
                    src: ['**/default.css'],
                    dest: '<%= vendorDestBase %>css/highlightjs/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>jquery-ui/themes/smoothness',
                    src: ['jquery-ui.css'],
                    dest: '<%= vendorDestBase %>css/jqueryui/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>jqueryui-timepicker-addon',
                    src: ['dist/jquery-ui-timepicker-addon.css'],
                    dest: '<%= vendorDestBase %>css/jqueryui/',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>mermaid',
                    src: ['dist/mermaid.css'],
                    dest: '<%= vendorDestBase %>css/mermaid/',
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>slimbox2',
                    src: ['**/slimbox2.css'],
                    dest: '<%= vendorDestBase %>css/slimbox2/',
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>toastr',
                    src: ['toastr.css'],
                    dest: '<%= vendorDestBase %>css/toastr/',
                    flatten: true,
                    filter: 'isFile'
                }
            ]
        },
        // copy bower-binary resources (png...-files) to dest
        bowerbin2vendors: {
            files: [
                {
                    expand: true,
                    cwd: '<%= bowerSrcBase %>jquery-ui/themes/smoothness',
                    src: ['images/*.*'],
                    dest: '<%= vendorDestBase %>css/jqueryui/',
                    flatten: false
                }
            ]
        },
        // copy vendor-files which must exists in specific pathes to dist
        vendors2dist: {
            files: [
                // vendors
                {
                    expand: true,
                    cwd: '<%= vendorDestBase %>js/',
                    src: ['ace/**'],
                    dest: '<%= destBase %>dist/<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= vendorDestBase %>css',
                    src: ['jqueryui/images/*.*'],
                    dest: '<%= destBase %>dist/<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= vendorDestBase %>js/mermaid',
                    src: ['*.js'],
                    dest: '<%= destBase %>dist/<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>/mermaid/',
                    flatten: false
                },
                // yaio-intern vendors
                {
                    expand: true,
                    cwd: '<%= vendorSrcBase %>',
                    src: ['freemind-flash/**'],
                    dest: '<%= destBase %>dist/<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= vendorSrcBase %>js/',
                    src: ['yaio/**'],
                    dest: '<%= destBase %>dist/<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= vendorSrcBase %>css/',
                    src: ['yaio/**'],
                    dest: '<%= destBase %>dist/<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>/',
                    flatten: false
                },

                // jsh-vendors
                {
                    expand: true,
                    cwd: '<%= vendorDestBase %>css',
                    src: ['jqueryui/images/*.*'],
                    dest: '<%= destBase %>dist/jsh-vendors-<%= pkg.vendorversion %>/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= vendorDestBase %>js/mermaid',
                    src: ['*.js'],
                    dest: '<%= destBase %>dist/jsh-vendors-<%= pkg.vendorversion %>/mermaid/',
                    flatten: false
                },
                // yaio-intern export-vendors
                {
                    expand: true,
                    cwd: '<%= vendorSrcBase %>',
                    src: ['freemind-flash/**'],
                    dest: '<%= destBase %>dist/jsh-vendors-<%= pkg.vendorversion %>/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= vendorSrcBase %>js/',
                    src: ['yaio/**'],
                    dest: '<%= destBase %>dist/jsh-vendors-<%= pkg.vendorversion %>/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= vendorSrcBase %>css/',
                    src: ['yaio/**'],
                    dest: '<%= destBase %>dist/jsh-vendors-<%= pkg.vendorversion %>/',
                    flatten: false
                }

            ]
        },
        // copy vendor-files which must exists in specific pathes to dist
        vendors2distWithoutVersion: {
            files: [
                // vendors without version
                {
                    expand: true,
                    cwd: '<%= destBase %>dist/<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>',
                    src: ['**/*'],
                    dest: '<%= destBase %>dist/<%= pkg.name %>-app-vendors/',
                    flatten: false
                },
                {
                    expand: true,
                    cwd: '<%= destBase %>dist/jsh-vendors-<%= pkg.vendorversion %>',
                    src: ['**/*'],
                    dest: '<%= destBase %>dist/jsh-vendors/',
                    flatten: false
                }
            ]
        },
        // copy archiv to dist
        archiv2dist: {
            files: [
                {expand: true, cwd: '<%= archivSrcBase %>', src: ['**'], dest: '<%= destBase %>dist/', flatten: false}
            ]
        },
        // copy files which must exists in specifc version (because exports include them) from dist to archiv
        dist2archiv: {
            files: [
                {
                    expand: true, cwd: '<%= destBase %>dist/',
                    src: [
                        '<%= pkg.name %>-app-vendors-<%= pkg.vendorversion %>/**',
                        '<%= pkg.name %>-app-vendors--<%= pkg.vendorversion %>.js',
                        '<%= pkg.name %>-app-vendors--<%= pkg.vendorversion %>.css',
                        '<%= pkg.name %>-reset-<%= pkg.resetversion %>.css',
                        'jsh-full-<%= pkg.jshversion %>.js',
                        'jsh-full-<%= pkg.jshversion %>.css',
                        'jsh-print-<%= pkg.jshversion %>.css',
                        'jsh-print-dataonly-<%= pkg.jshversion %>.css'
                    ], dest: '<%= archivSrcBase %>', flatten: false
                },
                {expand: true, cwd: '<%= archivSrcBase %>', src: ['**'], dest: '<%= destBase %>dist/', flatten: false}
            ]
        },
        // copy the ymf.sources to dist
        ymfres2dist: {
            files: [
                {expand: true, cwd: '<%= srcBase %>pages/', src: ['*.html'], dest: '<%= destBase %>', flatten: false},
                {
                    expand: true,
                    cwd: '<%= srcBase %>',
                    src: ['ymf-editorapp/**/*.html', 'ymf-editorapp/**/*.json', 'ymf-editorapp/static/**'],
                    dest: '<%= destBase %>',
                    flatten: false
                }
            ]
        }
    };

    /**
     * patches
     **/
    function checkWebResOnly(srcpath) {
        if (srcpath.search(/\.js|\.css|\.html/) < 0) {
            return false;
        }
        return true;
    }

    function patchFileSlimbox2(content, srcpath) {
        if (! checkWebResOnly(srcpath)) {
            return content;
        }
        var newContent = content;
        console.log('patchFileSlimbox2:' + srcpath);
        newContent = newContent.replace(/\/\*\!/g,
            '    /*!');
        newContent = newContent.replace(/\t/g,
            '    ');
        newContent = newContent.replace(/ img\:not\(\[class\]\)/g,
            ' img.jsh-md-img');

        newContent = newContent.replace('middle = win.scrollTop() + (win.height() / 2);',
            'middle = win.scrollTop() + (window.innerHeight / 2);');
        return newContent;
    }

    function patchFileJQueryUi(content, srcpath) {
        if (!checkWebResOnly(srcpath)) {
            return content;
        }
        var newContent = content;
        console.log('patchFileJQueryUi:' + srcpath);
        newContent = newContent.replace(/url\(images\//g,
            'url(ymf-app-vendors-vendorversion/jqueryui/images/');
        return newContent;
    }

    function patchFileJQueryLang(content, srcpath) {
        if (!checkWebResOnly(srcpath)) {
            return content;
        }
        var newContent = content;
        console.log('patchFileJQueryLang:' + srcpath);
        newContent = newContent.replace(/'placeholder'\n\t*];/g,
            '\'placeholder\',\n\t\t\'data-tooltip\'\n\t];');
        return newContent;
    }

    function patchFileHighlightJsLang(content, srcpath) {
        if (!checkWebResOnly(srcpath)) {
            return content;
        }
        var newContent = content;
        console.log('patchFileHighlightJsLang:' + srcpath);
        newContent = newContent.replace(/\.hljs-annotation,\n.diff .hljs-header,/g,
            '.hljs-annotation,\n.hljs-template_comment,\n.diff .hljs-header,');
        return newContent;
    }
})();