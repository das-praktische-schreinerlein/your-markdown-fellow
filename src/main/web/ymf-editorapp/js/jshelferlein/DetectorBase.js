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
 * base detector for all JsHelferlein
 * 
 * @param {JsHelferlein.AppBase} appBase                  appBase of the application
 * @param {JsHelferlein.DetectorBaseConfig} config        optional configuration
 * @param {JsHelferlein.DetectorBaseConfig} defaultConfig optional defaultconfig if no configuration is set
 * @constructor
 */
JsHelferlein.DetectorBase = function (appBase, config, defaultConfig) {
    'use strict';

    // my own instance
    var me = {};

    /**
     * initialize the detector-base
     */
    me._init = function () {
        // check Config
        me.appBase = appBase;
        me.config = appBase.checkConfig(config, defaultConfig);
    };

    /**
     * check if function is supported
     * @abstract
     * @return {boolean}           true/false if function is supported
     */
    me.isSupported = function () {
        return false;
    };

    /**
     * publish detector-css-styles if function is supported to DOM
     */
    me.publishDetectorStyles = function () {
        var svcDOMHelper = me.appBase.DOMHelper;
        var svcLogger = me.appBase.Logger;

        var styles = me.generateStyles();
        svcDOMHelper.insertStyleBeforeScript(styles);
        svcDOMHelper.appendStyleAtEnd(styles);
        if (svcLogger && svcLogger.isDebug) {
            svcLogger.logDebug('JsHelferlein.DetectorBase.publishDetectorStyles ' + styles);
        }
    };

    /**
     * generate detector-css-styles
     * @return {string}            generated css-styles                  
     */
    me.generateStyles = function () {
        var flgSet = me.isSupported();
        // generate default NS
        var styles = me._generateStylesForNS(me.appBase.config.defaultDetectorStyleNS, me.config.styleBaseName, flgSet);

        // generate additional NS
        if (me.appBase.config.isSet('additionalDetectorStyleNS')) {
            var additionalNS = me.appBase.config.additionalDetectorStyleNS;
            for (var index = 0; index < additionalNS.length; ++index) {
                styles += me._generateStylesForNS(additionalNS[index], me.config.styleBaseName, flgSet);
            }
        }

        return styles;
    };

    /**
     * generate detector-styles for this namespace
     * @param {string} ns               namespace of the detector-styles
     * @param {string} name             name of the detector-style
     * @param {boolean} flgSet          function is supported ?
     * @return {string}                 generated css-style                  
     */
    me._generateStylesForNS = function (ns, name, flgSet) {
        var styles = '';

        styles += '/** ' + ns + ' ' + name + '**/\n';
        if (flgSet) {
            styles += '.' + ns + 'is-' + name + ' { display: block;}\n';
        } else {
            styles += '.' + ns + 'is-not-' + name + ' { display: block;}\n';
        }
        styles += '.' + ns + 'show-if-' + name + ' { display: ' + (flgSet ? 'block' : 'none') + ';}\n';
        styles += '.' + ns + 'show-inline-if-' + name + ' { display: ' + (flgSet ? 'inline' : 'none') + ';}\n';
        styles += '.' + ns + 'show-inline-block-if-' + name + ' { display: ' + (flgSet ? 'inline-block' : 'none') + ';}\n';
        styles += '.' + ns + 'hide-if-' + name + ' { ' + (flgSet ? 'display: none;' : '') + '}\n';

        return styles;
    };

    me._init();

    return me;
};