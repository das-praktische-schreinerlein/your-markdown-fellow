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
 * servicefunctions for dom-handling
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @return {JsHelferlein.DOMHelper}            an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.DOMHelper = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * append an style-block behind parentId
     * @param {string} styles                css-styles to add
     * @param {string} parentId              id of the parent
     * @return {Boolean}                     done or not
     */
    me.appendStyle = function (styles, parentId) {
        // neues Stylelement erzeugen
        var newStyle = document.createElement('style');
        newStyle.setAttribute('type', 'text/css');
        var flgDone = false;
        var parent = document.getElementById(parentId);
        if (parent) {
            parent.appendChild(newStyle);
            // erst belegen, wenn im DM-Baum (wegen IE)
            if (newStyle.styleSheet) {
                // IE
                newStyle.styleSheet.cssText = styles;
            } else {
                // the world
                var textStyles = document.createTextNode(styles);
                newStyle.appendChild(textStyles);
            }
            flgDone = true;
        }
        return flgDone;
    };

    /**
     * append an html-block in new div behind parentId
     * @param {string} html                  html to add
     * @param {string} parentId              id of the parent
     * @param {string} className             className of the new div
     * @return {Boolean}                     done or not
     */
    me.appendHtml = function (html, parentId, className) {
        // neues Htmllement erzeugen
        var newDiv = document.createElement('div');
        var flgDone = false;
        if (parentId) {
            var parentElement = document.getElementById(parentId);
            if (parentElement) {
                parentElement.appendChild(newDiv);
                // ait for DOM-Baum (IE....)
                newDiv.innerHTML = html;
                if (className) {
                    newDiv.className = className;
                }
                flgDone = true;
            }
        }
        return flgDone;
    };

    /**
     * fuegt ein Style vor dem 1. JavaScript-Block ein
     * @param styles:                CSS-Styles
     * @return                       {Boolean} falls angefuegt
     */
    me.insertStyleBeforeScript = function (styles) {
        // neues Stylelement erzeugen
        var newStyle = document.createElement('style');
        newStyle.setAttribute('type', 'text/css');
        var flgDone = false;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag) {
            firstScriptTag.parentNode.insertBefore(newStyle, firstScriptTag);
            if (newStyle.styleSheet) {   // IE
                newStyle.styleSheet.cssText = styles;
            } else {                // the world
                var textStyles = document.createTextNode(styles);
                newStyle.appendChild(textStyles);
            }
            flgDone = true;
        }
        return flgDone;
    };

    /**
     * append an style-block on end of body
     * @param {string} styles                css-styles to add
     * @return {Boolean}                     done or not
     */
    me.appendStyleAtEnd = function (styles) {
        // neues Stylelement erzeugen
        var newStyle = document.createElement('style');
        newStyle.setAttribute('type', 'text/css');
        var flgDone = false;
        var bodyTag = document.getElementsByTagName('body')[0];
        if (bodyTag) {
            bodyTag.appendChild(newStyle);
            if (newStyle.styleSheet) {   // IE
                newStyle.styleSheet.cssText = styles;
            } else {                // the world
                var textStyles = document.createTextNode(styles);
                newStyle.appendChild(textStyles);
            }
            flgDone = true;
        }
        return flgDone;
    };

    /**
     * search for all elements with classNames and set the event as OnClick-event
     * @param {string} classNames           lit of classNames for filtering
     * @param {handler} event               handler to call onclick
     * @param {boolean} force               overwrite existing events
     */
    me.addLinkOnClickEvent = function (classNames, event, force) {
        var svcLogger = me.appBase.Logger;
        try {
            // alle Klassen iterieren
            for (var i = 0; i < classNames.length; i++) {
                var className = classNames[i];
                // Links suche und iterieren
                var links = document.getElementsByClassName(className);
                for (var j = 0; j < links.length; j++) {
                    // Elemente iterieren
                    var link = links[j];
                    if ((!link.onclick) || force) {
                        // entweder nicht definiert, oder Force
                        if (svcLogger && svcLogger.isDebug) {
                            svcLogger.logDebug('DOMHelper.addLinkOnClickEvent set a.onclick() for '
                                + className + ' Id:' + link.id + ' with event');
                        }
                        link.onclickold = link.onclick;
                        link.onclick = event;
                    } else {
                        // nicht definiert
                        if (svcLogger && svcLogger.isDebug) {
                            svcLogger.logDebug('DOMHelper.addLinkOnClickEvent cant set a.onclick() for '
                                + className + ' Id:' + link.id + ' with event already defined');
                        }
                    }
                }
            }
        } catch (ex) {
            if (svcLogger && svcLogger.isError) {
                svcLogger.logError('DOMHelper.addLinkOnClickEvent set a.onclick() Exception: ' + ex, false);
            }
        }
    };

    return me;
};