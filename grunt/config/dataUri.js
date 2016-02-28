(function () {
    'use strict';

    module.exports = {
        distIconsJsh: {
            // src file
            src: ['<%= destBase %>dist/jsh-icons-embed.css'],
            // output dir
            dest: '<%= destBase %>dist/',
            options: {
                // specified files are only encoding
                target: ['<%= resSrcBase %>images/icons/**/*.png', '<%= resSrcBase %>images/icons/**/*.gif', '<%= resSrcBase %>images/icons/**/*.jpg'],
                // adjust relative path?
                fixDirLevel: true,
                // img detecting base dir
                baseDir: '<%= resSrcBase %>images/icons/jsh/',

                // Do not inline any images larger
                // than this size. 2048 is a size
                // recommended by Google's mod_pagespeed.
                maxBytes: 20000
            }
        },
        distIconsYmf: {
            // src file
            src: ['<%= destBase %>dist/ymf-icons-embed.css'],
            // output dir
            dest: '<%= destBase %>dist/',
            options: {
                // specified files are only encoding
                target: ['<%= resSrcBase %>images/icons/**/*.png', '<%= resSrcBase %>images/icons/**/*.gif', '<%= resSrcBase %>images/icons/**/*.jpg'],
                // adjust relative path?
                fixDirLevel: true,
                // img detecting base dir
                baseDir: '<%= resSrcBase %>images/icons/ymf/',

                // Do not inline any images larger
                // than this size. 2048 is a size
                // recommended by Google's mod_pagespeed.
                maxBytes: 20000
            }
        }
    };
})();