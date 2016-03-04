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
 * util functions for file-manipulation (download, load...)
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.FileUtils}               an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.FileUtils = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * load the file via jquery-ajax
     * @param {string} fileName      file to load
     * @return {jqXHR}               promise
     */
    me.loadFile = function (fileName) {
        var msg = 'loadFile fileName:' + fileName;

        console.log('START ' + msg);
        var req = me.$.ajax({
            url: fileName,
            type: 'GET',
            complete: function () {
                console.log('COMPLETE ' + msg);
            }
        });

        return req;
    };

    /**
     * download the content as file (create response and open in new window)
     * @param {jQuery} $link     jQuery-instance of the link to add the action
     * @param {string} data      data to download
     * @param {string} fileName  filename for save-dialog of the browser
     * @param {string} mime      mimetype of the file
     * @param {string} encoding  encoding to set
     * @param {string} target    link-target (window-name)
     */
    me.downloadAsFile = function ($link, data, fileName, mime, encoding, target) {
        if (me.appBase.DataUtils.isUndefined(mime)) {
            mime = 'application/text';
        }
        if (me.appBase.DataUtils.isUndefined(encoding)) {
            mime = 'uft-8';
        }
        if (me.appBase.DataUtils.isUndefined(target)) {
            target = '_blank';
        }
        // data URI
        var dataURI = 'data:' + mime + ';charset=' + encoding + ','
            + encodeURIComponent(data);

        // set link
        var flgSafeMode = 0;
        if ((navigator.userAgent.indexOf('Trident') >= 0)
            || (navigator.userAgent.indexOf('MSIE') >= 0)
            || flgSafeMode) {
            // IE or SafeMode
            var popup = window.open('');
            if (!popup) {
                // warn message
                me.appBase.Logger.logError('Leider kann der Download nicht angezeigt werden, da Ihr Popup-Blocker aktiv ist. Beachten Sie die Hinweise im Kopf des Browsers. ', true);
            } else {
                // set data to document
                me.$(popup.document.body).html('<pre>' + me.htmlEscapeTextLazy(data) + '</pre>');
            }
            return false;
        } else {
            // all expect IE
            $link.attr({
                'download': fileName,
                'href': dataURI,
                'target': target
            });
        }
    };

    return me;
};