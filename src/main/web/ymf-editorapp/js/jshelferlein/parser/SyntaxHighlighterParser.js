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
 * servicefunctions for parsing sourcecode-sources
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.SyntaxHighlighterParser} an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.SyntaxHighlighterParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the block-content as sourcecode with syntax-highlighting
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, block) {
            var $blockElement = me.$(block);
            var blockId = $blockElement.attr('id');
            if ($blockElement.attr('data-syntaxhighlight-processed')) {
                console.log('SyntaxHighlighterParser.renderBlock already done for block: ' + blockId);
                return;
            }
            $blockElement.attr('data-syntaxhighlight-processed', true);

            console.log('SyntaxHighlighterParser.renderBlock ' + blockId);
            try {
                hljs.highlightBlock(block);
            } catch (ex) {
                console.error('SyntaxHighlighterParser.renderBlock error:' + ex, ex);
            }
        });
    };

    return me;
};
