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
 * Widget of the Preview-Box
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration (default set in module)
 * @return {Ymf.PreviewBox}                         an instance of the widget
 * @augments JsHelferlein.WidgetBox
 * @constructor
 */
Ymf.PreviewBox = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'ymf-preview-box';
    defaultConfig.content = '<div id="ymf-preview-contentcontainer" class="container-preview-contentcontainer">' +
        '    <div id="ymf-preview-content" class="container-content-desc"></div>' +
        '</div>';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
    };

    /**
     * set content of the preview-box
     * @param {string} content    content to show in box
     */
    me.setContent = function (content) {
        // set ymf-preview-content
        var svcYmfRenderer = me.appBase.YmfRenderer;

        // prepare descText
        var descHtmlMarked = svcYmfRenderer.renderMarkdown(content, true);

        me.$('#ymf-preview-content').html(descHtmlMarked);

        svcYmfRenderer.runAllRendererOnBlock(me.$('#ymf-preview-content'));
    };

    /**
     * open preview-box as jquery-dialog
     */
    me.open = function () {
        me._showUI();
    };

    /**
     * create preview-box as jquery-dialog
     */
    me._createUI = function () {
        me.$box.dialog({
            modal: true,
            width: 1050,
            title: 'YMF-Markdown-Preview',
            buttons: {
                Ok: function () {
                    me.close();
                },
                'Vorlesen': {
                    id: 'Vorlesen',
                    text: 'Vorlesen',
                    class: 'jsh-show-inline-block-if-speechsynth',
                    click: function () {
                        me.appBase.YmfMarkdownEditorController.openSpeechSynthForElement('ymf-preview-content');
                    }
                }
            }
        });
    };

    me._init();

    return me;
};

