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
 * service for adding Speech-links to your app-elements
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @return {JsHelferlein.SpeechServiceHelper}            an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.SpeechServiceHelper = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * add speechRecognition-link to labels of input-elements if availiable<br>
     * set the flg webkitSpeechRecognitionAdded on the element, so that there is no doubling
     * @param {Object} filter                 selector to filter label elements (used as jquery-filter)
     */
    me.addSpeechRecognitionToElements = function (filter) {
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;

        console.log('addSpeechRecognitionToElements: check for support');
        // add speechrecognition if availiable
        if (me.appBase.getDetector('SpeechRecognitionDetector').isSupported()) {
            console.log('addSpeechRecognitionToElements: supported start for  : ' + filter);
            // add speechrecognition to nodeDesc+name
            me.$(filter).append(function (idx) {
                var link = '';
                var label = this;

                // check if already set
                if (me.$(label).attr('webkitSpeechRecognitionAdded')) {
                    console.error('addSpeechRecognitionToElements: SKIP because already added: ' + me.$(label).attr('for'));
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
                        '.SpeechRecognitionController.open(\'' + forElement.attr('id') + '\'); return false;';
                    link = '<a href="" class=""' +
                        ' onClick="' + clickHandler + '"' +
                        ' lang="tech" data-tooltip="tooltip.command.OpenSpeechRecognition">' +
                        '<img alt="Spracherkennung nutzen" style="width:25px"' +
                        ' src="' + me.appBase.SpeechRecognitionController.config.statusImgSrcStart + '"></a>';

                    // set flag
                    me.$(label).attr('webkitSpeechRecognitionAdded', 'true');
                    console.log('addSpeechRecognitionToElements: add : ' + forName + ' for ' + forElement.attr('id'));
                }
                return link;
            });
        }
    };

    /**
     * add speechSynth-linl to element-label if availiable<br>
     * set the flg speechSynthAdded on the element, so that there is no doubling
     * @param {Object} filter                 selector to filter label elements (used as jquery-filter)
     */
    me.addSpeechSynthToElements = function (filter) {
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;
        console.log('addSpeechSynthToElements: check support');

        // add speechSynth if availiable
        if (me.appBase.getDetector('SpeechSynthDetector').isSupported()) {
            // add speechrecognition to nodeDesc+name
            console.log('addSpeechSynthToElements: supported start for  : ' + filter);
            me.$(filter).append(function (idx) {
                var link = '';
                var label = this;

                // check if already set
                if (me.$(label).attr('speechSynthAdded')) {
                    console.error('addSpeechSynthToElements: SKIP because already added: ' + me.$(label).attr('for'));
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
                        '.SpeechSynthController.open(\'' + forElement.attr('id') + '\'); return false;';
                    link = '<a href="" class="button"' +
                        ' onClick="' + clickHandler + '" lang="tech" ' +
                        ' data-tooltip="tooltip.command.OpenSpeechSynth" class="button">common.command.OpenSpeechSynth</a>';

                    // set flag
                    me.$(label).attr('speechSynthAdded', 'true');
                    console.log('addSpeechSynthToElements: add : ' + forName + ' for ' + forElement.attr('id'));
                }
                return link;
            });
        }
    };

    return me;
};