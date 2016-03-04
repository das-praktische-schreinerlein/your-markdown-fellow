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
 * servicefunctions for parsing mermaid-sources
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.MermaidParser}           an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.MermaidParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the block-content as mermaid
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, block) {
            var $blockElement = me.$(block);
            if ($blockElement.attr('data-mermaid-processed') || $blockElement.attr('data-processed')) {
                console.log('MermaidParser.renderBlock already done for block: ' + selector);
                return;
            }
            $blockElement.attr('data-mermaid-processed', true);

            me._addServiceLinks(block);

            mermaid.parseError = function (err, hash) {
                me.appBase.UIDialogs.showToastMessage('error', 'Oops! Ein Fehlerchen :-(', 'Syntaxfehler bei Parsen des Diagrammcodes:' + err);
            };
            try {
                mermaid.init(block);
            } catch (ex) {
                console.error('MermaidParser.renderBlock error:' + ex, ex);
            }
        });
    };

    /**
     * add service-links (source, download, diagram) to the block
     * @param {string} block                 selector to identify the block via jquery
     */
    me._addServiceLinks = function (block) {
        var blockId = me.$(block).attr('id');
        var jshAppBaseVarName = me.appBase.config.appBaseVarName;

        var clickHandler = jshAppBaseVarName +
            '.FileUtils.downloadAsFile(' +
            jshAppBaseVarName + '.$(\'#linkdownload' + blockId + '\'), ' +
            jshAppBaseVarName + '.$(\'#' + blockId + '\').html(), \'diagram.svg\', \'image/svg+xml\', \'utf-8\'); ' +
            'return true;';
        me.appBase.DiagramWidgets.addServiceLinksToDiagramBlock(block, 'mermaid',
            '<a href="" id="linkdownload' + blockId + '"  target="_blank"' +
            ' onclick="' + clickHandler + '">Download</a>');
    };

    /**
     * render all mermaid in document
     */
    me.renderMermaidGlobal = function () {
        mermaid.parseError = function (err, hash) {
            me.appBase.UIDialogs.showToastMessage('error', 'Oops! Ein Fehlerchen :-(', 'Syntaxfehler bei Parsen des Diagrammcodes:' + err);
        };
        try {
            mermaid.init();
        } catch (ex) {
            console.error('renderMermaidGlobal error:' + ex, ex);
        }
    };

    /**
     * prepare the text to format as mermaid
     * delete "."
     * @param descText               the string to prepare
     * @return                       {String}  prepared text to format with mermaid
     */
    me.prepareTextForMermaid = function (descText) {
        // prepare descText
        var newDescText = descText;
        newDescText = newDescText.replace(/\n\.\n/g, '\n\n');
        return newDescText;
    };


    return me;
};
