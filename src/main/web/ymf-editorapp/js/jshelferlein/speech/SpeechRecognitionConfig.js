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
 * default configuration of the JsHelferlein.SpeechRecognitionController
 * 
 * @constructor
 */
JsHelferlein.SpeechRecognitionConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.defaultLang = 'de-DE';

    me.finalTextareaSelector = '#jsh-sr-textarea-final';
    me.interimSpanSelector = '#jsh-sr-span-interim';
    me.infoDivSelector = '#jsh-sr-info-div';
    me.statusImgSelector = '#jsh-sr-status-img';

    me.statusImgSrcStart = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
    me.statusImgSrcRunning = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif';
    me.statusImgSrcStop = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-slash.gif';

    me.buttonStartSelector = '#jsh-sr-button-start';
    me.buttonStopSelector = '#jsh-sr-button-stop';

    return me;
};