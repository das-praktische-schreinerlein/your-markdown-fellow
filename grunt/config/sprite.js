(function () {
    'use strict';

    module.exports = {
        iconsJsh: {
            src: '<%= resSrcBase %>images/icons/jsh/*.*',
            dest: '<%= destBase %>dist/jsh-icons-sprite.png',
            destCss: '<%= destBase %>dist/jsh-icons-sprite.css',
            cssTemplate: 'css.template.handlebars',
            cssVarMap: function (sprite) {
                sprite.name = 'jsh-' + sprite.name;
            }
        },
        iconsYmf: {
            src: '<%= resSrcBase %>images/icons/ymf/*.*',
            dest: '<%= destBase %>dist/ymf-icons-sprite.png',
            destCss: '<%= destBase %>dist/ymf-icons-sprite.css',
            cssTemplate: 'css.template.handlebars',
            cssVarMap: function (sprite) {
                sprite.name = 'jsh-' + sprite.name;
            }
        }
    };
})();