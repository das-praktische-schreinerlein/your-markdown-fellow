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
 * factory to create editor and toolbar
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @param {JsHelferlein.ConfigBase} config     optional configuration (default set in module)
 *      {boolean} usePrintWidget               create and sync PrintWidget
 * @return {Ymf.MarkdownEditorController}      an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
Ymf.MarkdownEditorFactory = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();

    var me = JsHelferlein.ServiceBase(appBase, config, defaultConfig);

    /**
     * initialize
     */
    me._init = function () {
    };


    /**
     * create an ace-markdown-editor for parentId
     * @param parentId       id of the html-element to create an ace-markdown-editor
     * @returns {ace.Editor} instance of an ace-editor
     */
    me.createMarkdownEditor = function(parentId) {
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

        return editor;
    };

    /**
     * append an editorToolbar for ace-markdown-editor to containerSelector
     * @param editor             the ace editor-instance
     * @param containerSelector
     */
    me.createEditorToolbar = function (editor, containerSelector) {
        var html = '';
        html += '<div class="ymf-toolbar">';

        html += '<button type="button" title="Heading 1" class="ymf-toolbar-btn" data-btn="h1">H1</button>';
        html += '<button type="button" title="Heading 2" class="ymf-toolbar-btn" data-btn="h2">H2</button>';
        html += '<button type="button" title="Heading 3" class="ymf-toolbar-btn" data-btn="h3">H3</button>';

        html += '<button type="button" title="Bold" class="ymf-toolbar-btn" data-btn="bold"><b>B</b></button>';
        html += '<button type="button" title="Italic" class="ymf-toolbar-btn" data-btn="italic"><i>I</i></button>';

        html += '<button type="button" title="List" class="ymf-toolbar-btn" data-btn="ul">List</button>';
        html += '<button type="button" title="OrderedList" class="ymf-toolbar-btn" data-btn="ol">1.</button>';

        html += '<button type="button" title="Link" class="ymf-toolbar-btn" data-btn="link">Link</button>';

        html += '<button type="button" title="Link" class="ymf-toolbar-btn" data-btn="toc">TOC</button>';
        html += '<button type="button" title="Table" class="ymf-toolbar-btn" data-btn="table">Table</button>';
        html += '<button type="button" title="Box" class="ymf-toolbar-btn" data-btn="boxinfo">Box</button>';
        html += '<button type="button" title="Container" class="ymf-toolbar-btn" data-btn="container">Container</button>';
        html += '<button type="button" title="Code" class="ymf-toolbar-btn" data-btn="code">Code</button>';

        html += '</div>';

        me.$(containerSelector).append(me.$(html));
        me.$(containerSelector).find('.ymf-toolbar-btn').click(function () {
            var btnType = $(this).data('btn');

            if (btnType === 'h1') {
                me._insertBeforeText(editor, '#');
            } else if (btnType === 'h2') {
                me._insertBeforeText(editor, '##');
            } else if (btnType === 'h3') {
                me._insertBeforeText(editor, '###');
            } else if (btnType === 'ul') {
                me._insertBeforeText(editor, '-');
            } else if (btnType === 'ol') {
                me._insertBeforeText(editor, '1.');
            } else if (btnType === 'toc') {
                me._insertBeforeText(editor, '\n<!---TOC --->\n');
            } else if (btnType === 'table') {
                me._insertBeforeText(editor, '\n|Head1 | Head2 | Head3|\n|----|----|----|\n|Column1 | Column2 | Column3|\n');
            } else if (btnType === 'bold') {
                editor.execCommand('bold');
            } else if (btnType === 'italic') {
                editor.execCommand('italic');
            } else if (btnType === 'link') {
                editor.execCommand('link');
            } else if (btnType === 'code') {
                editor.execCommand('code');
            } else if (btnType === 'container') {
                editor.execCommand('container');
            } else if (btnType === 'boxinfo') {
                editor.execCommand('boxinfo');
            }
        });

        me._initAdditionalEditorCommands(editor);
    };

    me._insertBeforeText = function (editor, string) {

        if (editor.getCursorPosition().column === 0) {
            editor.navigateLineStart();
            editor.insert(string + ' ');
        } else {
            editor.navigateLineStart();
            editor.insert(string + ' ');
            editor.navigateLineEnd();
        }
    };

    me._initAdditionalEditorCommands = function (editor) {
        ace.config.loadModule('ace/ext/language_tools', function () {
            var snippets = ace.require('ace/snippets');
            var snippetManager = snippets.snippetManager;

            editor.commands.addCommand({
                name: 'bold',
                exec: function () {
                    me._execAdditionalEditorCommands(editor, snippetManager, function (selectedText) {
                        if (selectedText === '') {
                            return '**${1:text}**';
                        } else {
                            return '**' + selectedText + '**';
                        }
                    });
                },
                readOnly: false
            });
            editor.commands.addCommand({
                name: 'italic',
                exec: function () {
                    me._execAdditionalEditorCommands(editor, snippetManager, function (selectedText) {
                        if (selectedText === '') {
                            return '*${1:text}*';
                        } else {
                            return '*' + selectedText + '*';
                        }
                    });
                },
                readOnly: false
            });
            editor.commands.addCommand({
                name: 'link',
                exec: function () {
                    me._execAdditionalEditorCommands(editor, snippetManager, function (selectedText) {
                        if (selectedText === '') {
                            return '[${1:text}](http://$2)';
                        } else {
                            return '[' + selectedText + '](http://$1)';
                        }
                    });
                },
                readOnly: false
            });
            editor.commands.addCommand({
                name: 'boxinfo',
                exec: function () {
                    me._execAdditionalEditorCommands(editor, snippetManager, function (selectedText) {
                        if (selectedText === '') {
                            return '\n<!---BOX.INFO Der Infoname--->\nInhalt\n\n<!---/BOX.INFO--->\n';
                        } else {
                            return '\n<!---BOX.INFO Der Infoname--->\n' + selectedText + '\n\n<!---/BOX.INFO--->\n';
                        }
                    });
                },
                readOnly: false
            });
            editor.commands.addCommand({
                name: 'container',
                exec: function () {
                    me._execAdditionalEditorCommands(editor, snippetManager, function (selectedText) {
                        if (selectedText === '') {
                            return '\n<!---BOX--->\n# Deine Überschrift <!---TOGGLER ContainerId,icon--->\n<!---CONTAINER ContainerId--->\nInhalt\n\n<!---/CONTAINER--->\n<!---/BOX--->\n';
                        } else {
                            return '\n<!---BOX--->\n# Deine Überschrift <!---TOGGLER ContainerId,icon--->\n<!---CONTAINER ContainerId--->\n\n' + selectedText + '\n\n<!---/CONTAINER--->\n<!---/BOX--->\n';
                        }
                    });
                },
                readOnly: false
            });
            editor.commands.addCommand({
                name: 'code',
                exec: function () {
                    me._execAdditionalEditorCommands(editor, snippetManager, function (selectedText) {
                        if (selectedText === '') {
                            return '\n```\nInhalt\n```\n';
                        } else {
                            return '\n```\n' + selectedText + '\n```\n';
                        }
                    });
                },
                readOnly: false
            });
        });
    };

    me._execAdditionalEditorCommands = function (editor, snippetManager, callBackGetText) {
        var selectedText = editor.session.getTextRange(editor.getSelectionRange());
        if (selectedText === '') {
            snippetManager.insertSnippet(editor, callBackGetText(selectedText));
        } else {
            snippetManager.insertSnippet(editor, callBackGetText(selectedText));
        }
    };


    me._init();

    return me;
};

