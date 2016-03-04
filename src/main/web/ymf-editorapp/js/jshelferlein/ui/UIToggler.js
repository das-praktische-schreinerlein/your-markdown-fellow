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
 * services for adding toggler-support to your app
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @return {JsHelferlein.UIToggler}                      an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.UIToggler = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);
    me._nextId = 1;

    /**
     * toggle the specified ojects with a fade.
     * @param {Object} id     JQuery-Filter (html.id, style, objectlist...)
     */
    me.toggleTableBlock = function (id) {
        // get effect type from
        var selectedEffect = 'fade';

        // most effect types need no options passed by default
        var options = {};
        // some effects have required parameters
        if (selectedEffect === 'scale') {
            options = {percent: 0};
        } else if (selectedEffect === 'size') {
            options = {to: {width: 200, height: 60}};
        }

        // run the effect
        me.$(id).toggle(selectedEffect, options, 500);
    };

    /**
     * toggle pre-elements depending on class 'pre-nowrap', 'pre-wrap' and 'flg-pre-nowrap', 'flg-pre-wrap'
     * @param {Object} element    JQuery-Filter (html.id, style, objectlist...)
     */
    me.togglePreWrap = function (element) {
        var classNoWrap = 'pre-nowrap';
        var classWrap = 'pre-wrap';
        var flgClassNoWrap = 'flg-pre-nowrap';
        var flgClassWrap = 'flg-pre-wrap';
        var codeChilden = me.$(element).find('code');

        // remove/add class if element no has class
        if (me.$(element).hasClass(flgClassNoWrap)) {
            me.$(element).removeClass(flgClassNoWrap).addClass(flgClassWrap);
            console.log('togglePreWrap for id:' + element + ' set ' + classWrap);
            // wrap code-blocks too
            me.$(codeChilden).removeClass(classNoWrap).addClass(classWrap);
            me.$(codeChilden).parent().removeClass(classNoWrap).addClass(classWrap);
        } else {
            me.$(element).removeClass(flgClassWrap).addClass(flgClassNoWrap);
            console.log('togglePreWrap for id:' + element + ' set ' + classNoWrap);
            // wrap code-blocks too
            me.$(codeChilden).removeClass(classWrap).addClass(classNoWrap);
            me.$(codeChilden).parent().removeClass(classNoWrap).addClass(classWrap);
        }
    };

    /**
     * toggle the specified ojects with a drop
     * @param {Object} id     JQuery-Filter (html.id, style, objectlist...)
     */
    me.toggleElement = function (id) {
        // get effect type from
        var selectedEffect = 'drop';

        // most effect types need no options passed by default
        var options = {};
        // some effects have required parameters
        if (selectedEffect === 'scale') {
            options = {percent: 0};
        } else if (selectedEffect === 'size') {
            options = {to: {width: 200, height: 60}};
        }

        // run the effect
        me.$(id).toggle(selectedEffect, options, 500);
    };

    /**
     * append toggler to specified elements
     * @param {Object} filter                JQuery-Filter (html.id, style, objectlist...)
     * @param {string} type                  type of the toggler (text, icon, icon)
     * @param {boolean} flgInsertBefore      option true/false: insert before/after element
     */
    me.appendTogglerForElements = function (filter, type, flgInsertBefore) {
        me.$(filter).each(function (i, block) {
            if ($(block).attr('data-toggler-processed')) {
                console.log('appendTogglerForElement already done:' + filter + ' block:' + block);
                return;
            }
            $(block).attr('data-toggler-processed', true);
            var id = $(block).attr('id');
            if (!id) {
                id = 'jshTogglerId' + (me._nextId++);
                $(block).attr('id', id);
            }
            console.log('appendTogglerForElement:' + filter + ' block:' + block + ' id:' + id);
            me.insertToggler('#' + id, '#' + id, type, flgInsertBefore);
        });
    };

    /**
     * append toggler for containerId on parentId  
     * @param {Object} parentId              JQuery-Filter (html.id, style, objectlist...) to append the toggler
     * @param {string} containerId           id of the container to toggle
     * @param {string} type                  type of the toggler (text, icon, icon)
     */
    me.appendToggler = function (parentId, containerId, type) {
        var $ele = me.$(me._generateTogglerId(containerId));
        if ($ele.length <= 0) {
            // create toggler
            console.log('appendTogglerCommon link not exists: create new toggler parent=' + parentId
                + ' containerId=' + containerId);
            var html = me._createTogglerElement(containerId, type, 'jsh-block-toggler-inline');
            me.$(parentId).append(html);
            console.log('appendTogglerCommon link not exists: create new toggler parent=' + parentId
                + ' html=' + html);
        } else {
            console.log('appendTogglerCommon link exists: skip new toggler parent=' + parentId
                + ' containerId=' + containerId);
        }
    };

    /**
     * insert toggler for containerId before/after parentId  
     * @param {Object} parentId              JQuery-Filter (html.id, style, objectlist...) to append the toggler
     * @param {string} containerId           id of the container to toggle
     * @param {string} type                  type of the toggler (text, icon, icon)
     * @param {boolean} flgInsertBefore      option true/false: insert before/after element
     */
    me.insertToggler = function (parentId, containerId, type, flgInsertBefore) {
        var $ele = me.$(me._generateTogglerId(containerId));
        if ($ele.length <= 0) {
            // create toggler
            console.log('appendTogglerCommon link not exists: create new toggler parent=' + parentId
                + ' containerId=' + containerId);
            var html = me._createTogglerElement(containerId, type, 'jsh-block-toggler-block');
            if (flgInsertBefore) {
                me.$(html).insertBefore(parentId);
            } else {
                me.$(html).insertAfter(parentId);
            }
            console.log('appendTogglerCommon link not exists: create new toggler parent=' + parentId
                + ' html=' + html);
        } else {
            console.log('appendTogglerCommon link exists: skip new toggler parent=' + parentId
                + ' containerId=' + containerId);
        }
    };

    /**
     * generate toggler-id from containerId
     * @param {string} containerId           id of the container to toggle
     * @returns {string}                     id for toggler-element
     */
    me._generateTogglerId = function (containerId) {
        var containerClass = containerId.replace('.', '').replace('#', '');
        return '.block4Toggler' + containerClass;
    };

    /**
     * create toggler-element for containerId
     * @param {string} containerId           id of the container to toggle
     * @param {string} type                  type of the toggler (text, icon, icon)
     * @param {string} additionalClass       additional css-class for toggler-element
     * @returns {string}                     html for toggler-element
     */
    me._createTogglerElement = function (containerId, type, additionalClass) {
        var togglerId = me._generateTogglerId(containerId);
        var togglerClass = togglerId.replace('.', '').replace('#', '');

        var html;
        if (type === 'text') {
            html = me._createTogglerLinks(containerId, togglerId,
                '<span class="jsh-text-toggler jsh-text-toggler-on">[Bitte mehr Details... ]</span>',
                '<span class="jsh-text-toggler jsh-text-toggler-off">[OK reicht. Bitte weniger Details.]</span>', '', '');
        } else if (type === 'icon2') {
            html = me._createTogglerLinks(containerId, togglerId,
                '<span class="jsh-icon-toggler jsh-icon-toggler2-on">&nbsp;</span>',
                '<span class="jsh-icon-toggler jsh-icon-toggler2-off">&nbsp;</span>', '', '');
        } else if (type === 'icon' || 1) {
            html = me._createTogglerLinks(containerId, togglerId,
                '<span class="jsh-icon-toggler jsh-icon-toggler-on">&nbsp;</span>',
                '<span class="jsh-icon-toggler jsh-icon-toggler-off">&nbsp;</span>', '', '');
        }
        html = '<div class="jsh-block-toggler ' + additionalClass + ' ' + togglerClass + ' jsh-toggler-show"' +
            ' togglerbaseid="' + containerId + '" toggleid="' + togglerId + '">' + html + '</div>';
        return html;
    };

    /**
     * create toggler-links for container
     * @param {string} toggleContainer           id of the container to toggle
     * @param {string} toggler                   id of the toggler
     * @param {string} htmlOn                    html to for 'on'-link
     * @param {string} htmlOff                   html to for 'off'-link
     * @param {string} addStyleOn                additional css-class for 'on'-link
     * @param {string} addStyleOff               additional css-class for 'off'-link
     * @returns {string}                         html-snippet with links                      
     */
    me._createTogglerLinks = function (toggleContainer, toggler,
                                       htmlOn, htmlOff, addStyleOn, addStyleOff) {
        // parameter pruefen
        var appBaseVarName = me.appBase.config.appBaseVarName;
        if (!toggleContainer) {
            return null;
        }

        // html erzeugen
        var togglerBaseClass = toggler.replace('.', '');
        var clickHandler = appBaseVarName + '.UIToggler.toggle(' +
            '\'' + toggleContainer + '\', ' +
            '\'' + toggler + '\', false); return false;';
        var html = '<a href="#" onclick="' + clickHandler + '"' +
            ' class="jsh-toggler jsh-toggler-on ' + togglerBaseClass + '_On ' + addStyleOn + '"' +
            ' id="' + togglerBaseClass + '_On">' + htmlOn + '</a>';

        clickHandler = appBaseVarName + '.UIToggler.toggle(' +
            '\'' + toggleContainer + '\', ' +
            '\'' + toggler + '\', true); return false;';
        html += '<a href="#" onclick="' + clickHandler + '"' +
            ' class="jsh-toggler jsh-toggler-off ' + togglerBaseClass + '_Off ' + addStyleOff + '"' +
            ' id="' + togglerBaseClass + '_Off">' + htmlOff + '</a>';

        return html;
    };

    /**
     * Toggle the specific toggleContainer managed by toggler
     * @param {Object} toggleContainer        JQuery-Filter (html.id, style, objectlist...) for the specific toggleContainer to toggle
     * @param {Object} toggler                JQuery-Filter (html.id, style, objectlist...) for the specific toggle to toggle
     */
    me.toggle = function (toggleContainer, toggler) {
        if (me.$(toggler).hasClass('jsh-toggler-hidden')) {
            // show
            me.$(toggleContainer).slideDown(1000);
            me.$(toggler).addClass('jsh-toggler-show').removeClass('jsh-toggler-hidden');
        } else {
            // hide
            me.$(toggleContainer).slideUp(1000);
            me.$(toggler).addClass('jsh-toggler-hidden').removeClass('jsh-toggler-show');
        }
    };

    /**
     * Toggle all toggleContainer managed by the masterToggler
     * @param {Object} masterTogglerId        JQuery-Filter (html.id, style, objectlist...) for the masterToggler
     * @param {Object} toggleContainerId      JQuery-Filter (html.id, style, objectlist...) for the specific toggleContainer to toggle
     * @param {Object} togglerId              JQuery-Filter (html.id, style, objectlist...) for the specific toggle to toggle
     */
    me.toggleAllToggler = function (masterTogglerId, toggleContainerId, togglerId) {
        if (me.$(masterTogglerId).hasClass('jsh-toggler-hidden')) {
            // show all
            me.$(toggleContainerId).slideDown(1000);
            me.$(togglerId).addClass('jsh-toggler-show').removeClass('jsh-toggler-hidden');
            me.$(masterTogglerId).addClass('jsh-toggler-show').removeClass('jsh-toggler-hidden');
        } else {
            // hide all
            me.$(toggleContainerId).slideUp(1000);
            me.$(togglerId).addClass('jsh-toggler-hidden').removeClass('jsh-toggler-show');
            me.$(masterTogglerId).addClass('jsh-toggler-show').removeClass('jsh-toggler-hidden');
        }
    };

    return me;
};