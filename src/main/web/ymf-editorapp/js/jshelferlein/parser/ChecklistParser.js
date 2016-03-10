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
 * servicefunctions for parsing checklists
 * 
 * @param {JsHelferlein.AppBase} appBase          appBase of the application
 * @return {JsHelferlein.ChecklistParser}         an instance of the service
 * @augments JsHelferlein.AbstractParser
 * @constructor
 */
JsHelferlein.ChecklistParser = function (appBase) {
    'use strict';

    var me = JsHelferlein.AbstractParser(appBase);

    // states
    me.checkListConfigs = {
        'checklist-state-OPEN': {
            matchers: ['OPEN', 'OFFEN', 'o', 'O', '0', 'TODO']
        },
        'checklist-state-RUNNING': {
            matchers: ['RUNNING']
        },
        'checklist-state-LATE': {
            matchers: ['LATE']
        },
        'checklist-state-BLOCKED': {
            matchers: ['BLOCKED', 'WAITING', 'WAIT']
        },
        'checklist-state-WARNING': {
            matchers: ['WARNING']
        },
        'checklist-state-DONE': {
            matchers: ['DONE', 'OK', 'x', 'X', 'ERLEDIGT']
        },
        'checklist-test-TESTOPEN': {
            matchers: ['TESTOPEN']
        },
        'checklist-test-PASSED': {
            matchers: ['PASSED']
        },
        'checklist-test-FAILED': {
            matchers: ['FAILED', 'ERROR']
        }
    };

    /**
     * executes checklist-formatter (add span with checklist-Styles) on the block [use me.checkListConfigs]
     * @param {string} selector                 filter to identify the block to format (used as jquery-selector)
     * @param {boolean} force                   force parsing
     */
    me.renderBlock = function (selector, force) {
        me.$(selector).each(function (i, block) {
            console.log('ChecklistParser.renderBlock ' + selector);
            try {
                me._highlightCheckList(block, force);
            } catch (ex) {
                console.error('ChecklistParser.renderBlock error:' + ex, ex);
            }
        });
    };

    /**
     * executes checklist-formatter (add span with checklist-Styles) on the block [use me.checkListConfigs]
     * @param descBlock              id-filter to identify the block to format
     * @param force                  force parsing
     */
    me._highlightCheckList = function (descBlock, force) {
        var $blockElement = me.$(descBlock);
        var descBlockId = $blockElement.attr('id');
        if ($blockElement.attr('data-checklist-processed') && !force) {
            console.log('highlightCheckList already done for block: ' + descBlockId);
            return;
        }
        $blockElement.attr('data-checklist-processed', true);
        console.log('highlightCheckList highlight for block: ' + descBlockId);

        // do it
        var prefix = 'jsh-';
        for (var idx in me.checkListConfigs) {
            if (!me.checkListConfigs.hasOwnProperty(idx)) {
                continue;
            }
            var matchers = me.checkListConfigs[idx].matchers;
            me._highlightCheckListForMatchers(descBlock, matchers, prefix + idx, '');
        }
    };

    /**
     * executes checklist-formatter (add span with checklistFormat) with style and styleclass for all matchers '[XXX]' on descBlock
     * @param descBlock              id-filter to identify the block to format
     * @param matchers               list of matcher which will call as stringfilter of '[' + matcher + ']' to identify checklist-entry
     * @param styleClass             styleClass to add to span for matcher found
     * @param style                  style to add to new span for matcher found
     */
    me._highlightCheckListForMatchers = function (descBlock, matchers, styleClass, style) {
        var descBlockId = me.$(descBlock).attr('id');
        console.log('highlightCheckListForMatchers matchers "' + matchers + '" for descBlock: ' + descBlockId);
        for (var idx in matchers) {
            if (!matchers.hasOwnProperty(idx)) {
                continue;
            }
            me._highlightCheckListForMatcher(descBlock, '[' + matchers[idx] + ']', styleClass, style);
        }
    };

    /**
     * executes checklist-formatter (add span with checklistFormat) with style and styleclass for all matchers '[XXX]' on descBlock
     * @param descBlock              id-filter to identify the block to format
     * @param matcherStr             matcher will call as stringfilter to identify checklist-entry
     * @param styleClass             styleClass to add to span for matcher found
     * @param style                  style to add to new span for matcher found
     */
    me._highlightCheckListForMatcher = function (descBlock, matcherStr, styleClass, style) {
        var descBlockId = me.$(descBlock).attr('id');
        console.log('highlightCheckListForMatcher matcherStr "' + matcherStr + '" for descBlock: ' + descBlockId);
        var filter = '#' + descBlockId +' li:contains("' + matcherStr + '"),' +
            '#' + descBlockId +' h1:contains("' + matcherStr + '"),' +
            '#' + descBlockId +' h2:contains("' + matcherStr + '")';
        var regEx = new RegExp(me.appBase.DataUtils.escapeRegExp(matcherStr), 'gi');

        me.$(filter).each(function (index, value) {
            findAndReplaceDOMText(me.$(value).get(0), {
                find: regEx,
                replace: function (portion) {
                    var el = document.createElement('span');
                    if (style) {
                        el.style = style;
                    }
                    if (styleClass) {
                        el.className = styleClass;
                    }
                    el.innerHTML = portion.text;
                    return el;
                }
            });
        });
    };

    return me;
};
