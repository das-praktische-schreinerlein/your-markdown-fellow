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
 * Widget of the LayoutOptions-Dialog
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration (default set in module)
 *      {string} textAreaId     id of the connected textarea with the source to display
 * @constructor
 */
Ymf.LayoutOptionsDialog = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'ymf-layout-box';
    defaultConfig.content = '';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
    };

    /**
     * open layout-box as jquery-dialog
     */
    me.open = function () {
        me._showUI();
    };

    /**
     * create layout-box as jquery-dialog
     */
    me._createUI = function () {
        // clear box
        me.$box.empty();

        // add ui
        var $fieldset = me.$('<fieldset><legend>Preview-Layout</legend></fieldset>');
        me.$box.append($fieldset);

        var orientation = me.appBase.YmfMarkdownEditorController.orientation;

        // add preview-orientation
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;
        var clickHandler = ymfAppBaseVarName + '.YmfMarkdownEditorController.setPreviewOrientation(\'portrait\');';
        $fieldset.append(
            me.$('<input id="ymf-wysiwyg-input-portrait" value="portrait" type="radio"' +
                ' name="ymf-wysiwyg-input-orientation" ' + (orientation === 'portrait' ? 'checked="checked"' : '') +
                ' onclick="' + clickHandler + '">' +
                '<label for="ymf-wysiwyg-input-portrait">Portrait A4-Hochformat</label></input><br />')
        );
        clickHandler = ymfAppBaseVarName + '.YmfMarkdownEditorController.setPreviewOrientation(\'landscape\');';
        $fieldset.append(
            me.$('<input id="ymf-wysiwyg-input-landscape" value="landscape" type="radio"' +
                ' name="ymf-wysiwyg-input-orientation" ' + (orientation === 'landscape' ? 'checked="checked"' : '') +
                ' onclick="' + clickHandler + '">' +
                '<label for="ymf-wysiwyg-input-landscape">Landscape A4-Querformat</label></input><br />')
        );
        clickHandler = ymfAppBaseVarName + '.YmfMarkdownEditorController.setPreviewOrientation(\'free\');';
        $fieldset.append(
            me.$('<input id="ymf-wysiwyg-input-free" value="free" type="radio"' +
                ' name="ymf-wysiwyg-input-orientation" ' + (orientation === 'free' ? 'checked="checked"' : '') +
                ' onclick="' + clickHandler + '">' +
                '<label for="ymf-wysiwyg-input-free">Screen - verfügbare Breite</label></input><br />')
        );

        // add wordwrap
        $fieldset = me.$('<fieldset><legend>Editor</legend></fieldset>');
        me.$box.append($fieldset);
        clickHandler = ymfAppBaseVarName + '.YmfMarkdownEditorController.setWordwrap(\'ymf-wysiwyg-editor\', ' +
            ymfAppBaseVarName + '.$(\'#ymf-wysiwyg-input-wordwrap\').prop(\'checked\'));';
        $fieldset.append(
            me.$('<input id="ymf-wysiwyg-input-wordwrap" value="true" type="checkbox" ' +
                (me.appBase.YmfMarkdownEditorController.wordwrap === true ? 'checked="checked"' : '') +
                ' name="ymf-wysiwyg-input-wordwrap" onclick="' + clickHandler + '">' +
                '<label for="ymf-wysiwyg-input-wordwrap">Wordwrap</label></input>')
        );

        // create dialog
        me.$box.dialog({
            modal: true,
            width: 300,
            title: 'YMF-Editor Layout...',
            buttons: {
                'OK': function () {
                    me.close();
                }
            }
        });
    };

    me._init();

    return me;
};

