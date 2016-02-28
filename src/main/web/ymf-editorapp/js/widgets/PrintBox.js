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
 * Widget of the Print-Box
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration (default set in module)
 * @constructor
 */
Ymf.PrintBox = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.contentId = 'ymf-print-box';
    defaultConfig.content = '<div id="ymf-wysiwyg-print" class="box container-content-desc"></div>';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
        me.$box.removeClass('hidden');
    };

    /**
     * set content of the print-box
     * @param {string} content    content to show in box
     */
    me.setContent = function (content) {
        var svcYmfRenderer = me.appBase.YmfRenderer;

        var descHtmlMarked = svcYmfRenderer.renderMarkdown(content, true);

        me.$('#ymf-wysiwyg-print').html(descHtmlMarked);

        svcYmfRenderer.runAllRendererOnBlock(me.$('#ymf-wysiwyg-print'));
    };

    /**
     * override ui: nop
     */
    me._createUI = function () {
    };

    me._init();

    return me;
};

