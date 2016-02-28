(function () {
    'use strict';

    module.exports = {
        // replace all version-placeholders in dist
        versionOnDist: {
            options: {
                patterns: [
                    {
                        match: /[-.]appversion\.(css|js)/g,
                        replacement: '-<%= pkg.appversion %>.$1'
                    },
                    {
                        match: /[-.]jshversion\.(css|js)/g,
                        replacement: '-<%= pkg.jshversion %>.$1'
                    },
                    {
                        match: /[-.]resetversion\.(css|js)/g,
                        replacement: '-<%= pkg.resetversion %>.$1'
                    },
                    {
                        match: /vendors[-.]vendorversion\//g,
                        replacement: 'vendors-<%= pkg.vendorversion %>/'
                    },
                    {
                        match: /[-.]vendorversion\.(css|js)/g,
                        replacement: '-<%= pkg.vendorversion %>.$1'
                    }
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= destBase %>',
                    src: ['*.html', '**/*.html', '**/*.css', '**/*.js', 'ymf-editorapp/static/**'],
                    dest: '<%= destBase %>',
                    flatten: false
                }
            ]
        },
        noVersionOnDist: {
            options: {
                patterns: [
                    {
                        match: /[-.]appversion\.(css|js)/g,
                        replacement: '.$1'
                    },
                    {
                        match: /[-.]jshversion\.(css|js)/g,
                        replacement: '.$1'
                    },
                    {
                        match: /[-.]resetversion\.(css|js)/g,
                        replacement: '.$1'
                    },
                    {
                        match: /vendors[-.]vendorversion\//g,
                        replacement: 'vendors/'
                    },
                    {
                        match: /[-.]vendorversion\.(css|js)/g,
                        replacement: '.$1'
                    }
                ]
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= destBase %>',
                    src: ['*.html', '**/*.html', '**/*.css', '**/*.js', 'ymf-editorapp/static/**'],
                    dest: '<%= destBase %>',
                    flatten: false
                }
            ]
        }
    };
})();