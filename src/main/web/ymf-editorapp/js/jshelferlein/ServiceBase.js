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
 * base service for all JsHelferlein.Services
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration
 * @param {JsHelferlein.ConfigBase} defaultConfig   optional defaultconfig if no configuration is set
 * @constructor
 */
JsHelferlein.ServiceBase = function (appBase, config, defaultConfig) {
    'use strict';

    // my own instance
    var me = {};

    me.logNotImplemented = function () {
        var svcLogger = me.appBase.Logger;
        if (svcLogger) {
            svcLogger.logError('not implemented', false);
        }
        throw 'function is not implemented';
    };

    /**
     * generate a css-stylename with configured namespace 
     */
    me.generateStyleName = function (styleName) {
        var prefix = '';
        if (me.config && me.config.styleNS) {
            prefix = me.appBase.config.styleNS;
        }
        if (me.appBase.config && me.appBase.config.styleNS) {
            prefix = me.appBase.config.styleNS;
        }
        return prefix + styleName;
    };

    /**
     * initialize the service-base
     */
    me._init = function () {
        // check Config
        me.appBase = appBase;
        me.config = appBase.checkConfig(config, defaultConfig);
        me.jQuery = appBase.jQuery;
        me.$ = me.jQuery;
    };

    me._init();

    return me;
};