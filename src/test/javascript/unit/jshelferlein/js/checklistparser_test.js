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
 * tests for yaio-formatter.js checks formatter
 *  
 * @FeatureDomain                Test
 * @author                       Michael Schreiner <michael.schreiner@your-it-fellow.de>
 * @category                     collaboration
 * @copyright                    Copyright (c) 2014, Michael Schreiner
 * @license                      http://mozilla.org/MPL/2.0/ Mozilla Public License 2.0
 */

(function () {
    // 'use strict'; fails in IE because of findandreplacedomtext
    /* jshint strict: false */
    var testObj = ymfAppBase.get('ChecklistParser');
    
    describe('Modul ChecklistParser Service-Funktions (Renderer highlightCheckList)', function doSuiteHighlightCheckList() {
        beforeEach(function (done) {
            // load async
            setTimeout(function () {
                // load fixture
                loadFixtures('jshelferlein/checklistparser.html');
                
                // call done
                done();
            }, 1000);
            
            // set _localHtmlId
            testObj._localHtmlId = 1;
        });
    
        afterEach(function () {
        });

        it( 'should convert html-listentries to formatted checklist (highlightCheckList)', function doTestHighlightCheckList() {
            // Given
            var expected = $('#checklist_expected').html().trim();
            
            // When
            testObj.renderBlock('#checklist_src');
            var res = $('#checklist_src').html().trim();
            
            // Then
            expect(res).toBe(expected);
        });
    });

    describe('Modul yaio-formatter Service-Funktions (Renderer checklists)', function doSuiteHighlightCheckListForMatcher() {
        var doCheckHighlightCheckList = function(src, expected, formatter) {
            // Given
            $('body').html('<div id="test">' + src + '</div>');
            
            // When
            formatter();
            var res = $('#test').html();
            
            // Expected
            expect(res).toBe(expected);
        };

        it( 'should convert html-listentries to formatted checklist (highlightCheckListForMatchers)', function doTestHighlightCheckListForMatchers() {
            doCheckHighlightCheckList(
                    '<ul><li>[TEST1] - xyz</li><li>[TEST3] - xyz</li></ul>',
                    '<ul><li><span class="style1">[TEST1]</span> - xyz</li><li>[TEST3] - xyz</li></ul>',
                    function() {
                        testObj._highlightCheckListForMatchers($('#test'), ['TEST1', 'TEST2'], 'style1');
            });
        });

        it( 'should convert html-listentries to formatted checklist (highlightCheckListForMatcher)', function doTestHighlightCheckListForMatcher() {
            doCheckHighlightCheckList(
                    '<ul><li>[TEST1] - xyz</li><li>[TEST3] - xyz</li></ul>',
                    '<ul><li><span class="style1">[TEST1]</span> - xyz</li><li>[TEST3] - xyz</li></ul>',
                    function() {
                        testObj._highlightCheckListForMatcher($('#test'), '[TEST1]', 'style1');
            });
        });
    });
    /* jshint strict: true */
})();
