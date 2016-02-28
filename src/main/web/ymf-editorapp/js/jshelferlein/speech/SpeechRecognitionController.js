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
 * services for adding SpeechRecognition-support to your app
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @param {JsHelferlein.SpeechRecognitionConfig} config  optional configuration (default JsHelferlein.SpeechRecognitionConfig)
 * @constructor
 */
JsHelferlein.SpeechRecognitionController = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, JsHelferlein.SpeechRecognitionConfig());

    /**
     * initialize the recognition and widget
     */
    me._init = function () {
        me._initUi();
        window.onbeforeunload = function (e) {
            me.stopRecognition();
        };
    };

    var finalTranscript = '';
    var recognizing = false;
    var ignoreOnEnd;
    var startTimestamp;
    var regExTwoLines = /\n\n/g;
    var regExOneLine = /\n/g;
    var regExFirstChar = /\S/;

    /**
     * open an SpeechRecognition-widget with the content of textareaId and if closed rite content back to that textarea
     * @param {string} textareaId      textareaId to get/set the by SpeechRecognition
     */
    me.open = function(textareaId) {
        me.initSrc(textareaId);
        me.speechRecognitionWidget.open();
    };

    /**
     * int the SpeechRecognition-widget with the content of textareaId
     * @param {string} textareaId      textareaId to get/set the by SpeechRecognition
     */
    me.initSrc = function (textareaId) {
        var srcElement;

        if (textareaId) {
            me.config.srcTextareaId = textareaId;
        }

        if (me.config.srcTextareaId) {
            srcElement = '#' + me.config.srcTextareaId;
        } else if (opener && opener.targetElement) {
            srcElement = opener.targetElement;
        }

        if (srcElement) {
            me.$(me.config.finalTextareaSelector).val(me.$(srcElement).text());
            if (!me.$(me.config.finalTextareaSelector).value) {
                me.$(me.config.finalTextareaSelector).val(me.$(srcElement).val());
            }
        }
    };

    /**
     * publish result of SpeechRecognition
     * @param {boolean} forceCloseWindow      if it is opened in a new window close it
     */
    me.publishResult = function (forceCloseWindow) {
        // Text vorbereiten
        var str = me.$(me.config.finalTextareaSelector).val();
        str = str.replace(/<\/?.*?\/?>/g, String.fromCharCode(13));

        if (me.config.srcTextareaId) {
            var $element = me.$('#' + me.config.srcTextareaId);
            $element.val(str);
            me.appBase.DataUtils.callUpdateTriggerForElement($element);
            if (window.callUpdateTriggerForElement) {
                // fallback
                window.callUpdateTriggerForElement($element);
            }
        } else if (opener && opener.targetElement) {
            // text an Opener uebergeben
            opener.targetElement.value = str;
            if (opener.callUpdateTriggerForElement) {
                opener.callUpdateTriggerForElement(opener.targetElement);
            }

            // Fenster schließen
            if (forceCloseWindow) {
                window.close();
            }
        }
    };

    /**
     * button-handler: start recognition
     */
    me._startRecognition = function () {
        if (recognizing) {
            me.recognition.stop();
            return;
        }
        finalTranscript = me.$(me.config.finalTextareaSelector).val();
        me.recognition.lang = 'de-de';
        me.recognition.start();
        ignoreOnEnd = false;
        me.$(me.config.interimSpanSelector).html('');
        me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcStop);

        me._showInfo('jsh-sr-info-allow');
        startTimestamp = event.timeStamp;
    };

    /**
     * button-handler: stop recognition and publish result
     */
    me._stopRecognition = function () {
        me.publishResult(true);
    };

    /**
     * init the ui (widget, button-handler...)
     */
    me._initUi = function () {
        me.speechRecognitionWidget = new JsHelferlein.SpeechRecognitionBox(me.appBase);
        if (me.appBase.getDetector('SpeechRecognitionDetector').isSupported()) {
            me._initRecognition();
            me._initControllerElements();
        } else {
            var svcLogger = me.appBase.Logger;
            if (svcLogger && svcLogger.isWarning) {
                svcLogger.logWarning('JsHelferlein.SpeechRecognitionController.initUi: speechsynth not suppoorted');
            }
            me._disableControllerElements();
        }
    };

    /**
     * init the recognition-engine (language...)
     */
    me._initRecognition = function () {
        // Erkennung aktivieren
        me.recognition = new webkitSpeechRecognition();

        // Diktat aktivieren: fuehrt nach Pause fort
        me.recognition.continuous = true;

        // interim results aendern sich nachtraeglich
        me.recognition.interimResults = true;

        // add language
        me.recognition.lang = 'de-DE';

        // Handler

        // beim Start
        me.recognition.onstart = function () {
            recognizing = true;
            me._showInfo('jsh-sr-info-speak-nowr');
            me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcRunning);
        };

        // Am Ende
        me.recognition.onerror = function (event) {
            if (event.error === 'no-speech') {
                me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcStart);
                me._showInfo('jsh-sr-info-no-speech');
                ignoreOnEnd = true;
            }
            if (event.error === 'audio-capture') {
                me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcStart);
                me._showInfo('jsh-sr-info-no-microphone');
                ignoreOnEnd = true;
            }
            if (event.error === 'not-allowed') {
                if (event.timeStamp - startTimestamp < 100) {
                    me._showInfo('jsh-sr-info-blocked');
                } else {
                    me._showInfo('jsh-sr-info-denied');
                }
                ignoreOnEnd = true;
            }
        };

        me.recognition.onend = function () {
            recognizing = false;
            if (ignoreOnEnd) {
                return;
            }
            me.$(me.config.statusImgSelector).attr('src', me.config.statusImgSrcStart);
            if (!finalTranscript) {
                me._showInfo('jsh-sr-info-start');
                return;
            }
            me._showInfo('');
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                range.selectNode(me.$(me.config.finalTextareaSelector)[0]);
                window.getSelection().addRange(range);
            }
        };

        me.recognition.onresult = function (event) {
            var interimTranscript = '';
            finalTranscript = me.$(me.config.finalTextareaSelector).val();
            if (typeof (event.results) === 'undefined') {
                me.recognition.onend = null;
                me.recognition.stop();
                me.upgrade();
                return;
            }

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += ' ' + event.results[i][0].transcript;
                } else {
                    interimTranscript += ' ' + event.results[i][0].transcript;
                }
            }
            finalTranscript = me._capitalize(finalTranscript);
            me.$(me.config.finalTextareaSelector).val(me._linebreak(finalTranscript));
            me.$(me.config.interimSpanSelector).html(me._linebreak(interimTranscript));
        };
    };

    /**
     * init the controller-elements of the ui (buttons)
     */
    me._initControllerElements = function () {
        if (me.config.isSet('buttonStartSelector')) {
            me.$(me.config.buttonStartSelector).click(me._startRecognition);
        }
        if (me.config.isSet('buttonStopSelector')) {
            me.$(me.config.buttonStopSelector).click(me._stopRecognition);
        }
    };

    /**
     * disable the controller-elements of the ui (buttons)
     */
    me._disableControllerElements = function () {
        if (me.config.isSet('buttonStartSelector')) {
            me.$(me.config.buttonStartSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonStopSelector')) {
            me.$(me.config.buttonStopSelector).attr('disabled', 'disabled');
        }
    };

    /**
     * show static infos about recognition result
     * @param {string} s            
     */
    me._showInfo = function (s) {
        if (!me.config.isSet('infoDivSelector')) {
            return;
        }
        var $info = me.$(me.config.infoDivSelector);
        if (s) {
            me.$($info).children().each(function(idx, child) {
                me.$(child).css('display', me.$(child).attr('id') === s ? 'inline' : 'none');
            });
            me.$($info.css('visibility', 'visible'));
        } else {
            me.$($info.css('visibility', 'hidden'));
        }
    };

    /**
     * escape linebreaks with html-linebreaks
     * @param {string} s           source to parse
     * @returns {string}           resulting html             
     */
    me._linebreak = function (s) {
        return s.replace(regExTwoLines, '<p></p>').replace(regExOneLine, '<br>');
    };

    /**
     * capitalize first letter of the words 
     * @param {string} s           source to parse
     * @returns {string}           resulting html             
     */
    me._capitalize = function (s) {
        return s.replace(regExFirstChar, function (m) {
            return m.toUpperCase();
        });
    };

    // init all
    me._init();

    return me;
};