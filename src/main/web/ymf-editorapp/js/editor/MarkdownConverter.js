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
 * servicefunctions for converting markdown
 *
 * @param {JsHelferlein.AppBase} appBase       appBase of the application
 * @return {Ymf.MarkdownConverter}             an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
Ymf.MarkdownConverter = function (appBase) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * convert the markdown-src to jira-format
     * @param {string} descText       the string to prepare
     * @return {string}               markdown-text in jira-format
     */
    me.convertMarkdownToJira = function (descText) {
        // prepare descText
        var newDescText = '';

        var separatedBlocks = descText.split('```');
        for (var i = 0; i < separatedBlocks.length; i++) {
            var tmpText = separatedBlocks[i];
            if ((i % 2) === 0) {
                // text-block: do convert

                // add dummy \n
                tmpText = '\n' + tmpText;

                // lists
                tmpText = tmpText.replace(/\n    - /g, '\n-- ');
                tmpText = tmpText.replace(/\n        - /g, '\n--- ');
                tmpText = tmpText.replace(/\n            - /g, '\n---- ');

                // headings
                tmpText = tmpText.replace(/\n##### /g, '\nh5. ');
                tmpText = tmpText.replace(/\n#### /g, '\nh4. ');
                tmpText = tmpText.replace(/\n### /g, '\nh3. ');
                tmpText = tmpText.replace(/\n## /g, '\nh2. ');
                tmpText = tmpText.replace(/\n# /g, '\nh1. ');

                // delete dummy \n
                tmpText = tmpText.substr(1);
                newDescText += tmpText;
            } else {
                // code-block
                newDescText += '{code}' + tmpText + '{code}';
            }
        }

        return newDescText;
    };

    return me;
};
