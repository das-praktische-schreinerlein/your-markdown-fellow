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
 * services for adding dialog-support to your app
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @return {JsHelferlein.UIDialogs}                      an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.UIDialogs = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepareWidgets();
    };

    /**
     * initialize the widget (error-box, confirm-box)
     */
    me.prepareWidgets = function() {
        me.createErrorBox();
        me.createConfirmBox();
    };

    /**
     * open modal dialog #jsh-error-message with message
     * @param {string} message     error-message to display
     */
    me.openErrorDialog = function (message) {
        // set messagetext
        me.$('#jsh-error-message-text').html(message);

        // show message
        me.$('#jsh-error-message').dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    me.$(this).dialog('close');
                }
            }
        });
    };

    /**
     * open modal confirmation-dialog #jsh-dialog-confirm with message
     * @param {string} message      message to display
     * @param {handler} yesHandler  handler to call if OK pressed
     * @param {handler} noHandler   handler to call if NO pressed
     */
    me.openConfirmDialog = function (message, yesHandler, noHandler) {
        // set messagetext
        me.$('#jsh-dialog-confirm-text').html(message);

        // show message

        me.$('#jsh-dialog-confirm').dialog({
            resizable: false,
            height: 140,
            modal: true,
            buttons: {
                'Ja': function () {
                    me.$(this).dialog('close');
                    if (yesHandler) {
                        yesHandler();
                    }
                },
                'Abbrechen': function () {
                    me.$(this).dialog('close');
                    if (noHandler) {
                        noHandler();
                    }
                }
            }
        });
    };

    /**
     * open toast-message with message
     * @param {string} type        message-type [error, info, warn]
     * @param {string} title       message-title
     * @param {string} message     message to display
     */
    me.showToastMessage = function (type, title, message) {
        // show message
        toastr.options = {
            'closeButton': true,
            'debug': false,
            'newestOnTop': true,
            'progressBar': true,
            'positionClass': 'toast-top-right',
            'preventDuplicates': false,
            'showDuration': '300',
            'hideDuration': '1000',
            'timeOut': '10000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
        toastr[type](me.appBase.DataUtils.htmlEscapeText(message), title);
    };

    /**
     * create or reset box #jsh-error-message
     */
    me.createErrorBox = function () {
        var $box = me.initBox('jsh-error-message', '');

        $box.append(me.$(
            '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span></p>' +
            '<p id="jsh-error-message-text"></p>'));

        return $box;
    };

    /**
     * create or reset box #jsh-dialog-confirm
     */
    me.createConfirmBox = function () {
        var $box = me.initBox('jsh-dialog-confirm', '');

        $box.append(me.$(
            '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span></p>' +
            '<p id="jsh-dialog-confirm-text"></p>'));

        return $box;
    };

    /**
     /**
     * create or reset a hidden box with id and content
     * @param {string} id          id of the box
     * @param {string} content     content of the box
     * @returns {JQuery}           JQuery-Html-Element
     */
    me.initBox = function (id, content) {
        var $box = me.$('#' + id);
        if ($box.size() <= 0) {
            me.$('body').append('<div id="' + id + '" class="hidden">');
            $box = me.$('#' + id);
        }
        $box.html(content);

        return $box;
    };

    me._init();

    return me;
};