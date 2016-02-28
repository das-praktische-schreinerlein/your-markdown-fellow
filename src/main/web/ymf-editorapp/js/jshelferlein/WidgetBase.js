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
 * base widget for all JsHelferlein.Widgets
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration
 * @param {JsHelferlein.ConfigBase} defaultConfig   optional defaultconfig if no configuration is set
 * @constructor
 */
JsHelferlein.WidgetBase = function (appBase, config, defaultConfig) {
    'use strict';

    // my own instance
    var me = {};

    me._init = function () {
        // check Config
        me.appBase = appBase;
        me.$ = me.appBase.$;
        me.$instance = undefined;
        me.config = appBase.checkConfig(config, defaultConfig);
    };

    /**
     * prepare the box (create or reset html-element)
     */
    me.prepare = function() {
    };

    /**
     * show html-element
     */
    me.open = function() {
    };

    /**
     * hide the element (hide content)
     */
    me.close = function() {
    };

    /**
     * destroy the widget
     */
    me.destroy = function() {
    };

    /**
     * create or reset html-element
     */
    me._createUI = function() {
    };

    /**
     * destroy html-element
     */
    me._removeUI = function() {
    };

    /**
     * show html-element
     */
    me._showUI = function() {
    };

    /**
     * hide html-element
     */
    me._hideUI = function() {
    };

    /**
     * get the html-element
     * @abstract
     * @return {jQuery}       element
     */
    me._getUIInstance = function() {};

    me._checkUI = function () {
        me.$instance = me._getUIInstance();
        return !me.appBase.DataUtils.isUndefined(me.$instance);
    };

    me._init();

    return me;
};