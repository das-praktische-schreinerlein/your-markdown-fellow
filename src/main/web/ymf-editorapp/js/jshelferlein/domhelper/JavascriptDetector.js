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
 * base-instance of javascript detectors
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @param {JsHelferlein.ConfigBase} config     optional configuration (default JsHelferlein.JavascriptDetectorConfig)
 * @constructor
 */
JsHelferlein.JavascriptDetector = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.DetectorBase(appBase, config, JsHelferlein.JavascriptDetectorConfig());

    /**
     * is that feature supported ?
     * @abstract
     * @returns {boolean}         true/false if that feature is supported
     */
    me.isSupported = function () {
        return true;
    };

    return me;
};