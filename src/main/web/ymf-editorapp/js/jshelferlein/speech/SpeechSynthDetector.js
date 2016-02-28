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
 * check that SpeechSynth is supported
 * 
 * @param {JsHelferlein.AppBase} appBase                         appBase of the application
 * @param {JsHelferlein.SpeechSynthDetectorConfig} config        optional configuration (default JsHelferlein.SpeechSynthDetectorConfig)
 * @constructor
 */
JsHelferlein.SpeechSynthDetector = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.DetectorBase(appBase, config, JsHelferlein.SpeechSynthDetectorConfig());

    /**
     * detect if SpeechSynth is supported
     * @returns {boolean}       is supported true/false
     */
    me.isSpeechSynthSupported = function () {
        try {
            if ('speechSynthesis' in window) {
                return true;
            }
        } catch (ex) {
            var svcLogger = me.appBase.Logger;
            if (svcLogger && svcLogger.isError) {
                svcLogger.logError('JsHelferlein.SpeechSynthDetector.isSpeechSynthSupported Exception: ' + ex, false);
            }
        }
        return false;
    };

    /**
     * detect if SpeechSynth is supported
     * @returns {boolean}       is supported true/false
     */
    me.isSupported = function () {
        return me.isSpeechSynthSupported();
    };

    return me;
};