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
 * base configuration for all JsHelferlein
 *
 * @return {JsHelferlein.ConfigBase}                an instance of the config
 * @constructor
 */
JsHelferlein.ConfigBase = function () {
    'use strict';

    // my own instance
    var me = {};

    /**
     * check if option exists and is set
     * @param {string} option      name of the option
     * @return {boolean}           true/false if option exists and is set
     */
    me.isSet = function (option) {
        if (!me.hasOwnProperty(option)) {
            return false;
        }
        if (!me[option]) {
            return false;
        }

        return true;
    };

    return me;
};