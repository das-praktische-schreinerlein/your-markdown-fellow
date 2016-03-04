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
 * servicefunctions for formatting (markdown, diagrams, mindmaps..)
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.Renderer}                an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.Renderer = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * executes all format-renderer like (mermaid, checklist, highlight, plantuml, mindmap, image-slimbox) on the block
     * @param {string} descBlock              id-filter to identify the block to render (used as jquery-filter)
     */
    me.runAllRendererOnBlock = function (descBlock) {
        var descBlockId = me.$(descBlock).attr('id');

        var svcSyntaxHighlighterParser = me.appBase.SyntaxHighlighterParser;
        var svcChecklistParser = me.appBase.ChecklistParser;
        var svcMermaidParser = me.appBase.MermaidParser;
        var svcMindmapParser = me.appBase.MindmapParser;
        var svcPlantumlParser = me.appBase.PlantumlParser;
        var svcImageSlimboxParser = me.appBase.ImageSlimboxParser;

        console.log('runAllRendererOnBlock highlight for descBlock: ' + descBlockId);

        // highlight code-blocks
        me.$('#' + descBlockId + ' code').each(function (i, block) {
            var $blockElement = me.$(block);
            var blockId = $blockElement.attr('id');
            if (($blockElement.hasClass('lang-mermaid') || $blockElement.hasClass('mermaid') ||
                    $blockElement.hasClass('jshmermaid') || $blockElement.hasClass('ymfmermaid') ||
                    $blockElement.hasClass('yaiomermaid'))
                && !$blockElement.attr('data-processed')) {
                // mermaid: no highlight
                console.log('runAllRendererOnBlock mermaid descBlock: ' + descBlockId + ' block: ' + blockId);
                svcMermaidParser.renderBlock(block);
            } else {
                // do highlight
                console.log('runAllRendererOnBlock highlight descBlock: ' + descBlockId + ' block: ' + blockId);
                svcSyntaxHighlighterParser.renderBlock(block);
            }
        });

        // mermaid/mindmap div-blocks
        me.$('#' + descBlockId + ' div').each(function (i, block) {
            var $blockElement = me.$(block);
            var blockId = $blockElement.attr('id');
            if (($blockElement.hasClass('lang-mermaid') || $blockElement.hasClass('mermaid') ||
                    $blockElement.hasClass('lang-jshmermaid') || $blockElement.hasClass('jshmermaid') ||
                    $blockElement.hasClass('lang-ymfmermaid') || $blockElement.hasClass('ymfmermaid') ||
                    $blockElement.hasClass('yaiomermaid-mermaid') || $blockElement.hasClass('yaiomermaid'))
                && !$blockElement.attr('data-processed')) {
                // mermaid: no highlight
                console.log('runAllRendererOnBlock mermaid descBlock: ' + descBlockId + ' block: ' + blockId);
                svcMermaidParser.renderBlock(block);
            } else if ($blockElement.hasClass('lang-jshmindmap') || $blockElement.hasClass('jshmindmap') ||
                       $blockElement.hasClass('lang-ymfmindmap') || $blockElement.hasClass('ymfmindmap') ||
                       $blockElement.hasClass('lang-yaiomindmap') || $blockElement.hasClass('yaiomindmap')) {
                // mindmap: no highlight
                console.log('runAllRendererOnBlock jshmindmap for descBlock: ' + descBlockId + ' block: ' + blockId);
                svcMindmapParser.renderBlock(block);
            } else if ($blockElement.hasClass('lang-jshplantuml') || $blockElement.hasClass('jshplantuml') ||
                       $blockElement.hasClass('lang-ymfplantuml') || $blockElement.hasClass('ymfplantuml') ||
                       $blockElement.hasClass('lang-yaioplantuml') || $blockElement.hasClass('yaioplantuml')) {
                // plantuml: no highlight
                console.log('runAllRendererOnBlock jshplantuml for descBlock: ' + descBlockId + ' block: ' + blockId);
                svcPlantumlParser.renderBlock(block);
            }
        });

        // highlight checklist
        svcChecklistParser.renderBlock(descBlock, true);

        // highlight checklist
        svcImageSlimboxParser.renderBlock('#' + descBlockId + ' img.jsh-md-img');
    };

    /**
     * calls the global mermaid-renderer
     */
    me.renderMermaidGlobal = function () {
        return me.appBase.MermaidParser.renderMermaidGlobal();
    };

    /**
     * render the descText as Markdown
     * @param {string} descText               the string to format
     * @param {boolean} flgHighlightNow       if is set do syntax-highlighting while markdown-processing, if not set do it later
     * @param {string} headerPrefix           optional headerPrefix for heading-ids
     * @return {String}                       formatted markdown
     */
    me.renderMarkdown = function (descText, flgHighlightNow, headerPrefix) {
        var svcJshMarkdownRenderer = me.appBase.MarkdownRenderer;

        // prepare descText
        descText = svcJshMarkdownRenderer.prepareTextForMarkdown(descText);

        return svcJshMarkdownRenderer.renderMarkdown(descText, flgHighlightNow, headerPrefix);
    };

    /**
     * parse the srcElement, extract all headings and create an TOC in tocElement
     * @param {object} tocElement             element to be used a TOC (used as jquery-selector)
     * @param {object} srcElement             element to be parsed for headings (used as jquery-selector)
     * @param {Object} settings               optional settings for toc
     * 
     */
    me.addTOCForBlock = function (tocElement, srcElement, settings) {
        // add TOC
        settings = settings || {toc: {}};
        settings.toc = settings.toc || {};
        settings.toc.dest = me.$(tocElement);
        me.$.fn.toc(me.$(srcElement), settings);
    };

    return me;
};
