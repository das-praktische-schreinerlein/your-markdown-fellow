/**
 * test the language specific elements of YMF
 * 
 */

'use strict';
var YMFEditorPage = require('../ymfeditor/ymfeditor.po.js');

describe('ymf wysiwyg', function() {
    // define vars
    var ymfWysiwygPage;

    /**
     * prepare tests
     */
    beforeEach(function() {
        // initpages (reset elements)
        ymfWysiwygPage = new YMFEditorPage();
        browser.ignoreSynchronization = true;
    });

    /**
     * cleanup after tests
     */
    afterEach(function() {
        browser.ignoreSynchronization = false;
    });
    
    it('should open wysiwyg-editor, submit markdown, add more markdown in a second step', function doCheckButtons() {
        // Given
        var markdownText = '# Ue1\n\n## Ue2\n';
        var expected = '<h1 class="jsh-md-h1" id="undefined_23_ue1">Ue1</h1>\n<h2 class="jsh-md-h2" id="undefined_24_ue2">Ue2</h2>\n';
        
        // check markdown
        browser.get(browser.params.ymfConfig.ymfBaseUrl + '/ymf-editorapp/ymf-editorapp.html');
        protractor.utils.waitUntilElementVisible($(ymfWysiwygPage.editorInput), protractor.utils.CONST_WAIT_NODEHIRARCHY);
        return ymfWysiwygPage.checkWysiwygContent(protractor.Key.chord(protractor.Key.CONTROL, 'a') +
                protractor.Key.DELETE + markdownText, expected)
            .then(function extendMarkdown() {
                // extend markdown
                markdownText = '\n### Ue3\n';
                expected = '<h1 class="jsh-md-h1" id="undefined_27_ue1">Ue1</h1>\n<h2 class="jsh-md-h2" id="undefined_28_ue2">Ue2</h2>\n<h3 class="jsh-md-h3" id="undefined_29_ue3">Ue3</h3>';
                return ymfWysiwygPage.checkWysiwygContent(markdownText, expected);
            });
        
    });
});

