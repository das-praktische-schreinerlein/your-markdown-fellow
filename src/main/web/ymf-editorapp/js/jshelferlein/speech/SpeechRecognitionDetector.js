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
 * check that SpeechRecognition is supported
 * 
 * @param {JsHelferlein.AppBase} appBase                               appBase of the application
 * @param {JsHelferlein.SpeechRecognitionDetectorConfig} config        optional configuration (default JsHelferlein.SpeechRecognitionDetectorConfig)
 * @return {JsHelferlein.SpeechRecognitionDetector}                    an instance of the service
 * @augments JsHelferlein.DetectorBase
 * @constructor
 */
JsHelferlein.SpeechRecognitionDetector = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.DetectorBase(appBase, config, JsHelferlein.SpeechRecognitionDetectorConfig());

    /**
     * detect if SpeechRecognition is supported
     * @returns {boolean}       is supported true/false
     */
    me.isSpeechRecognitionSupported = function () {
        try {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                return true;
            }
        } catch (ex) {
            if (me.appBase.Logger && me.appBase.Logger.isError) {
                me.appBase.Logger.logError('JsHelferlein.SpeechRecognitionDetector.isSpeechRecognitionSupported Exception: ' + ex, false);
            }
        }
        return false;
    };

    /**
     * detect if SpeechRecognition is supported
     * @returns {boolean}       is supported true/false
     */
    me.isSupported = function () {
        return me.isSpeechRecognitionSupported();
    };

    return me;
};