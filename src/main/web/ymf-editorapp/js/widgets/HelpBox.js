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
 * Widget of the Preview-Box
 * 
 * @param {JsHelferlein.AppBase} appBase            appBase of the application
 * @param {JsHelferlein.ConfigBase} config          optional configuration (default set in module)
 *      {string} url          url to the markdown-helpfile to open in separate window
 * @return {Ymf.HelpBox}                            an instance of the widget
 * @augments JsHelferlein.WidgetBox
 * @constructor
 */
Ymf.HelpBox = function (appBase, config) {
    'use strict';

    // configure
    var defaultConfig = new JsHelferlein.ConfigBase();
    defaultConfig.url = 'markdownhelp.html';
    defaultConfig.contentId = 'ymf-markdownhelp-box';
    defaultConfig.content = '<iframe id="ymf-markdownhelp-iframe" src=""></iframe>';

    var me = JsHelferlein.WidgetBox(appBase, config, defaultConfig);

    /**
     * initialize the widget
     */
    me._init = function () {
        me.prepare();
    };

    /**
     * open markdownhelp-box as jquery-dialog
     */
    me.open = function () {
        me.$('#ymf-markdownhelp-iframe').attr('src', me.config.url);
        me._showUI();
    };

    /**
     * create markdownhelp-box as jquery-dialog
     */
    me._createUI = function () {
        me.$box.dialog({
            modal: true,
            width: 1200,
            title: 'YMF-Markdown-Help',
            buttons: {
                'Schliessen': function () {
                    me.close();
                },
                'Eigenes Fenster': function () {
                    var helpFenster = window.open(me.config.url, 'markdownhelp', 'width=1200,height=500,scrollbars=yes,resizable=yes');
                    helpFenster.focus();
                    me.$(this).dialog('close');
                }
            }
        });
    };

    me._init();

    return me;
};

