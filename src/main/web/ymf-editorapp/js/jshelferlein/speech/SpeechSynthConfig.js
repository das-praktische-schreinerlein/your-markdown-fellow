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
 * default configuration of the JsHelferlein.SpeechSynthController
 * 
 * @constructor
 */
JsHelferlein.SpeechSynthConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.splitChars = '\n?!:;,.';
    me.splitWords = [' und ', ' oder ', ' aber ', ' dabei ', ' bis ', ' '];

    me.defaultLang = 'de-DE';
    me.selectVoiceSelector = '#jsh-ss-voice';
    me.inputRateSelector = '#jsh-ss-rate';
    me.inputPitchSelector = '#jsh-ss-pitch';

    me.textareaFinalSelector = '#jsh-ss-textarea-final';

    me.buttonStartSelector = '#jsh-ss-button-start';
    me.buttonPauseSelector = '#jsh-ss-button-pause';
    me.buttonResumeSelector = '#jsh-ss-button-resume';
    me.buttonStopSelector = '#jsh-ss-button-stop';

    return me;
};