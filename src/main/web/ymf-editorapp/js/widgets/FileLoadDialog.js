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
 * Widget of the FileLoad-Dialog
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration (default set in module)
 *      {string} url          url to the markdown-helpfile to open in separate window
 * @constructor
 */
Ymf.FileLoadDialog = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'ymf-uploader-box';
    defaultConfig.content = '<input type="file" id="ymf-import-filedialog" name="ymf-import-filedialog" value="Load Markdown"/>';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
    };

    /**
     * open uploader-box as jquery-dialog
     */
    me.open = function () {
        me._showUI();
    };

    /**
     * create uploader-box as jquery-dialog
     */
    me._createUI = function () {
        // define handler
        var handleImportMarkdownFileSelectHandler = function handleImportMarkdownFileSelect(evt) {
            var files = evt.target.files;
            var reader = new FileReader();

            if (files.length === 1) {
                var file = files[0];

                // configure reader
                reader.onload = function (res) {
                    console.log('read fileName:' + file.name);
                    var data = res.target.result;

                    // set new content (textarea+editor)
                    me.config.editor.setValue(data);
                    me.$('#' + me.config.myParentId).data('aceEditor.flgChanged', 'true');
                };

                // read the file
                reader.readAsText(file);
            }
        };

        // initFileUploader
        var fileDialog = document.getElementById('ymf-import-filedialog');
        fileDialog.addEventListener('change', handleImportMarkdownFileSelectHandler, false);
        me.$box.dialog({
            modal: true,
            width: 300,
            title: 'YMF Fileloader',
            buttons: {
                'Schließen': function () {
                    me.close();
                }
            }
        });
    };

    me._init();

    return me;
};

