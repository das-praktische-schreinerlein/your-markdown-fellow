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
 * servicefunctions for parsing mindmap-sources
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @constructor
 */
JsHelferlein.MindmapParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the block-content as mindmap.
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, block) {
            var blockId = me.$(block).attr('id');
            console.log('MindmapParser.renderBlock ' + blockId);
            me._formatMindmap(block);
        });
    };

    /**
     * format the block-content as mindmap.
     * <ul>
     * <li>creates a FlashObject /dist/vendors.vendorversion/freemind-flash/visorFreemind.swf
     * <li>Calls /converters/mindmap with the html-content of the block
     * <li>insert the returning flash-object into block-element
     * </ul>
     * @param block                  jquery-html-element with the content to convert to mindmap
     */
    me._formatMindmap = function (block) {
        var $blockElement = me.$(block);
        var content = $blockElement.html();
        var blockId = $blockElement.attr('id');

        if ($blockElement.attr('data-mindmap-processed')) {
            console.log('formatMindmap already done for block: ' + blockId);
            return;
        }
        $blockElement.attr('data-mindmap-processed', true);

        me._addServiceLinks(block);

        var url = '/converters/mindmap?source=' + encodeURIComponent(content);
        console.log('formatMindmap ' + blockId + ' url:' + url);
        var fo = new FlashObject('/dist/vendors.vendorversion/freemind-flash/visorFreemind.swf', 'visorFreeMind', '100%', '100%', 6, '#9999ff');
        fo.addParam('quality', 'high');
        fo.addParam('bgcolor', '#a0a0f0');
        fo.addVariable('openUrl', '_blank');
        fo.addVariable('startCollapsedToLevel', '10');
        fo.addVariable('maxNodeWidth', '200');
        //
        fo.addVariable('mainNodeShape', 'elipse');
        fo.addVariable('justMap', 'false');

        fo.addVariable('initLoadFile', url);
        fo.addVariable('defaultToolTipWordWrap', 200);
        fo.addVariable('offsetX', 'left');
        fo.addVariable('offsetY', 'top');
        fo.addVariable('buttonsPos', 'top');
        fo.addVariable('min_alpha_buttons', 20);
        fo.addVariable('max_alpha_buttons', 100);
        fo.addVariable('scaleTooltips', 'false');
        fo.write(blockId);
    };

    /**
     * add service-links (source, download, diagram) to the block
     * @param {string} block                 selector to identify the block via jquery
     */
    me._addServiceLinks = function (block) {
        var $blockElement = me.$(block);
        var blockId = $blockElement.attr('id');

        var content = $blockElement.html();
        var url = '/converters/mindmap?source=' + encodeURIComponent(content);
        me.appBase.DiagramWidgets.addServiceLinksToDiagramBlock(block, 'jshmindmap',
            '<a href="' + url + '" id="download' + blockId + '" target="_blank">Download</a>');
    };

    return me;
};
