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
 * servicefunctions for parsing images as slimbox
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.ImageSlimboxParser}      an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.ImageSlimboxParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    /**
     * render the blocks as image-slimbox
     * @param {string} selector                 filter to identify the images to format (used as jquery-selector)
     */
    me.renderBlock = function (selector) {
        me.$(selector).each(function (i, image) {
            var $imageElement = me.$(image);
            if ($imageElement.attr('data-image-processed')) {
                console.log('ImageSlimboxParser.renderBlock already done for image: ' + selector);
                return;
            }
            $imageElement.attr('data-image-processed', true);

            // OnClick loeschen
            $imageElement.each(function(){
                $(this).removeAttr('onclick');
            });

            // an Lightbox anfuegen
            $imageElement.slimbox(
                {/* Put custom options here */},
                function(el) {
                    // read image
                    var img = el;

                    var url = img.src;
                    if (! url) {
                        return null;
                    }

                    var desc = img.getAttribute('diadesc');
                    if (! desc) {
                        desc = img.alt;
                    }

                    return [url, desc];
                },
                function(el) {
                    var img = el;

                    var url = img.src;
                    if (! url) {
                        return false;
                    }
                    return true;
                }
            );
        });
    };

    return me;
};
 