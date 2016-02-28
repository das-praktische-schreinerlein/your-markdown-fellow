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
 * Extended Markdown-syntax
 *
 */
(function () {
    'use strict';


    marked.Lexer.prototype.extenedBlockRules = {
        ruleBoxStart: /^ *(<|&lt;)\!---(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)/,
        ruleBoxEnd: /^ *(<|&lt;)\!---\/(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)/
    };

    /**
     * implementation of the abstract tokenizeExtenedMarkdown from marked.Lexer
     * @param {marked.Lexer} lexer       instance of the Lexer
     * @param {string} src               markdown-source to parse
     * @return {Object}                  rest-src which should parsed by another lexer
     */
    marked.Lexer.prototype.tokenizeExtenedMarkdown = function (lexer, src) {
        var cap;
        // check block.msextend
        if (lexer.extenedBlockRules.ruleBoxStart) {
            cap = lexer.extenedBlockRules.ruleBoxStart.exec(src);
            if (cap) {
                src = src.substring(cap[0].length);
                lexer.tokens.push({
                    type: 'ruleBoxStart',
                    boxtype: cap[2],
                    attr: cap[3]
                });
                return {src: src, found: true};
            }
        }
        if (lexer.extenedBlockRules.ruleBoxEnd) {
            cap = lexer.extenedBlockRules.ruleBoxEnd.exec(src);
            if (cap) {
                src = src.substring(cap[0].length);
                lexer.tokens.push({
                    type: 'ruleBoxEnd',
                    boxtype: cap[2],
                    attr: cap[3]
                });
                return {src: src, found: true};
            }
        }

        return {src: src, found: false};
    };

    marked.Parser.prototype.renderExtenedMarkdownToken = function (parser, token) {
        switch (token.type) {
            case 'ruleBoxStart':
            {
                return parser.renderer._renderExtendedMarkdownBoxStart(token.boxtype, token.attr);
            }
            case 'ruleBoxEnd':
            {
                return parser.renderer._renderExtendedMarkdownBoxEnd(token.boxtype, token.attr);
            }
            case 'toggler':
            {
                return parser.renderer._renderExtendedMarkdownToggler(token.togglertype, token.attr);
            }
            case 'splitter':
            {
                return parser.renderer._renderExtendedMarkdownSplitter(token.togglertype, token.attr, token.pre, token.after);
            }
        }
        return '';
    };

    marked.InlineLexer.prototype.extenedInlineRules = {
        toggler: /([\s\S]*?)(<|&lt;)!---(TOGGLER) *([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)([\s\S]*)/,
        togglerAppend: /([\s\S]*?)(<|&lt;)!---(TOGGLER\.AFTER|TOGGLER\.BEFORE) *([-#_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)([\s\S]*)/,
        splitter: /([\s\S]*?)(:\|:)(.*)([\s\S]*)/,
        toc: /(.*?)(<|&lt;)!---(TOC) *([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)([\s\S]*)/,
        ruleBoxStart: /(.*?)(<|&lt;)\!---(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)([\s\S]*)/,
        ruleBoxEnd: /(.*?)(<|&lt;)\!---\/(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)([\s\S]*)/
    };

    marked.InlineLexer.prototype.renderExtenedInlineSyntax = function (inlinelexer, src) {
        var out = '', cap;

        // check inline.msextend
        if (inlinelexer.extenedInlineRules.splitter) {
            cap = inlinelexer.extenedInlineRules.splitter.exec(src);
            if (cap) {
                out += inlinelexer.renderer._renderExtendedMarkdownSplitter(cap[2], '',
                    inlinelexer.output(cap[1]), inlinelexer.output(cap[3]));
                src = cap[4];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.toggler) {
            cap = inlinelexer.extenedInlineRules.toggler.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownToggler(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.togglerAppend) {
            cap = inlinelexer.extenedInlineRules.togglerAppend.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownTogglerAppend(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.toc) {
            cap = inlinelexer.extenedInlineRules.toc.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownTOC(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.ruleBoxStart) {
            cap = inlinelexer.extenedInlineRules.ruleBoxStart.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownBoxStart(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        if (inlinelexer.extenedInlineRules.ruleBoxEnd) {
            cap = inlinelexer.extenedInlineRules.ruleBoxEnd.exec(src);
            if (cap) {
                out += inlinelexer.output(cap[1]);
                out += inlinelexer.renderer._renderExtendedMarkdownBoxEnd(cap[3], cap[4]);
                src = cap[6];
                return {out: out, src: src, found: true};
            }
        }
        return {out: '', src: src, found: false};
    };


    marked.Renderer.prototype.initStylesClassesForTags = function (prefix) {
        var renderer = this;
        var tags = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
            'img', 'a', 'p', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'br', 'li', 'ul', 'ol',
            'container',
            'box', 'box-ue', 'box-container',
            'infobox', 'infobox-ue', 'infobox-container',
            'warnbox', 'warnbox-ue', 'warnbox-container',
            'alertbox', 'alertbox-ue', 'alertbox-container',
            'togglerparent', 'splitter1', 'splitter2'
        ];
        var allTagStyles = renderer.allTagStyles;
        tags.map(function (tag) {
            var style = (prefix ? prefix : '') + 'md-' + tag;
            var tagStyles = allTagStyles[tag];
            if (!tagStyles) {
                tagStyles = {};
            }
            tagStyles[style] = style;
            allTagStyles[tag] = tagStyles;
        });
        renderer.allTagStyles = allTagStyles;
    };

    marked.Renderer.prototype._renderExtendedMarkdownBoxhtmlStart = function (type, param) {
        var renderer = this;
        return '<div class="' + renderer.genStyleClassesForTag(type + 'box') + '">' +
            '<div class="' + renderer.genStyleClassesForTag(type + 'box-ue') + '">' + param + '</div>' +
            '<div class="' + renderer.genStyleClassesForTag(type + 'box-container') + '">';
    };

    marked.Renderer.prototype._renderExtendedMarkdownBoxStart = function (type, param) {
        var renderer = this;
        var res = '';

        if (type.toLowerCase() === 'box') {
            res = '<div class="' + renderer.genStyleClassesForTag('box') + ' ' + param + '">';
        } else if (type.toLowerCase() === 'container') {
            res = '<div class="' + renderer.genStyleClassesForTag('container') + ' md-container-' + param + '" id="md-container-' + param + '">';
        } else if (type.toLowerCase() === 'box.info') {
            res = renderer._renderExtendedMarkdownBoxhtmlStart('info', param);
        } else if (type.toLowerCase() === 'box.warn') {
            res = renderer._renderExtendedMarkdownBoxhtmlStart('warn', param);
        } else if (type.toLowerCase() === 'box.alert') {
            res = renderer._renderExtendedMarkdownBoxhtmlStart('alert', param);
        } else if (type.toLowerCase() === 'style' && param) {
            // do set style for next elements

            // split params elements:styles
            var params = param.split(':'),
                tags = [],
                styles = [];
            if (params.length > 0) {
                tags = params[0].split(' ');
                if (params.length > 1) {
                    styles = params[1].split(' ');
                }
            }
            // set styles for all tags
            var allTagStyles = renderer.allTagStyles;
            tags.map(function (tag) {
                var tagStyles = allTagStyles[tag];
                if (!tagStyles) {
                    tagStyles = {};
                }
                styles.map(function (style) {
                    tagStyles[style] = style;
                });
                allTagStyles[tag] = tagStyles;
            });
            renderer.allTagStyles = allTagStyles;
        }
        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownBoxEnd = function (type, param) {
        var renderer = this;
        var res = '';

        if (type.toLowerCase() === 'box') {
            res = '</div>';
        } else if (type.toLowerCase() === 'box.info' ||
            type.toLowerCase() === 'box.alert' ||
            type.toLowerCase() === 'box.warn') {
            res = '</div></div>';
        } else if (type.toLowerCase() === 'container') {
            res = '</div>';
        } else if (type.toLowerCase() === 'style' && param) {
            // do reset style for next elements
            // split params elements:styles
            var params = param.split(':'),
                tags = [],
                styles = [];
            if (params.length > 0) {
                tags = params[0].split(' ');
                if (params.length > 1) {
                    styles = params[1].split(' ');
                }
            }
            // reset styles for all tags
            var allTagStyles = renderer.allTagStyles;
            tags.map(function (tag) {
                styles.map(function (style) {
                    if (allTagStyles[tag] && allTagStyles[tag][style]) {
                        allTagStyles[tag][style] = '';
                        delete allTagStyles[tag][style];
                    }
                });
            });
        }
        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownToggler = function (type, attr) {
        var renderer = this;
        var appBaseVarName = renderer.appBaseVarName;
        if (!appBaseVarName) {
            appBaseVarName = 'jshAppBase';
        }
        var res = '';
        var params = (attr || '').split(','),
            togglerType = 'icon',
            id;
        if (params.length > 0) {
            id = params[0].replace(' ');
            if (params.length > 1) {
                togglerType = params[1];
            }
        }

        if (type.toLowerCase() === 'toggler' && id !== undefined && id !== '') {
            res = '<div class="' + renderer.genStyleClassesForTag('togglerparent') + ' md-togglerparent-' + id + '" id="md-togglerparent-' + id + '"></div>' +
                '<script>' + appBaseVarName + '.get(\'UIToggler\').appendToggler(".md-togglerparent-' + id + '", ".md-container-' + id + '", "' + togglerType + '");</script>';
        }
        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownTogglerAppend = function (type, attr) {
        var renderer = this;
        var appBaseVarName = renderer.appBaseVarName;
        if (!appBaseVarName) {
            appBaseVarName = 'jshAppBase';
        }
        var res = '';
        var params = (attr || '').split(','),
            togglerType = 'icon',
            tags = [],
            styles = [],
            flgInsertBefore = (type === 'TOGGLER.BEFORE');
        if (params.length > 0) {
            if (params.length > 1) {
                togglerType = params[1];
            }

            // split params elements:styles
            var filter = params[0].replace(' ').split(':');
            if (filter.length > 0) {
                tags = filter[0].split(' ');
                if (filter.length > 1) {
                    styles = filter[1].split(' ');
                }
            }
            tags.map(function (tag) {
                styles.map(function (style) {
                    res = '<script>' + appBaseVarName + '.get(\'UIToggler\').appendTogglerForElements("' +
                        tag + '.' + style + '", "' + togglerType + '", ' + flgInsertBefore + ');</script>';
                });
            });
        }

        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownTOC = function (type, attr) {
        var renderer = this;
        var appBaseVarName = renderer.appBaseVarName;
        if (!appBaseVarName) {
            appBaseVarName = 'jshAppBase';
        }
        var res = '';
        var params = (attr || '').split(','),
            togglerType = 'icon',
            id;
        if (params.length > 0) {
            id = params[0].replace(' ');
            if (params.length > 1) {
                togglerType = params[1];
            }
        }

        if (marked.nextTocId === undefined) {
            marked.nextTocId = 1;
        }
        if (type.toLowerCase() === 'toc') {
            var tocId = 'jsh-md-toc-container-' + marked.nextTocId,
                tocElement = appBaseVarName + '.$(\'div.'+ tocId + '\')',
                srcElement = tocElement + '.parents(\'div\')',
                settings = 'undefined';
            res = '<div class="jsh-md-toc-container ' + tocId + '" id="' + tocId + '"></div>' +
                '<script>' + appBaseVarName + '.get(\'Renderer\').addTOCForBlock(' +
                tocElement +', ' + srcElement + ', ' + settings + ');</script>';
        }
        marked.nextTocId++;
        return res;
    };

    marked.Renderer.prototype._renderExtendedMarkdownSplitter = function (type, attr, first, second) {
        var renderer = this;
        return '<label class="' + renderer.genStyleClassesForTag('splitter1') + '">' + first + '</label>' +
            '<span class="' + renderer.genStyleClassesForTag('splitter2') + '">' + second + '</span>';
    };

})();