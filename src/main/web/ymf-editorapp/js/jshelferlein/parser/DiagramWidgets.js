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
 * servicefunctions to decorate diagrams
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @constructor
 */
JsHelferlein.DiagramWidgets = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * create and add service-links to diagram-block
     * @param {string} block                 filter to identify the block to add links (used as jquery-selector)
     * @param {string} type                  diagram-type (mermaid, plantuml...)
     * @param {string} downloadLink          html with downloadLink
     */
    me.addServiceLinksToDiagramBlock = function (block, type, downloadLink) {
        var $blockElement = me.$(block);
        var content = $blockElement.html();
        var blockId = $blockElement.attr('id');
        var ymfAppBaseVarName = me.appBase.config.appBaseVarName;

        // add source
        $blockElement.before(
            '<div class="' + type + '-source" id="fallback' + blockId + '">' +
            '<pre>' + content + '</pre>' +
            '</div>');
        // add service-links
        var toggleHandler = ymfAppBaseVarName +
            '.DiagramWidgets.toggleLinks(' +
            '\'#toggleorig' + blockId + '\', \'#togglesource' + blockId + '\', \'#' + blockId + '\', \'#fallback' + blockId + '\'); ' +
            'return false;';
        me.$('#fallback' + blockId).before(
            '<div class="services' + type + '" id="services' + blockId + '">' +
            '<div>' +
            downloadLink +
            '<a href="#" style="display: none;" id="toggleorig' + blockId + '" onclick="' + toggleHandler + '"' +
            ' target="_blank">Diagramm</a>' +
            '<a href="#" id="togglesource' + blockId + '" onclick="' + toggleHandler + '" target="_blank">Source</a>' +
            '</div>' +
            '</div>');
    };

    /**
     * toggle diagram-services (if id1 displayed: hide id1, show link1 and show id2, hide link2)...
     * @param {Object} link1         JQuery-Filter (html.id, style, objectlist...) for the link of service1
     * @param {Object} link2         JQuery-Filter (html.id, style, objectlist...) for the link of service2
     * @param {Object} id1           JQuery-Filter (html.id, style, objectlist...) for service1
     * @param {Object} id2           JQuery-Filter (html.id, style, objectlist...) for service2
     */
    me.toggleLinks = function (link1, link2, id1, id2) {
        if (me.$(id1).css('display') !== 'none') {
            me.$(id1).css('display', 'none');
            me.$(link1).css('display', 'inline');
            me.$(id2).css('display', 'block');
            me.$(link2).css('display', 'none');
        } else {
            me.$(id2).css('display', 'none');
            me.$(link2).css('display', 'inline');
            me.$(id1).css('display', 'block');
            me.$(link1).css('display', 'none');
        }
        return false;
    };
    
    return me;
};
