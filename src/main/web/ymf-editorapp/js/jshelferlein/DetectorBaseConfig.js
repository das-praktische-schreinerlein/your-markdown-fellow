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
 * base configuration for all JsHelferlein.DetectorConfig
 *
 * @return {JsHelferlein.DetectorBaseConfig}      an instance of the config
 * @augments JsHelferlein.ConfigBase
 * @constructor
 */
JsHelferlein.DetectorBaseConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.styleBaseName = 'misconfigured-detector';

    return me;
};