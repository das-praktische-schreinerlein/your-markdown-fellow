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
 * Widget of the WysiwygEditor-Box
 * @param appBase
 * @param config
 *      {string} textAreaId     id of the connected textarea with the source to display
 *      {string} myParentId     parentId
 *      {object} editor         instance of the ace-editor
 *      {handler} updateIntervalHandler  intrvallHandler which updates the preview
 * @constructor
 */
Ymf.WysiwygBox = function (appBase, config) {
    'use strict';
    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'ymf-wysiwyg-box';
    defaultConfig.content = '<pre id="ymf-wysiwyg-editor" class="container-wyswhg-editor"></pre>' +
        '  <div id="ymf-wysiwyg-previewcontainer" class="container-wysiwyg-previewcontainer">' +
        '    <div id="ymf-wysiwyg-preview" class="container-wysiwyg-preview"></div>' +
        '  </div>' +
        '</div>';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
        me.prepareWidgets();
    };

    me.prepareWidgets = function() {
        me.fileLoadDialog = new Ymf.FileLoadDialog(me.appBase);
        me.saveDialog = new Ymf.SaveDialog(me.appBase);
        me.layoutOptionsDialog = new Ymf.LayoutOptionsDialog(me.appBase);
    };

    /**
     * set content of the wysiwyg-box
     * @param {string} content    content to show in box
     */
    me.setContent = function (content) {
        // set ymf-wysiwyg-content
        me.$('#ymf-wysiwyg-content').html(content);
    };

    /**
     * open wysiwyg-box as jquery-dialog
     */
    me.open = function () {
        me._showUI();
        me._renderContent();
    };

    /**
     * close box and clear updatehandlerfor connected ace-dialog
     */
    me.close = function() {
        me._hideUI();
        console.log('openWysiwygEditorBox: clearMyInterval : ' + me.config.updateIntervalHandler + ' for ' + me.config.myParentId);
        clearInterval(me.config.updateIntervalHandler);
    };

    /**
     * render the content of the wysiwygbox
     */
    me._renderContent = function () {
        var svcYmfRenderer = me.appBase.YmfRenderer;

        var descText = me.$('#' + me.config.textAreaId).val();
        var descHtmlMarked = svcYmfRenderer.renderMarkdown(descText, true);

        me.$('#ymf-wysiwyg-preview').html(descHtmlMarked);

        svcYmfRenderer.runAllRendererOnBlock(me.$('#ymf-wysiwyg-preview'));
    };

    /**
     * create wysiwyg-box as jquery-dialog
     */
    me._createUI = function () {
        // show message
        me.$box.dialog({
            modal: true,
            width: 1200,
            height: 750,
            title: 'YMF-Markdown-Editor',
            buttons: {
                Ok: function () {
                    me.close();
                },
                'Hilfe': function () {
                    me.appBase.YmfMarkdownEditorController.openMarkdownHelp();
                },
                'Vorschau': function () {
                    me.appBase.YmfMarkdownEditorController.openPreviewBoxForElement(me.config.textAreaId);
                },
                'Vorlesen': {
                    id: 'Vorlesen',
                    text: 'Vorlesen',
                    class: 'jsh-show-inline-block-if-speechsynth',
                    click: function () {
                        me.appBase.YmfMarkdownEditorController.openSpeechSynthForElement('ymf-wysiwyg-preview');
                    }
                },
/**
                'Spracherkennung': {
                    id: 'Spracherkennung',
                    text: 'Spracherkennung',
                    class: 'jsh-show-inline-block-if-speechrecognition',
                    click: function () {
                        me.appBase.YmfMarkdownEditorController.openSpeechRecognitionForElement(me.config.textAreaId);
                    }
                },
**/
                'Load...': function () {
                    me.fileLoadDialog.config.myParentId = me.config.myParentId;
                    me.fileLoadDialog.config.editor = me.config.editor;
                    me.fileLoadDialog.open();
                },
                'Save...': function () {
                    me.saveDialog.config.textAreaId = me.config.textAreaId;
                    me.saveDialog.open();
                },
                'Layout...': function () {
                    me.layoutOptionsDialog.config.textAreaId = me.config.textAreaId;
                    me.layoutOptionsDialog.open();
                }
            }
        });
        me.$instance = me._getUIInstance();
    };

    me._init();

    return me;
};

