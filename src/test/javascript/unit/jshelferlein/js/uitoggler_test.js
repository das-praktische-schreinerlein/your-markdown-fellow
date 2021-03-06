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
 * tests for yaio-layout.js checks layouthelper
 *  
 * @FeatureDomain                Test
 * @author                       Michael Schreiner <michael.schreiner@your-it-fellow.de>
 * @category                     collaboration
 * @copyright                    Copyright (c) 2014, Michael Schreiner
 * @license                      http://mozilla.org/MPL/2.0/ Mozilla Public License 2.0
 */

(function () {
    'use strict';

    var testObj = ymfAppBase.get('UIToggler');
    
    describe('Modul yaio-layout Service-Funktions (layout)', function doSuiteLayout() {
        beforeEach(function () {
            // add testblock
            var $div = $('<div id="testDiv" style="width: 200px;"/>').append('blabla');
            $('body').append($div);
        });
    
        afterEach(function () {
            // remove testblock
            $('body').remove('#testDiv');
        });

        it( 'asynchronous test: check toggleTableBlock', function doTestToggleTableBlock() {
            // check default
            var isShown = $('#testDiv').css('display');
            expect(isShown).toBe('block');

            // toggle Block is fixed to 1s
            testObj.toggleTableBlock('#testDiv');
            
            // check for result after 2 seconds
            setTimeout(function () {
                var isShown = $('#testDiv').css('display');
                expect(isShown).toBe('none');
            }, 1000);
        });
    });
})();
