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
 * base-instance with service functions for box-widget
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @param {JsHelferlein.ConfigBase} config        optional configuration
 * @param {JsHelferlein.ConfigBase} defaultConfig optional defaultconfig if no configuration is set
 * @return {JsHelferlein.WidgetBox}               an instance of the widget
 * @augments JsHelferlein.WidgetBase
 * @constructor
 */
JsHelferlein.WidgetBox = function (appBase, config, defaultConfig) {
    'use strict';

    var me = JsHelferlein.WidgetBase(appBase, config, defaultConfig);

    me.$box = undefined;

    /**
     * prepare the content-element (create or reset html-element)
     */
    me.prepare = function() {
        me._createContentElement();
    };

    /**
     * show widget
     * @abstract
     */
    me.open = function() {};

    /**
     * hide the widget (hide content)
     * @abstract
     */
    me.close = function() {
        me._hideUI();
    };

    /**
     * destroy the widget
     */
    me.destroy = function() {
        me._hideUI();
        me._removeUI();
        me._removeContentElement();
    };

    /**
     * resize the box depending on window
     * @abstract
     * @param {int} globBorder     border
     */
    me.resizeOnWindow = function(globBorder) {
    };

    /**
     * create or reset content-element (html-element)
     */
    me._createContentElement = function() {
        if (!me.appBase.DataUtils.isUndefined(me.$box)) {
            me._removeContentElement();
        }
        me.$box = me.initBox(me.config.contentId, me.config.content);
    };

    /**
     * destroy content-element (html-element)
     */
    me._removeContentElement = function() {
        if (!me.appBase.DataUtils.isUndefined(me.$box)) {
            me.$box.empty();
        }
        me.$box = undefined;
    };

    /**
     * get the dialog-element of the widget
     * @abstract
     * @return {jQuery}       element
     */
    me._getUIInstance = function() {
        me.$instance = me.$box.data('ui-dialog');
        return me.$instance;
    };
    
    /**
     * create or reset dialog-element of the widget
     * @abstract
     */
    me._createUI = function() {
    };

    /**
     * destroy dialog-element of the widget
     */
    me._removeUI = function() {
        me._getUIInstance();
        if (me._checkUI()) {
            me.$instance.destroy();
        }
        me.$instance = undefined;
    };

    /**
     * show dialog-element of the widget
     */
    me._showUI = function() {
        me._getUIInstance();
        if (!me._checkUI()) {
            me._createUI();
            me._getUIInstance();
        }
        me.$instance.open();
    };

    /**
     * hide dialog-element of the widget
     */
    me._hideUI = function() {
        me._getUIInstance();
        if (me._checkUI()) {
            me.$instance.close();
        }
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

    /**
     * reset or create a box with id and title and open it as jquer-dialog
     * @param {string} id       id of the box
     * @param {string} title    title of the box
     */
    me.initDialogBox = function (id, title) {
        var $box = me.initBox(id, '');
        $box.dialog({
            modal: true,
            width: '300px',
            title: title,
            buttons: {
                'Schliessen': function () {
                    me.$(this).dialog('close');
                }
            }
        });

        return $box;
    };


    return me;
};