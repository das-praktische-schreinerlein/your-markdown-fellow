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
 * servicefunctions for parsing plantuml-sources
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @constructor
 */
JsHelferlein.PlantumlParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the block-content as plantuml.
     * creates a Img-Tag with src 'http://www.plantuml.com/plantuml/img/
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, block) {
            var $blockElement = me.$(block);
            if ($blockElement.attr('data-plantuml-processed')) {
                console.log('PlantumlParser.renderBlock already done for block: ' + selector);
                return;
            }
            $blockElement.attr('data-plantuml-processed', true);

            me._addServiceLinks(block);

            var content = $blockElement.html();
            var url = me._generatePlantuml(content);
            console.log('PlantumlParser.renderBlock ' + selector + ' url:' + url);
            $blockElement.html('<img class="jsf-plantuml" src="' + url + '" id="' + selector + 'Img">');
        });
    };

    /**
     * add service-links (source, download, diagram) to the block
     * @param {string} block                 selector to identify the block via jquery
     */
    me._addServiceLinks = function (block) {
        var $blockElement = me.$(block);
        var blockId = $blockElement.attr('id');

        var content = $blockElement.html();
        var url = me._generatePlantuml(content);
        me.appBase.DiagramWidgets.addServiceLinksToDiagramBlock(block, 'jshplantuml',
            '<a href="' + url + '" id="download' + blockId + '" target="_blank">Download</a>');
    };


    /**
     * generate a plantuml for the content (url can be used as img.src)
     * @param {string} content       plant-uml source to parse a plantuml  
     */
    me._generatePlantuml = function (content) {
        /*jshint bitwise: false */
        function encode64(data) {
            var r = '';
            for (var i = 0; i < data.length; i += 3) {
                if (i + 2 === data.length) {
                    r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
                } else if (i + 1 === data.length) {
                    r += append3bytes(data.charCodeAt(i), 0, 0);
                } else {
                    r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1),
                        data.charCodeAt(i + 2));
                }
            }
            return r;
        }

        function append3bytes(b1, b2, b3) {
            var c1 = b1 >> 2;
            var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
            var c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
            var c4 = b3 & 0x3F;
            var r = '';
            r += encode6bit(c1 & 0x3F);
            r += encode6bit(c2 & 0x3F);
            r += encode6bit(c3 & 0x3F);
            r += encode6bit(c4 & 0x3F);
            return r;
        }

        function encode6bit(b) {
            if (b < 10) {
                return String.fromCharCode(48 + b);
            }
            b -= 10;
            if (b < 26) {
                return String.fromCharCode(65 + b);
            }
            b -= 26;
            if (b < 26) {
                return String.fromCharCode(97 + b);
            }
            b -= 26;
            if (b === 0) {
                return '-';
            }
            if (b === 1) {
                return '_';
            }
            return '?';
        }
        /*jshint bitwise: true */

        var txt = content;
        txt = txt.replace(/&gt;/g, '>');
        txt = txt.replace(/&lt;/g, '<');
        txt = txt.replace(/\n\.\n/g, '\n');
        txt = txt.replace(/\n\n/g, '\n');
        var s = decodeURIComponent(encodeURIComponent(txt));
        var url = me.appBase.config.plantUmlBaseUrl + 'plantuml/svg/' + encode64(deflate(s, 9));

        return url;
    };


    return me;
};
