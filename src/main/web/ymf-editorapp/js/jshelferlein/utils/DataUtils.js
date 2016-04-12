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
 * util-functions for formatting data
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.DataUtils}               an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.DataUtils = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /*****************************************
     *****************************************
     * Service-Funktions (data)
     *****************************************
     *****************************************/

    /**
     * check if value undefined or null
     * @param {object} value     value to check
     * @return {boolean}         true/false if empty
     */
    me.isUndefined = function (value) {
        return (value === undefined || value === null);
    };

    /**
     * check if value undefined or null (checks for 'undefined', 'null' as strings too)
     * @param {object} value     value to check
     * @return {boolean}         true/false if empty
     */
    me.isUndefinedStringValue = function (value) {
        return (me.isUndefined(value) || value === 'undefined' || value === 'null' || value === 'NaN');
    };

    /**
     * check if value empty
     * @param {object} value     value to check
     * @return {boolean}         true/false if empty
     */
    me.isEmpty = function (value) {
        return (!value || value === undefined || value === null || value === 0);
    };

    /**
     * check if value empty (checks for 'undefined', 'null', '0', '0.0', '0,0' as strings too)
     * @param {object} value     value to check
     * @return {boolean}         true/false if empty
     */
    me.isEmptyStringValue = function (value) {
        return (me.isEmpty(value) || value === 'undefined' || value === '' || value === 'null' ||
            value === '0'|| value === '0.0' || value === '0,0');
    };


    /**
     * html-escape the entities (&,<,>,",',\) in text
     * @param {string} text     text to escape
     * @return {string}         escaped  text
     */
    me.htmlEscapeText = function (text) {
        if (!me.isUndefinedStringValue(text)) {
            text = text.replace(/&/g, '&amp;');
            text = text.replace(/</g, '&lt;');
            text = text.replace(/>/g, '&gt;');
            text = text.replace(/"/g, '&quot;');
            text = text.replace(/'/g, '&#x27;');
            text = text.replace(/\//g, '&#x2F;');
        }
        return text;
    };

    /**
     * lazy html-escape the entities (<,>) in text
     * @param {string} text     text to escape
     * @return {string}         escaped  text
     */
    me.htmlEscapeTextLazy = function (text) {
        if (!me.isUndefinedStringValue(text)) {
            text = text.replace(/</g, '&lt;');
            text = text.replace(/>/g, '&gt;');
        }
        return text;
    };

    /**
     * format the milliseconds as german datetime
     * @param {int} millis     millis to format
     * @return {string}        date in DD.MM.JJJJ HH24:mm
     */
    me.formatGermanDateTime = function (millis) {
        if (me.isUndefinedStringValue(millis)) {
            return '';
        }
        var date = new Date(millis);
        return me.padNumber(date.getDate(), 2)
            + '.' + me.padNumber(date.getMonth() + 1, 2)
            + '.' + date.getFullYear()
            + ' ' + me.padNumber(date.getHours(), 2)
            + ':' + me.padNumber(date.getMinutes(), 2);
    };

    /**
     * format the milliseconds as german date
     * @param {int} millis     millis to format
     * @return {string}        date in DD.MM.JJJJ
     */
    me.formatGermanDate = function (millis) {
        if (me.isUndefinedStringValue(millis)) {
            return '';
        }
        var date = new Date(millis);
        return me.padNumber(date.getDate(), 2)
            + '.' + me.padNumber(date.getMonth() + 1, 2)
            + '.' + date.getFullYear();
    };

    /**
     * pad the number with leading 0
     * @param {int} number     number to pad
     * @param {int} count      length of the number-string
     * @return {string}        padded number 13,6 -> 000013
     */
    me.padNumber = function (number, count) {
        var r = String(number);
        while (r.length < count) {
            r = '0' + r;
        }
        return r;
    };

    /**
     * format the number with ','
     * @param {int} number     number to format
     * @param {int} nachkomma  
     * @param {string} suffix  suffix behind number
     * @return {string}        padded number 13,6 -> 13,60000
     */
    me.formatNumbers = function (number, nachkomma, suffix) {
        if (me.isUndefinedStringValue(number)) {
            return '';
        }

        return (number.toFixed(nachkomma)) + suffix;
    };

    /**
     * escape the regex-string
     * @param {string} str     regex-string to escape
     * @return {string}        escaped regex
     */
    me.escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    };

    /**
     * get parameter from current url
     * @param {string} name    name of the parameter
     * @return {string}        value of the parameter
     */
    me.getURLParameter = function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
    };

    /**
     * get baseref from url
     * @param {string} url    url to get from
     * @return {string}       baseref of the url
     */
    me.getBaseRefFromUrl = function (url) {
        var withoutAncor = url.split('#')[0];
        var withoutParams = withoutAncor.split('?')[0];
        var withoutFile = withoutParams.split('/');
        withoutFile.splice(-1, 1);
        return withoutFile.join('/');
    };

    /**
     * a hack to call updatetrigger for the element because for speechregognition the popup
     * @param {Object} element            jquery-selector to fire the trigger
     */
    me.callUpdateTriggerForElement = function(element) {
        if (!me.appBase.DataUtils.isUndefined(element)) {
            console.log('callUpdateTriggerForElement:' + element +
                ' count:' + me.$(element).length +
                ' id:' + me.$(element).attr('id'));
            me.$(element).trigger('input').triggerHandler('change');
            me.$(element).trigger('select').triggerHandler('change');
            me.$(element).trigger('input');
            me.$(element).focus();

            // update ace-editor
            var parentEditor = me.$(element).data('aceEditor');
            if (!parentEditor) {
                var id = me.$(element).attr('id');
                if (id) {
                    id = '#editor' + id.charAt(0).toUpperCase() + id.slice(1);
                    parentEditor = me.$(id).data('aceEditor');
                }
            }
            if (parentEditor) {
                console.log('callUpdateTriggerForElement aceeditor:' + parentEditor);
                parentEditor.setValue(me.$(element).val());
            }
        }
    };

    return me;
};