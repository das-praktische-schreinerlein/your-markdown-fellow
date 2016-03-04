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
 * base-instance of the markdowneditor
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @param {JsHelferlein.ConfigBase} config     optional configuration (default set in module)
 *      {boolean} usePrintWidget               create and sync PrintWidget
 * @return {Ymf.MarkdownEditorController}      an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
Ymf.MarkdownEditorController = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.usePrintWidget = true;

    var me = JsHelferlein.ServiceBase(appBase, config, defaultConfig);

    /**
     * initialize the widgets...
     */
    me._init = function () {
        me.orientation = 'free';
        me.wordwrap = false;
        me.prepareWidgets();
    };

    /**
     * prepare the widgets used by the editor (help, wysiwyg, print, preview)
     */
    me.prepareWidgets = function() {
        me.helpWidget = new Ymf.HelpBox(me.appBase);
        me.previewWidget = new Ymf.PreviewBox(me.appBase);
        me.printWidget = me.config.usePrintWidget ? new Ymf.PrintBox(me.appBase) : undefined;
        me.wysiwygWidget = new Ymf.WysiwygBox(me.appBase);
    };

    /**
     * open the speechRecognition-box with the content of element with id:textAreaId, result will be saved back to the element
     * @param {string} textAreaId       id of the element to get/ser content
     */
    me.openSpeechReconitionForElement = function (textAreaId) {
        me.appBase.SpeechRecognitionController.open(textAreaId);
    };

    /**
     * open the speechSynth-box with the content of element with id:textAreaId
     * @param {string} textAreaId       id of the element to get content
     */
    me.openSpeechSynthForElement = function (textAreaId) {
        me.appBase.SpeechSynthController.open(textAreaId);
    };

    /**
     * open the speechRecognition-box with the content of element with id:textAreaId
     * @param {string} textAreaId       id of the element to get/set content
     */
    me.openSpeechRecognitionForElement = function (textAreaId) {
        me.appBase.SpeechRecognitionController.open(textAreaId);
    };

    /**
     * open the preview-box with the rendered markdown from the content of element with id:textAreaId
     * @param {string} textAreaId       id of the element to get content
     */
    me.openPreviewBoxForElement = function (textAreaId) {
        var descText = me.$('#' + textAreaId).val();
        me.openPreviewBoxWithContent(descText);
    };

    /**
     * open the preview-box and render the content
     * @param {string} content       markdown-src to render
     */
    me.openPreviewBoxWithContent = function (content) {
        // open Box
        me.previewWidget.open();
        me.previewWidget.setContent(content);

        // make it responsive
        $(window).on('resize', function () {
            me.resizeYMFBoxes(30);
        });
        me.resizeYMFBoxes(30);
    };

    /**
     * open the markdown-help-box with the markdownhelp.html
     */
    me.openMarkdownHelp = function () {
        // open Box
        me.helpWidget.open();
    };

    /**
     * open the wysiwyg-editor-box with the src and rendered markdown from the content
     * @param {string} textAreaId       id of the element to get content and sync editor
     */
    me.openWysiwygEditorForElement = function (textAreaId) {
        // get existing parentEditor
        var parentEditorId = 'editor' + textAreaId.charAt(0).toUpperCase() + textAreaId.substring(1);
        var parentEditor = me.$('#' + parentEditorId).data('aceEditor');
        console.log('found parentEditor on:' + parentEditorId);

        // configure and init widget
        var myParentId = 'ymf-wysiwyg-editor';
        me.wysiwygWidget.config.textAreaId = textAreaId;
        me.wysiwygWidget.config.myParentId = myParentId;

        // create  Editor
        var editor = me.createMarkdownEditorForTextarea(myParentId, textAreaId);

        // reset intervallHandler for this parent
        var intervalHandler = me.$('#' + myParentId).data('aceEditor.intervalHandler');
        if (!me.appBase.DataUtils.isUndefined(intervalHandler)) {
            console.log('openWysiwygEditorForElement: clear old Interval : ' + intervalHandler + ' for ' + myParentId);
            clearInterval(intervalHandler);
        }
        // create new intervalHandler: check every 5 second if there is a change und update all
        me.$('#' + myParentId).data('aceEditor.flgChanged', 'false');
        intervalHandler = setInterval(function () {
            // check if something changed
            var flgChanged = me.$('#' + myParentId).data('aceEditor.flgChanged');
            if (flgChanged !== 'true') {
                // nothing changed
                return;
            }

            console.log('openWysiwygEditorForElement: updateData : ' + ' for ' + myParentId);

            // reset flag
            me.$('#' + myParentId).data('aceEditor.flgChanged', 'false');

            // update textarea for angular
            var value = editor.getValue();
            me.$('#' + textAreaId).val(value).trigger('select').triggerHandler('change');
            console.log('openWysiwygEditorForElement: updatetextAreaId: ' + textAreaId);

            // update parent
            if (parentEditor) {
                parentEditor.setValue(value);
            }

            // update preview and print
            me.wysiwygWidget._renderContent();
            if (me.config.usePrintWidget && me.printWidget) {
                me.printWidget.setContent(value);
            }
        }, 5000);
        console.log('openWysiwygEditorForElement: setIntervall : ' + intervalHandler + ' for ' + myParentId);
        me.$('#' + myParentId).data('aceEditor.intervalHandler', intervalHandler);

        // set update-event
        editor.getSession().on('change', function (e) {
            me.$('#' + myParentId).data('aceEditor.flgChanged', 'true');
        });

        // configure and open Box
        me.wysiwygWidget.config.editor = editor;
        me.wysiwygWidget.config.updateIntervalHandler = intervalHandler;
        me.wysiwygWidget.open();

        // make it responsive
        $(window).on('resize', function () {
            me.resizeYMFBoxes(30);
        });
        me.resizeYMFBoxes(30);

        // set print
        if (me.config.usePrintWidget && me.printWidget) {
            me.printWidget.setContent(editor.getValue());
        }
    };

    /**
     * set workdwrap-option of editor
     * @param {string} parentEditorId   id of the editor-element on which the ace-editor was added
     * @param {boolean} value           wordwrap-option
     */
    me.setWordwrap = function (parentEditorId, value) {
        var editor = me.$('#' + parentEditorId).data('aceEditor');
        me.wordwrap = value;
        if (editor) {
            editor.getSession().setUseWrapMode(me.wordwrap);
        }
    };

    /**
     * set preview-orientation for all preview-boxes and resize then
     * @param {string} orientation           portrait, landscape, free
     */
    me.setPreviewOrientation = function (orientation) {
        me.orientation = orientation;
        me._resizeWysiwygEditor();
        me._resizePreviewBox();
    };

    /**
     * resize all ymf-wysiwyg/preview-boxes (ymf-wysiwyg-box, ymf-preview-box) depending on window-size
     * @param {int} globBorder       border in px
     */
    me.resizeYMFBoxes = function (globBorder) {
        var parent = window;
        var height = me.$(parent).innerHeight() - (2 * globBorder);
        var width = me.$(parent).innerWidth() -  (2 * globBorder);

        var filter = 'div[aria-describedby="ymf-wysiwyg-box"], div[aria-describedby="ymf-preview-box"]';
        var $dialog = me.$(filter);
        $dialog.css('height', height.toString() + 'px');
        $dialog.css('width', width.toString() + 'px');
        $dialog.css('top', globBorder.toString() + 'px');
        $dialog.css('left', globBorder.toString() + 'px');
        me._resizeWysiwygBox();
        me._resizePreviewBox();
    };

    /**
     * create ace-editor on element parentId with markdown-syntax, synchronized with textarea
     * @param {string} parentId         id of the element to append the editor
     * @param {string} textAreaId       id of the element to get content and synchronize
     */
    me.createMarkdownEditorForTextarea = function (parentId, textAreaId) {
        var editor = ace.edit(parentId);

        // configure
        editor.setTheme('ace/theme/textmate');

        editor.getSession().setTabSize(4);
        editor.getSession().setUseSoftTabs(true);
        editor.getSession().setMode('ace/mode/markdown');
        editor.setHighlightActiveLine(true);
        editor.setShowPrintMargin(true);

        // options from http://ace.c9.io/build/kitchen-sink.html
        // editor.setShowFoldWidgets(value !== 'manual');
        // editor.setOption('wrap', 'free');
        // editor.setOption('selectionStyle', checked ? 'line' : 'text');
        editor.setShowInvisibles(true);
        editor.setDisplayIndentGuides(true);
        editor.setPrintMarginColumn(80);
        editor.setShowPrintMargin(true);
        editor.setHighlightSelectedWord(true);
        // editor.setOption('hScrollBarAlwaysVisible', checked);
        // editor.setOption('vScrollBarAlwaysVisible', checked);
        editor.setAnimatedScroll(true);
        // editor.setBehavioursEnabled(checked);
        // editor.setFadeFoldWidgets(true);
        // editor.setOption('spellcheck', true);
        //https://github.com/swenson/ace_spell_check_js
        //https://github.com/cfinke/Typo.js#f399cf7191c4cb9a1fc55400a1a850367e8d6eb4
        editor.getSession().setUseWrapMode(me.wordwrap);

        // set value
        editor.setValue(me.$('#' + textAreaId).val());

        // set eventhandler to update corresponding textarea
        editor.getSession().on('change', function (e) {
            // update textarea for angular
            me.$('#' + textAreaId).val(editor.getValue()).trigger('select').triggerHandler('change');
        });

        // set editor as data-attr on parent
        me.$('#' + parentId).data('aceEditor', editor);

        return editor;
    };

    /**
     * resize the preview-window depending on "#ymf-' + prefix + 'container"
     * @param {string}           prefix of the window (wysiwyg-content, preview-content)
     */
    me._resizeWysiwygPreviewForOrientation = function (prefix) {
        var $container = me.$('#ymf-' + prefix + 'container');
        var $preview = me.$('#ymf-' + prefix);
        var parentWith = $container.innerWidth(),
            height = $container.innerHeight(),
            scaleFactorX, newHeight, newWidth;
        if (me.orientation === 'landscape' || me.orientation === 'portrait') {
            if (me.orientation === 'landscape') {
                parentWith = parentWith - 40;
                height = height - 40;
                newWidth = 1150;
            } else {
                parentWith = parentWith - 20;
                height = height - 20;

                newWidth = 640;
            }

            scaleFactorX = parentWith / newWidth;
            if (scaleFactorX >= 1) {
                // no zoom
                $preview.css('width', newWidth + 'px');
                $preview.css('transform', '');
                $preview.css('height', 'auto');
                $container.css('overflow', 'auto');
                $preview.css('margin', '0 auto');
            } else {
                // do scale
                newHeight = height / scaleFactorX;
                $preview.css('width', newWidth + 'px');
                $preview.css('transform-origin', 'top left');
                $preview.css('transform', 'scale(' + scaleFactorX + ')');
                $preview.css('height', newHeight + 'px');
                $container.css('overflow', 'hidden');
                $preview.css('margin', '0 auto');
            }
        } else {
            // reset to defaults
            $preview.css('width', '100%');
            $preview.css('transform', '');
            $preview.css('height', 'auto');
            $container.css('overflow', 'auto');
            $preview.css('margin', 'auto');
        }
    };

    /**
     * resize the wysiwyg-editor and wysiwyg-preview depending on wysiwyg-box
     */
    me._resizeWysiwygEditor = function () {
        var $parent = me.$('#ymf-wysiwyg-box');
        var $editor = me.$('#ymf-wysiwyg-editor');
        var $previewcontainer = me.$('#ymf-wysiwyg-previewcontainer');
        var $preview = me.$('#ymf-wysiwyg-preview');

        var height = $parent.innerHeight();
        var scrollbarHeight = 30;
        var containerPuffer = 10;

        $editor.css('width', '48%');
        $previewcontainer.css('width', '48%');
        $editor.css('height', (height - scrollbarHeight).toString() + 'px');
        $editor.css('max-height', (height - scrollbarHeight).toString() + 'px');
        $previewcontainer.css('height', (height - containerPuffer).toString() + 'px');
        $preview.css('height', (height - scrollbarHeight).toString() + 'px');

        me._resizeWysiwygPreviewForOrientation('wysiwyg-preview');
    };

    /**
     * resize the wysiwyg-box with editor and preview depending on parent-window
     */
    me._resizeWysiwygBox = function () {
        var $wysiwyg = me.$('#ymf-wysiwyg-box');
        var $parent = $wysiwyg.parent();

        var sumUIElementsHeight = 80;
        var height = $parent.innerHeight() - sumUIElementsHeight;
        var width = $parent.innerWidth();

        $wysiwyg.css('width', (width).toString() + 'px');
        $wysiwyg.css('height', (height).toString() + 'px');

        me._resizeWysiwygEditor();
    };

    /**
     * resize the preview-box with editor and preview depending on parent-window
     */
    me._resizePreviewBox = function () {
        var $preview = me.$('#ymf-preview-box');
        var $contentcontainer = me.$('#ymf-preview-contentcontainer');
        var $content = me.$('#ymf-preview-content');
        var $parent = $preview.parent();

        var sumUIElementsHeight = 80;
        var scrollbarHeight = 30;
        var containerPuffer = 10;
        var height = $parent.innerHeight() - sumUIElementsHeight;
        var width = $parent.innerWidth();

        $preview.css('width', (width).toString() + 'px');
        $preview.css('height', (height).toString() + 'px');

        $contentcontainer.css('width', '100%');
        $contentcontainer.css('height', (height - containerPuffer).toString() + 'px');
        $content.css('height', (height - scrollbarHeight).toString() + 'px');

        me._resizeWysiwygPreviewForOrientation('preview-content');
    };

    me._init();

    return me;
};

