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
 * servicefunctions for markdown-rendering
 * 
 * @param {JsHelferlein.AppBase} appBase                appBase of the application
 * @param {JsHelferlein.MarkdownRendererConfig} config  optional configuration  (default JsHelferlein.MarkdownRendererConfig)
 * @return {JsHelferlein.MarkdownRenderer}              an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.MarkdownRenderer = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, new JsHelferlein.MarkdownRendererConfig());

    me._localHtmlId = 1;

    /**
     * format the descText as Markdown
     * @param descText               the string to format
     * @param flgHighlightNow        if is set do syntax-highlighting while markdown-processing, if not set do it later
     * @param headerPrefix           headerPrefix for heading-ids
     * @return                       {String} - formatted markdown
     */
    me.renderMarkdown = function (descText, flgHighlightNow, headerPrefix) {
        // Marked
        me._configureMarked(flgHighlightNow, headerPrefix);
        return marked(descText);
    };

    /**
     * prepare the text to format as markdown
     * prefix empty lines inline code-segs (```) so that they will interpreted as codeline by markdown-parser
     * @param descText               the string to prepare
     * @return                       {String}  prepared text to format as markdown
     */
    me.prepareTextForMarkdown = function (descText) {
        // prepare descText
        var noCode = '';
        var newDescText = '';
        var newDescTextRest = descText;
        var codeStart = newDescTextRest.indexOf('```');
        while (codeStart >= 0) {
            // splice start before ```and add to newDescText
            noCode = newDescTextRest.slice(0, codeStart + 3);

            // replace <> but prevent <br> in noCode
            noCode = me.appBase.DataUtils.htmlEscapeTextLazy(noCode);
            noCode = noCode.replace(/&lt;br&gt;/g, '<br>');
            newDescText += noCode;

            // extract code
            newDescTextRest = newDescTextRest.slice(codeStart + 3);
            var codeEnd = newDescTextRest.indexOf('```');
            if (codeEnd >= 0) {
                // splice all before ending ```
                var code = newDescTextRest.slice(0, codeEnd);
                newDescTextRest = newDescTextRest.slice(codeEnd);

                // replace empty lines in code
                code = code.replace(/\r\n/g, '\n');
                code = code.replace(/\n\r/g, '\n');
                code = code.replace(/\n[ \t]*\n/g, '\n.\n');
                code = code.replace(/\n\n/g, '\n.\n');

                // add code to newDescText
                newDescText += code;

                // extract ending ``` and add it to newDescText
                newDescText += newDescTextRest.slice(0, 3);
                newDescTextRest = newDescTextRest.slice(3);
            }
            codeStart = newDescTextRest.indexOf('```');
        }

        // replace <> but prevent <br> in noCode
        noCode = newDescTextRest;
        noCode = me.appBase.DataUtils.htmlEscapeTextLazy(noCode);
        noCode = noCode.replace(/&lt;br&gt;/g, '<br>');

        // add rest to newDescText
        newDescText += noCode;

        return newDescText;
    };


    /**
     * configure the instance of marked with a render 
     * @param {boolean} flgHighlightNow        do syntax-highlighting while rendering with marked 
     * @param {string} headerPrefix            optional prefix for heading-ids
     */
    me._configureMarked = function (flgHighlightNow, headerPrefix) {
        var renderer = me._createMarkdownRenderer();
        marked.setOptions({
            renderer: renderer,
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            headerPrefix: headerPrefix
        });
        if (flgHighlightNow) {
            marked.setOptions({
                highlight: function (code) {
                    return hljs.highlightAuto(code).value;
                }
            });
        }
    };

    /**
     * create and configure a instance of marked.Renderer
     * @returns {marked.Renderer}              the resulting renderer
     */
    me._createMarkdownRenderer = function () {
        var renderer = new marked.Renderer();

        renderer.appBaseVarName = me.appBase.config.appBaseVarName;

        // my own code-handler
        renderer.code = me._renderMarkdownCode;

        // my own heading-handler to be sure that the heading id is unique
        renderer.heading = me._renderMarkdownHeading;

        // my own link-renderer: for jsh
        renderer.link = me._renderMarkdownLink;

        // my own img-renderer: for jsh
        renderer.image = me._renderMarkdownImage;

        // init styleclasses
        renderer.initStylesClassesForTags('jsh-');

        return renderer;
    };

    /**
     * parse jsh-links from href and replace if exists with dms-urls...
     * @param {string} href          the url to parse
     * @param {boolean} dmsOnly      parse dms only: not yaio:
     * @return  {string}             mapped url
     */
    me._parseLinks = function (href, dmsOnly) {
        return href;
    };

    /**
     * callback to render markdown "code"-blocks
     * @param {string} code          source of the code-block
     * @param {string} language      optional language of the code
     * @return {string}              rendered block
     */
    me._renderMarkdownCode = function (code, language) {
        var prefix = me.config.styleNS || '';
        code = me.appBase.DataUtils.htmlEscapeTextLazy(code);
        if (code.match(/^sequenceDiagram/) || code.match(/^graph/) || code.match(/^gantt/)) {
            return '<div id="inlineMermaid' + (me._localHtmlId++) + '" class="' + prefix + 'mermaid mermaid">' +
                me.appBase.MermaidParser.prepareTextForMermaid(code) + '</div>';
        } else if (!me.appBase.DataUtils.isUndefinedStringValue(language) &&
            (language.match(/^jshmindmap/) || language.match(/^jshfreemind/) ||
             language.match(/ymfmindmap/) || language.match(/^ymffreemind/) ||
             language.match(/^yaiomindmap/) || language.match(/^yaiofreemind/))) {
            return '<div id="inlineMindmap' + (me._localHtmlId++) + '" class="' + prefix + 'mindmap jshmindmap">' + code + '</div>';
        } else if (!me.appBase.DataUtils.isUndefinedStringValue(language) && (language.match(/^jshplantuml/) || language.match(/^ymfplantuml/) ||
                language.match(/^yaioplantuml/))) {
            return '<div id="inlinePlantUML' + (me._localHtmlId++) + '" class="' + prefix + 'plantuml jshplantuml">' + code + '</div>';
        } else {
            return '<pre><code id="inlineCode' + (me._localHtmlId++) + '" class="' + prefix + 'code lang-' + language + '">' + code + '</code></pre>';
        }
    };

    /**
     * callback to render markdown "heading"-blocks
     * @param {string} text          source of the heading-block
     * @param {int} level            heading-level (1,2,3,4,5,6)
     * @param {string} raw           raw text
     * @return {string}              rendered block
     */
    me._renderMarkdownHeading = function (text, level, raw) {
        return '<h' + level + this.genStyleClassAttrForTag('h' + level) +
            ' id="' + this.options.headerPrefix + '_' + (me._localHtmlId++) + '_' + raw.toLowerCase().replace(/[^\w]+/g, '-') +
            '">' + text +'</h' + level + '>\n';
    };

    /**
     * callback to render markdown "link"-blocks
     * @param {string} href          href of the link
     * @param {string} title         title
     * @param {string} text          text
     * @return {string}              rendered block
     */
    me._renderMarkdownLink = function (href, title, text) {
        if (this.options.sanitize) {
            var prot;
            try {
                prot = decodeURIComponent(href)
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (e) {
                return '';
            }
            /*jshint scripturl: true */
            if (prot && prot.indexOf('javascript:') === 0) {
                return '';
            }
            /*jshint scripturl: false */
            href = me._parseLinks(href, false);
        }
        var out = '<a href="' + href + '"' + this.genStyleClassAttrForTag('a');
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    };

    /**
     * callback to render markdown "image"-blocks
     * @param {string} href          src of the image
     * @param {string} title         title
     * @param {string} text          text
     * @return {string}              rendered block
     */
    me._renderMarkdownImage = function (href, title, text) {
        if (this.options.sanitize) {
            var prot;
            try {
                prot = decodeURIComponent(href)
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (e) {
                return '';
            }
            /*jshint scripturl: true */
            if (prot && prot.indexOf('javascript:') === 0) {
                return '';
            }
            /*jshint scripturl: false */
            href = me._parseLinks(href, true);
        }
        var out = '<img src="' + href + '" alt="' + text + '"' + this.genStyleClassAttrForTag('img');
        if (title) {
            out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
    };

    return me;
};
