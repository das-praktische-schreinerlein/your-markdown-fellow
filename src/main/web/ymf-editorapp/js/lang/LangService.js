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
 * servicefunctions for language
 *
 */

Yaio.Lang = function (appBase) {
    'use strict';

    // my own instance
    var me = JsHelferlein.ServiceBase(appBase);

    /**
     * initialize the object
     */
    me._init = function () {
    };

    /**
     * init the multilanguage support for all tags with attribute <XX lang='de'>
     * @FeatureDomain                GUI
     * @FeatureResult                GUI-result: init multilanguage-support
     * @FeatureKeywords              GUI Editor Multilanguagesupport
     * @param langKey                key of the preferred-language
     */
    me.initLanguageSupport = function (langKey) {
        // Create language switcher instance and set default language to tech
        window.lang = new Lang('tech');

        //Define the de language pack as a dynamic pack to be loaded on demand
        //if the user asks to change to that language. We pass the two-letter language
        //code and the path to the language pack js file
        window.lang.dynamic('de', me.appBase.config.resBaseUrl + 'lang/lang-tech-to-de.json');
        window.lang.dynamic('en', me.appBase.config.resBaseUrl + 'lang/lang-tech-to-en.json');
        window.lang.loadPack('de');
        window.lang.loadPack('en');

        // change to de
        window.lang.change(langKey);
    };

    me._init();

    return me;
};
 
