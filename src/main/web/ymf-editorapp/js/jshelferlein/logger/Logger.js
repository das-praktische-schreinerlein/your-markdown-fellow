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
 * a logger
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @param {JsHelferlein.LoggerConfig} config   optional configuration
 * @constructor
 */
JsHelferlein.Logger = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, JsHelferlein.LoggerConfig());

    /**
     * initialize the logger
     */
    me._init = function () {
        // my props
        me.console = {};

        // bietet Browser console an ??
        if (window.console) {
            me.console = window.console;

            // IE has a console that has a 'log' function but no 'debug'. to make console.debug work in IE,
            // we just map the function. (extend for info etc if needed)
            if (!window.console.debug && typeof window.console.log !== 'undefined') {
                window.console.debug = window.console.log;
            }
        }

        // ... and create all functions we expect the console to have (took from firebug).
        var names = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml',
            'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];

        for (var i = 0; i < names.length; ++i) {
            if (!me.console[names[i]]) {
                me.console[names[i]] = function () {
                };
            }
        }

        // eigene Console oeffnen
        me.ownConsoleElement = null;
        if (me.config.flgOwnConsole) {
            me.ownConsoleElement = me._initOwnConsole();
        }

        // WebLogger-Url
        me.webLoggerUrl = me.config.webLoggerUrl;

        /*
         * Root-Logger initialisieren
         */
        me.isError = true;
        me.isErrorWebLogger = false;
        me.isWarning = true;
        me.isWarningWebLogger = false;
        me.isInfo = false;
        me.isInfoWebLogger = false;
        me.isDebug = false;
        me.isDebugWebLogger = false;
        me.LoggerRoot = false;
    };

    /**
     * log errors
     * - if ownConsoleElement active - do logOwnConsole too
     * - if webLoggerUrl and isErrorWebLoogger active - Logging do logWebLogger too
     * @param {string} text           message to log
     * @param {boolean}flgShowDialog  open error dialog
     */
    me.logError = function (text, flgShowDialog) {
        me.console.error(' ERROR:' + text);
        if (flgShowDialog) {
            me.appBase.UIDialogs.showToastMessage('error', 'Oops! Ein Fehlerchen :-(', me.appBase.DataUtils.htmlEscapeText(text));
            //        me.openErrorDialog(me.appBase.DataUtils.htmlEscapeText(message));
        }
        if (me.ownConsoleElement) {
            me._logOwnConsole(text);
        }
        if (me.webLoggerUrl && me.isErrorWebLogger) {
            me._logWebLogger('ERROR', text);
        }
    };

    /**
     * log warnings
     * - if ownConsoleElement active - do logOwnConsole too
     * - if webLoggerUrl and isErrorWebLoogger active - Logging do logWebLogger too
     * @param {string} text           message to log
     */
    me.logWarning = function (text) {
        me.console.warn(' WARNING:' + text);
        if (me.ownConsoleElement) {
            me._logOwnConsole(text);
        }
        if (me.webLoggerUrl && me.isWarningWebLogger) {
            me._logWebLogger('WARNING', text);
        }
    };

    /**
     * log infos
     * - if ownConsoleElement active - do logOwnConsole too
     * - if webLoggerUrl and isErrorWebLoogger active - Logging do logWebLogger too
     * @param {string} text           message to log
     */
    me.logInfo = function (text) {
        me.console.info(' INFO:' + text);
        if (me.ownConsoleElement) {
            me._logOwnConsole(text);
        }
        if (me.webLoggerUrl && me.isInfoWebLogger) {
            me._logWebLogger('INFO', text);
        }
    };

    /**
     * log debug-messages
     * - if ownConsoleElement active - do logOwnConsole too
     * - if webLoggerUrl and isErrorWebLoogger active - Logging do logWebLogger too
     * @param {string} text           message to log
     */
    me.logDebug = function (text) {
        me.console.debug(' DEBUG:' + text);
        if (me.ownConsoleElement) {
            me._logOwnConsole(text);
        }
        if (me.webLoggerUrl && me.isDebugWebLogger) {
            me._logWebLogger('DEBUG', text);
        }
    };


    /**
     * init own logConsole
     * @returns {HtmlElement}
     */
    me._initOwnConsole = function () {
        var consoleWindowElement = null;
        try {
            // open on console-window
            var consoleWindow = window.open('', 'LoggerOwnConsole', 'height=400,width=650,resizable=yes,scrollbars=yes');

            // exists already: use this Textarea
            consoleWindowElement = consoleWindow.document.getElementById('LoggerOwnConsoleDiv');

            // not exists: create new Textarea
            if (!consoleWindowElement) {
                consoleWindow.document.write('<textarea id="LoggerOwnConsoleDiv" cols="80" rows="40"></textarea>');
                consoleWindowElement = consoleWindow.document.getElementById('LoggerOwnConsoleDiv');
            }
        } catch (e) {
            me.logError('JMSLOGGER.initOwnConsole cant open Console window:' + e, false);
        }
        return consoleWindowElement;
    };

    /**
     * if ownConsoleElement active: log to ownConsoleElement
     * @param {string} text     message to log to ownConsoleElement
     */
    me._logOwnConsole = function (text) {
        if (me.ownConsoleElement) {
            try {
                me.ownConsoleElement.value = me.ownConsoleElement.value + '\n' + text;
            } catch (e) {
            }
        }
    };

    /**
     * if webLoggerUrl active:, insert iframe with Id:weblogger who embeds webLoggerUrl
     * @param {string}  logLevel      loglevel to log to webLoggerUrl
     * @param {string}  text          message to log to ownConsoleElement
     */
    me._logWebLogger = function (logLevel, text) {
        if (me.webLoggerUrl) {
            try {
                // Logurl erzegen
                var url = me.webLoggerUrl + 'LOGLEVEL=' + logLevel + '&LOGMSG=' + text + '&LOGURL=' + window.location;

                // neues Logelement erzeugen
                var logElement = document.createElement('script');
                logElement.src = url;
                var parent = document.getElementsByTagName('script')[0];
                parent.parentNode.insertBefore(logElement, parent);

            } catch (e) {
                //alert('Exception:' + e)
            }
        }
    };

    // init all
    me._init();

    return me;
};