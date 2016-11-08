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
 * namespace
 */
window.Ymf = {};

/**
 * the appBase for the YmfApp
 * @returns {YmfAppBase}       an appBase-instance
 * @augments JsHelferlein.AppBase
 * @constructor
 */
window.YmfAppBase = function () {
    'use strict';

    var me = JsHelferlein.AppBase(YmfAppBaseConfig());

    /**
     * initialize the app 
     */
    me._init = function () {
        me._configureDefaultServices();
    };

    /**
     * configure the services of the app 
     */
    me._configureDefaultServices = function () {
        // instances
        me.configureService('Ymf.MarkdownEditorServiceHelper', function () {
            return Ymf.MarkdownEditorServiceHelper(me);
        });
        me.configureService('Ymf.MarkdownConverter', function () {
            return Ymf.MarkdownConverter(me);
        });
        me.configureService('Ymf.MarkdownEditorController', function () {
            return Ymf.MarkdownEditorController(me);
        });
        me.configureService('Ymf.MarkdownEditorFactory', function () {
            return Ymf.MarkdownEditorFactory(me);
        });

        // aliases
        me.configureService('YmfMarkdownEditorServiceHelper', function () {
            return me.get('Ymf.MarkdownEditorServiceHelper');
        });
        me.configureService('YmfMarkdownConverter', function () {
            return me.get('Ymf.MarkdownConverter');
        });
        me.configureService('YmfMarkdownRenderer', function () {
            return me.get('JsHelferlein.MarkdownRenderer');
        });
        me.configureService('YmfRenderer', function () {
            return me.get('JsHelferlein.Renderer');
        });
        me.configureService('YmfMarkdownEditorController', function () {
            return me.get('Ymf.MarkdownEditorController');
        });
        me.configureService('YmfMarkdownEditorFactory', function () {
            return me.get('Ymf.MarkdownEditorFactory');
        });
    };

    // init all
    me._init();

    return me;
};