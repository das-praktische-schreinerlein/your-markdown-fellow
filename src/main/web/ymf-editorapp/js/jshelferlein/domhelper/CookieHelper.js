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
 * servicefunctions for cookie-handling
 * 
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @constructor
 */
JsHelferlein.CookieHelper = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * write cookie
     * @param {string} name     name of the cookie
     * @param {string} value    value to set
     * @param {int} days        expires in x days
     * @param {string} path     path (if not set /)
     */
    me.writeCookie = function (name, value, days, path) {
        // wie lange gueltig??
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString() ();
        } else {
            expires = '';
        }
        // Coockie setzen
        document.cookie = name + '=' + value + expires + '; path=/';
    };

    /**
     * read cookie
     * @param {string} name     name of the cookie to read
     * @return {string|null}    resulting value
     */
    me.readCookie = function (name) {
        // Vollen Namen mit = suchen
        var nameFull = name + '=';
        var cookie = document.cookie;
        var ca = cookie.split(';');
        if (ca.length === 0) {
            ca = [cookie];
        }
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            // replace spaces
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }

            // extract value
            if (c.indexOf(nameFull) === 0) {
                return c.substring(nameFull.length, c.length);
            }
        }
        return null;
    };

    return me;
};