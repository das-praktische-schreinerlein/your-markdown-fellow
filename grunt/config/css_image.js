(function () {
    'use strict';

    module.exports = {
        distJsh: {
            files: [{
                cwd: '<%= resSrcBase %>images/icons/jsh/',
                src: '**/*.{png,jpg,gif}',
                dest: '<%= destBase %>dist/jsh-icons-embed.css'
            }],
            options: {
                prefix: '',
                /* jshint camelcase: false */
                images_path: './'
                /* jshint camelcase: true */
            }
        },
        distYmf: {
            files: [{
                cwd: '<%= resSrcBase %>images/icons/ymf/',
                src: '**/*.{png,jpg,gif}',
                dest: '<%= destBase %>dist/ymf-icons-embed.css'
            }],
            options: {
                prefix: '',
                /* jshint camelcase: false */
                images_path: './'
                /* jshint camelcase: true */
            }
        }
    };
})();