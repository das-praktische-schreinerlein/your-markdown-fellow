
your-markdown-fellow - Your-Markdown-Fellow

---------------

# Desc
"Your-Markdown-Fellow" is the prototype of my own Markdown-Editor. 
Originally part of my project-management software [Your-All-In-One](https://github.com/das-praktische-schreinerlein/your-all-in-one) its now an stand-alone project.
 
A demo can be found at [http://your-all-in-one.de/demos/ymf/](http://your-all-in-one.de/demos/ymf/).

# Installation
Quite simple: download, build, run

- clone project
```
cd projects
git clone https://github.com/das-praktische-schreinerlein/your-markdown-fellow.git
cd your-markdown-fellow
```
- build with [npm](https://docs.npmjs.com/getting-started/installing-node)
```
npm install
grunt dist
```
- configure devserver in Gruntfile.js
```
    var devserverPort = 8501;
```
- start
```
grunt devserver
firefox http://localhost:5801
```

## Use it in own projects 

## As editor
If you want to use gthe full editor it in your own projects
- create an textarea with the content so show/edit
```
<div class="hidden" id="ymf-workspace-box">
    <textarea class="ymf-workspace-content-desc" id="ymf-workspace-content">
# Your-Markdown-Fellow sagt Guten Tag :-)
Schön das Du hierher gefunden hast!!!
    </textarea>
</div>
```
- initialize the editor
```
<script type="text/javascript">
    window.ymfAppBase = YmfAppBase();
    ymfAppBase.publishDetectorStyles();

    // open Wysiwyg
    ymfAppBase.YmfMarkdownEditorController.openWysiwygForTextareaId('ymf-workspace-content');
</script>
```
- ymf will update this textarea for every change in editor-window

# Todos for me
- [ ] use and optimize it :-)
- **and a lot more to implement - take a look at [YAIO-Masterproject resources/docs/Roadmap.md](https://github.com/das-praktische-schreinerlein/your-all-in-one/blob/master/resources/docs/Roadmap.md)**

# History and milestones
- **see details on [YAIO-Masterproject resources/docs/Changelog.md](https://github.com/das-praktische-schreinerlein/your-all-in-one/blob/master/resources/docs/Changelog.md)**
- 2016
   - spin off of [Your-All-In-One](https://github.com/das-praktische-schreinerlein/your-all-in-one)

# Thanks to
- **Build-Tools**
    - **Node**
        - Dev-Stack: [Nodejs](https://nodejs.org)
        - Frontend-Packagemanager: [Bower](http://bower.io/)
        - Packagemanager: [NPM](https://www.npmjs.com/)
        - Taskrunner: [Grunt](http://gruntjs.com/)
        - Test-Framework: [Jasmine](http://jasmine.github.io/)
        - Test-Runner: [Karma](http://karma-runner.github.io/)
        - Test-Browser Headless: [Phantomjs](http://phantomjs.org/)
        - Test-Framework e2e: [Protractor](https://angular.github.io/protractor/#/)
        - Test-Framework Browser automation: [Selenium](http://www.seleniumhq.org/)
    - **Virtualisation**
        - Docker: [Docker](https://www.docker.com/)
        - Vagrant: [Vagrant](https://www.vagrantup.com/)
- **JS-Code-Frameworks**
    - Layout-Framework: [JQuery](https://github.com/jquery/jquery)
- **JS-GUI**
    - DOM-Manipulation: [findAndReplaceDOMText](https://github.com/padolsey/findAndReplaceDOMText)
    - Html-Editor: [Ace](https://github.com/ajaxorg/ace-builds)
    - Toast-Messages: [Toastr](https://github.com/CodeSeven/toastr)
    - TOC: [Strapdown TOC](https://github.com/ndossougbe/strapdown)
    - UI-Features: [JQuery-UI](https://github.com/jquery/jquery-ui)
- **JS-Formatter**
    - Freemmind-Browser: [Freemind Flash-Browser](http://freemind.sourceforge.net/wiki/index.php/Flash_browser)
    - Html-Editor: [Ace](https://github.com/ajaxorg/ace-builds)
    - Layout-Framework: [JQuery](https://github.com/jquery/jquery)
    - Markdown-Parser+Formatter: [Marked](https://github.com/chjj/marked)
    - Syntax-Highlighting: [highlight.js](https://highlightjs.org/)
    - Web-Diagrams: [mermaid](https://github.com/knsv/mermaid)
    - Web-Diagrams: [PlantUML](http://plantuml.com/)
- **JS-Multilanguage**
    - Multilanguage for Tooltipps: [JQuery-Lang](https://github.com/coolbloke1324/jquery-lang-js)


# License
    /**
     * @author Michael Schreiner <michael.schreiner@your-it-fellow.de>
     * @category collaboration
     * @copyright Copyright (c) 2010-2014, Michael Schreiner
     * @license http://mozilla.org/MPL/2.0/ Mozilla Public License 2.0
     *
     * This Source Code Form is subject to the terms of the Mozilla Public
     * License, v. 2.0. If a copy of the MPL was not distributed with this
     * file, You can obtain one at http://mozilla.org/MPL/2.0/.
     */
