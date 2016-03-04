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
 * base-instance with service functions for parser
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @param {JsHelferlein.ConfigBase} config        optional configuration
 * @param {JsHelferlein.ConfigBase} defaultConfig optional defaultconfig if no configuration is set
 * @return {JsHelferlein.AbstractParser}          an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.AbstractParser = function (appBase, config, defaultConfig) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, defaultConfig);

    /**
     * executes renderer on filtered blocks
     * @abstract
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
    };

    /**
     * add service-links to the block
     * @abstract
     * @param {string} block                 selector to identify the block via jquery
     */
    me._addServiceLinks = function (block) {
    };

    return me;
};
