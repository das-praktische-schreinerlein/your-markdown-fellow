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
 * Widget of the Save-Dialog
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration (default set in module)
 *      {string} textAreaId     id of the connected textarea with the source to display
 * @constructor
 */
Ymf.SaveDialog = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'ymf-saveas-box';
    defaultConfig.content = '';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
    };

    /**
     * open saveas-box as jquery-dialog
     */
    me.open = function () {
        me._showUI();
    };

    /**
     * create saveas-box as jquery-dialog
     */
    me._createUI = function () {
        // clear box
        me.$box.empty();

        // add ui
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;

        // add saveas-link -> buggy to mix jquery and styles
        var $fieldset = me.$('<fieldset><legend>Save Markdown</legend></fieldset>');
        me.$box.append($fieldset);
        var clickHandler = ymfAppBaseVarName + '.FileUtils.downloadAsFile(' +
            ymfAppBaseVarName + '.$(\'#ymf-wysiwyg-saveaslink\'), ' +
            ymfAppBaseVarName + '.$(\'#' + me.config.textAreaId + '\').val(), \'data.md\', \'text/markdown\', \'utf-8\');';
        $fieldset.append(
            me.$('<a href="" id="ymf-wysiwyg-saveaslink" sdf="ojfvbhwjh" onclick="' + clickHandler + '">' +
                '<span class="ui-button-text">Markdown File...</span></a>'));
        me.$('#ymf-wysiwyg-saveaslink').addClass('button');

        // add export-link -> buggy to mix jquery and styles
        $fieldset = me.$('<fieldset><legend>Save Preview</legend></fieldset>');
        me.$box.append($fieldset);
        clickHandler = ymfAppBaseVarName + '.FileUtils.downloadAsFile(' +
            ymfAppBaseVarName + '.$(\'#ymf-wysiwyg-exportlink\'), ' +
            ymfAppBaseVarName + '.$(\'#ymf-wysiwyg-preview\').html(), \'data.html\', \'text/html\', \'utf-8\');';
        $fieldset.append(
            me.$('<a href="" id="ymf-wysiwyg-exportlink" sdf="ojfvbhwjh" onclick="' + clickHandler + '">' +
                '<span class="ui-button-text">Html File...</span></a>'));
        me.$('#ymf-wysiwyg-exportlink').addClass('button');

        // create dialog
        me.$box.dialog({
            modal: true,
            width: 300,
            title: 'YMF-Editor Save...',
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

