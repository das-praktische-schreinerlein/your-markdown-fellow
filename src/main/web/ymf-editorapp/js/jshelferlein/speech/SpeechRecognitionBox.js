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
JsHelferlein.SpeechRecognitionBox = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'jsh-speechrecognition-box';
    defaultConfig.content = '<div class="jsh-box jsh-hide-if-speechrecognition">' +
        '    <div id="info">Leider unterstützt Ihr Browser keine SpracheGenerierung :-(</div>' +
        '</div>' +
        '<div class="jsh-box jsh-show-if-speechrecognition">' +
        '    <div id="jsh-sr-info-div">' +
        '        <p id="jsh-sr-info-start">Klicke auf das Microfon und spreche deinen Text.</p>' +
        '        <p id="jsh-sr-info-speak-now" style="display: none">Und los: Sprich !!!</p>' +
        '        <p id="jsh-sr-info-no-speech" style="display: none">' +
        '            Mmhh. Nichts erkannt. <a href="https://www.google.com/support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">Mikrofon-Einstellungen</a>?' +
        '        </p>' +
        '        <p id="jsh-sr-info-no-microphone" style="display: none">' +
        '            Mmhh. Kein Mikrofon gefunden. Sind die <a href="https://www.google.com/support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">Einstellungen</a> korrekt?' +
        '        </p>' +
        '        <p id="jsh-sr-info-allow" style="display: none">Klicke auf den "Erlauben"-Button im Seitenkopf.</p>' +
        '        <p id="jsh-sr-info-denied" style="display: none">Wenn du die Erlaubnis nicht gibst, funktioniert das ganze nicht.</p>' +
        '        <p id="jsh-sr-info-blocked" style="display: none">Zugriff auf das Mikrofon in gesperrt. Ändere dies in chrome://settings/contentExceptions#media-stream</p>' +
        '        <p id="jsh-sr-info-upgrade" style="display: none">' +
        '            Oopps. Die Web Speech API wird von diesem Browser nicht unterstützt. Upgrade to <a href="//www.google.com/chrome">Chrome 25</a> oder höher.' +
        '        </p>' +
        '    </div>' +
        '    <div id="jsh-sr-div-start">' +
        '        <button id="jsh-sr-button-start">' +
        '            <img alt="Start" id="jsh-sr-status-img" src="https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif">' +
        '        </button>' +
        '    </div>' +
        '    <div id="jsh-sr-results">' +
        '        <span class="jsh-sr-interim" id="jsh-sr-span-interim"></span>' +
        '        <textarea class="jsh-sr-final" id="jsh-sr-textarea-final" cols="30" rows="15"></textarea>' +
        '    </div>' +
        '    <input type="button" class="jsh-button" id="jsh-sr-button-stop" value="&Uuml;bernehmen">' +
        '</div>';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
    };

    /**
     * set content of the speechrecognition-box
     * @param {string} content    content to show in box
     */
    me.setContent = function (content) {
        me.$('#jsh-sr-textarea-final').html(content);
    };

    /**
     * opens speechrecognition-box as jquery-dialog
     */
    me.open = function () {
        me._showUI();
    };

    /**
     * create speechrecognition-box as jquery-dialog
     */
    me._createUI = function () {
        me.$box.dialog({
            modal: true,
            width: 600,
            height: 500,
            title: 'JSH-SpeechRecognition',
            buttons: {
                Ok: function () {
                    me.appBase.SpeechRecognitionController._stopRecognition();
                    me.close();
                }
            }
        });
    };

    me._init();

    return me;
};

