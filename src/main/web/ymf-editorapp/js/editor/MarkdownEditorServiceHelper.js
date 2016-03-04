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
 * service for adding editor/preview-links to your app-elements
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @return {Ymf.MarkdownEditorServiceHelper}        an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
Ymf.MarkdownEditorServiceHelper = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * add preview-link to label of input-elements if availiable<br>
     * set the flg previewAdded on the element, so that there is no doubling
     * @param {Object} filter                 selector to filter label elements (used as jquery-filter)
     */
    me.addPreviewToElements = function (filter) {
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;

        // add preview to nodeDesc
        me.$(filter).append(function (idx) {
            var link = '';
            var label = this;

            // check if already set
            if (me.$(label).attr('previewAdded')) {
                console.error('addPreviewElements: SKIP because already added: ' + me.$(label).attr('for'));
                return link;
            }

            // get corresponding form
            var forName = me.$(label).attr('for');
            var form = me.$(label).closest('form');

            // get for-element byName from form
            var forElement = form.find('[name=' + forName + ']').first();
            if (forElement.length > 0) {
                // define link to label
                var clickHandler = ymfAppBaseVarName +
                    '.YmfMarkdownEditorController.openPreviewBoxForElement(\'' + forElement.attr('id') + '\'); return false;';
                link = '<a href="#" id="showPreview4' + forElement.attr('id') + '"' +
                    ' onClick="' + clickHandler + '" lang="tech"' +
                    ' data-tooltip="tooltip.command.OpenPreview" class="button">common.command.OpenPreview</a>';
                clickHandler = ymfAppBaseVarName + '.YmfMarkdownEditorController.openMarkdownHelp(); return false;';
                link += '<a href="#" id="openMarkdownHelp4' + forElement.attr('id') + '"' +
                    ' onClick="' + clickHandler + '" lang="tech"' +
                    ' data-tooltip="tooltip.command.OpenMarkdownHelp" class="button">common.command.OpenMarkdownHelp</a>';

                // set flag
                me.$(label).attr('previewAdded', 'true');
                console.log('addPreviewToElements: add : ' + forName + ' for ' + forElement.attr('id'));
            }
            return link;
        });
    };

    /**
     * add editor-link to label of input-elements if availiable<br>
     * set the flg wysiwygAdded on the element, so that there is no doubling
     * @param {Object} filter                 selector to filter label elements (used as jquery-filter)
     */
    me.addWysiwygToElements = function (filter) {
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;

        // add preview to nodeDesc
        me.$(filter).append(function (idx) {
            var link = '';
            var label = this;

            // check if already set
            if (me.$(label).attr('wysiwygAdded')) {
                console.error('addWysiwygElements: SKIP because already added: ' + me.$(label).attr('for'));
                return link;
            }

            // get corresponding form
            var forName = me.$(label).attr('for');
            var form = me.$(label).closest('form');

            // get for-element byName from form
            var forElement = form.find('[name=' + forName + ']').first();
            if (forElement.length > 0) {
                // define link to label
                var clickHandler = ymfAppBaseVarName +
                    '.YmfMarkdownEditorController.openWysiwygEditorForElement(\'' +
                    forElement.attr('id') + '\'); return false;';
                link = '<a href="#" id="openWysiwyg4' + forElement.attr('id') + '"' +
                    ' onClick="' + clickHandler + '" lang="tech"' +
                    ' data-tooltip="tooltip.command.OpenWysiwygEditor" class="button">common.command.OpenWysiwygEditor</a>';

                // set flag
                me.$(label).attr('wysiwygAdded', 'true');
                console.log('addWysiwygToElements: add : ' + forName + ' for ' + forElement.attr('id'));
            }
            return link;
        });
    };

    return me;
};
 
