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
 * base configuration of an JsHelferlein.AppBase
 *
 * @return {JsHelferlein.AppBaseConfig}         an instance of the config
 * @augments JsHelferlein.ConfigBase
 * @constructor
 */
JsHelferlein.AppBaseConfig = function () {
    'use strict';

    var me = JsHelferlein.ConfigBase();

    me.styleNS = 'jsh-';
    me.defaultDetectorStyleNS = me.styleNS;
    me.additionalDetectorStyleNS = [];
    me.appBaseVarName = 'jsHelferlein';

    return me;
};