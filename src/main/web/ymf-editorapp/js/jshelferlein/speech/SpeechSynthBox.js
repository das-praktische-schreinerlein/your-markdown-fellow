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
 * Widget of the SpeechRecognition-Box
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @param {JsHelferlein.ConfigBase} config        optional configuration (default is set in module)
 * @constructor
 */
JsHelferlein.SpeechSynthBox = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'jsh-speechsynth-box';
    defaultConfig.content = '<div class="jsh-box jsh-hide-if-speechsynth">' +
    '    <div id="jsh-ss-info">Leider unterstützt Ihr Browser keine Sprach-Generierung :-(' +
    '    </div>' +
    '</div>' +
    '<div class="jsh-box jsh-show-if-speechsynth">' +
    '    <textarea id="jsh-ss-textarea-final" class="jsh-textarea jsh-ss-textarea-final" rows="20" cols="30"></textarea>' +
    '</div>' +
    '<div class="jsh-box jsh-show-if-speechsynth">' +
    '    <label for="jsh-ss-voice">Voice:</label>' +
    '    <select id="jsh-ss-voice"> </select>' +
    '    <label class="hidden" for="jsh-ss-rate">Rate (0.1 - 10):</label>' +
    '    <input class="hidden" id="jsh-ss-rate" type="number" min="0.1" max="10" value="1" step="0.1"/>' +
    '    <label class="hidden" for="jsh-ss-pitch">Pitch (0.1 - 2):</label>' +
    '    <input class="hidden" id="jsh-ss-pitch" type="number" min="0.1" max="2" value="1" step="0.1"/>' +
    '    <br/>' +
    '    <button id="jsh-ss-button-start" class="jsh-button" >Start</button>' +
    '    <button id="jsh-ss-button-pause" class="jsh-button" >Pause</button>' +
    '    <button id="jsh-ss-button-resume" class="jsh-button" >Fortfahren</button>' +
    '    <button id="jsh-ss-button-stop" class="jsh-button" >Schliessen</button>' +
    '</div>';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
    };

    /**
     * set content of the speechsynth-box
     * @param {string} content    content to show in box
     */
    me.setContent = function (content) {
        me.$('#jsh-ss-textarea-final').html(content);
    };

    /**
     * opens speechsynth-box as jquery-dialog
     */
    me.open = function () {
        me._showUI();
    };

    /**
     * create speechsynth-box as jquery-dialog
     */
    me._createUI = function () {
        me.$box.dialog({
            modal: true,
            width: 600,
            height: 500,
            title: 'JSH-SpeechSynthesis',
            buttons: {
                Ok: function () {
                    me.appBase.SpeechSynthController._stopSpeech();
                    me.close();
                }
            }
        });
    };

    me._init();

    return me;
};

