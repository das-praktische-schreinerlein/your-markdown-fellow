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
 * services for adding SpeechSynth-support to your app
 * 
 * @param {JsHelferlein.AppBase} appBase                 appBase of the application
 * @param {JsHelferlein.SpeechSynthConfig} config        optional configuration (default JsHelferlein.SpeechSynthConfig)
 * @return {JsHelferlein.SpeechSynthController}          an instance of the service
 * @augments JsHelferlein.ServiceBase
 * @constructor
 */
JsHelferlein.SpeechSynthController = function (appBase, config) {
    'use strict';

    var me = JsHelferlein.ServiceBase(appBase, config, JsHelferlein.SpeechSynthConfig());

    /**
     * initialize the widget and synth-engine
     */
    me._init = function () {
        me._initUi();
        window.onbeforeunload = function (e) {
            me._stopSpeech();
        };
    };

    /**
     * open an SpeechSynth-widget with the content of textareaId
     * @param {string} textareaId      textareaId to get the content to be told by SpeechSynth
     */
    me.open = function(textareaId) {
        me.initSrc(textareaId);
        me.speechSynthWidget.open();
    };

    /**
     * init an SpeechSynth-widget with the content of textareaId
     * @param {string} textareaId      textareaId to get the content to be told by SpeechSynth
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
            me.$(me.config.textareaFinalSelector).val(me.$(srcElement).text());
            if (!me.$(me.config.textareaFinalSelector).val()) {
                me.$(me.config.textareaFinalSelector).val(me.$(srcElement).val());
            }
        }
    };

    me._startSpeech = function () {
        me._stopSpeech();
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).removeAttr('disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).attr('disabled', 'disabled');
        }
        me._splitOrSpeakText(me.$(me.config.textareaFinalSelector).val(), me.config.splitChars, 0, 150);
    };

    me._pauseSpeech = function () {
        window.speechSynthesis.pause();
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).removeAttr('disabled');
        }
    };

    me._resumeSpeech = function () {
        window.speechSynthesis.resume();
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).removeAttr('disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).attr('disabled', 'disabled');
        }
    };

    me._stopSpeech = function () {
        for (var i = 1; i < 100; i++) {
            window.speechSynthesis.cancel(); // if it errors, this clears out the error.
        }
    };

    me._initUi = function () {
        me.speechSynthWidget = new JsHelferlein.SpeechSynthBox(me.appBase);
        if (me.appBase.getDetector('SpeechSynthDetector').isSupported()) {
            me._initVoices();
            me._initControllerElements();
        } else {
            var svcLogger = me.appBase.Logger;
            if (svcLogger && svcLogger.isWarning) {
                svcLogger.logWarning('JsHelferlein.SpeechSynthController.initUi: speechsynth not supported');
            }
            me._disableControllerElements();
        }
    };

    me._initVoices = function () {
        // inspired by http://www.sitepoint.com/talking-web-pages-and-the-speech-synthesis-api/
        // init voice config
        me.$voices = me.$(me.config.selectVoiceSelector);

        // Workaround for a Chrome issue (#340160 - https://code.google.com/p/chromium/issues/detail?id=340160)
        var svcLogger = me.appBase.Logger;
        var watch = setInterval(function () {
            // Load all voices available
            var voicesAvailable = speechSynthesis.getVoices();
            if (voicesAvailable.length !== 0) {
                var select = '';
                for (var i = 0; i < voicesAvailable.length; i++) {
                    var selected = '';
                    if (voicesAvailable[i].lang === me.config.defaultLang) {
                        selected = ' selected ';
                    }
                    svcLogger.logDebug('_initVoices add voice:' + voicesAvailable[i].name);
                    select += '<option value="' + voicesAvailable[i].lang + '"' +
                        'data-voice-uri="' + voicesAvailable[i].voiceURI + '"' + selected + '>' +
                        voicesAvailable[i].name +
                        (voicesAvailable[i].default ? ' (default)' : '') + '</option>';
                }
                svcLogger.logDebug('_initVoices set voices:', select);
                me.$voices.html(select);
                clearInterval(watch);
            }
        }, 1);
    };

    me._initControllerElements = function () {
        me.$rate = me.$(me.config.inputRateSelector);
        me.$pitch = me.$(me.config.inputPitchSelector);
        if (me.config.isSet('buttonStartSelector')) {
            me.$(me.config.buttonStartSelector).click(me._startSpeech);
        }
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).click(me._pauseSpeech);
            me.$(me.config.buttonPauseSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).click(me._resumeSpeech);
            me.$(me.config.buttonResumeSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonStopSelector')) {
            me.$(me.config.buttonStopSelector).click(me._stopSpeech);
        }
    };

    me._disableControllerElements = function () {
        if (me.config.isSet('buttonStartSelector')) {
            me.$(me.config.buttonStartSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonPauseSelector')) {
            me.$(me.config.buttonPauseSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonResumeSelector')) {
            me.$(me.config.buttonResumeSelector).attr('disabled', 'disabled');
        }
        if (me.config.isSet('buttonStopSelector')) {
            me.$(me.config.buttonStopSelector).attr('disabled', 'disabled');
        }
    };

    me._createSpeaker = function () {
        var msg = new SpeechSynthesisUtterance();
        var svcLogger = me.appBase.Logger;

        var $selectedVoice = me.$voices.find(':selected');
        var rate = parseFloat(me.$rate.val());
        var pitch = parseFloat(me.$pitch.val());
        svcLogger.logDebug('_createSpeaker voice:' + $selectedVoice.attr('data-voice-uri') + ' rate:' + rate + ' pitch:' + pitch);
        msg.voice = $selectedVoice.attr('data-voice-uri'); // Note: some voices don't support altering params
        msg.voiceURI = 'native';
        msg.lang = $selectedVoice.val();
        msg.volume = 1; // 0 to 1
        msg.rate = rate; // 0.1 to 10
        msg.pitch = pitch; //0 to 2

        // create handler
        msg.onstart = function (event) {
            svcLogger.logDebug('started:' + event + ' text:' + msg.text);
        };
        msg.onend = function (event) {
            svcLogger.logDebug('Finished in ' + event.elapsedTime + ' seconds.');
        };
        msg.onerror = function (event) {
            svcLogger.logError('Errored ' + event, false);
        };
        msg.onpause = function (event) {
            svcLogger.logDebug('paused ' + event);
        };
        msg.onboundary = function (event) {
            svcLogger.logDebug('onboundary ' + event);
        };

        return msg;
    };

    me._speakText = function (text) {
        var svcLogger = me.appBase.Logger;
        var speaker = me._createSpeaker();
        svcLogger.logDebug('say text: ' + text);
        speaker.text = text;
        window.speechSynthesis.speak(speaker);
    };

    me._splitOrSpeakText = function (text, splitterStr, ebene, maxLength) {
        // inspired by http://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
        var svcLogger = me.appBase.Logger;

        // set default maxLength if not set
        if (maxLength < 100) {
            maxLength = 100;
        }

        // split sentences
        var splitter = splitterStr.substr(ebene, 1);
        var sentences = [];

        // if last splitChar rechaed, split by splitwords
        if (ebene >= splitterStr.length) {
            // split at last splitword before maxLength
            var nextText = '';
            var wordIndex = 0;

            // interate splitwords till text < maxLength
            do {
                var splitWord = me.config.splitWords[wordIndex];
                var pos = text.lastIndexOf(splitWord);
                while (pos > 0 && text.length > maxLength) {
                    // iterate until splitword found before maxLength
                    nextText = text.substr(pos) + nextText;
                    text = text.substr(0, pos);
                    pos = text.lastIndexOf(splitWord);
                    svcLogger.logDebug('split by word:"' + splitWord + '" text:"' + text + '" nextText:"' + nextText + '"');
                }
                wordIndex++;
            } while (wordIndex < me.config.splitWords.length && text.length > maxLength);

            // fallback if text > maxLength
            if (text.length > maxLength) {
                // attempt to split a ' ' before maxLength
                var posSpace = text.indexOf(' ');
                var text1, text2;
                if ((posSpace <= 0 || posSpace > maxLength)) {
                    // not ' ' before maxLength -> do it hard
                    text1 = text.substr(0, maxLength);
                    text2 = text.substr(maxLength);
                    svcLogger.logDebug('split texthard text1:"' + text1 + '" text2:"' + text2 + '"');
                    sentences = [text1, text2];
                } else {
                    // split at space   
                    text1 = text.substr(0, posSpace);
                    text2 = text.substr(posSpace);
                    svcLogger.logDebug('split space text1:"' + text1 + '" text2:"' + text2 + '"');
                    sentences = [text1, text2];
                }
            } else {
                // add text
                sentences.push(text);
            }

            // add nextText
            sentences.push(nextText);
        } else {
            // split text by splitter
            svcLogger.logDebug('split by:"' + splitter + '" ebene:' + ebene);
            sentences = text.split(splitter);
        }

        // iterate sentences
        for (var i = 0; i < sentences.length; i++) {
            if (sentences[i].length > maxLength) {
                // sentence  > maxLength: split it with next splitChar
                svcLogger.logDebug('split new ' + i + ' sentences[i]:' + sentences[i]);
                me._splitOrSpeakText(sentences[i], splitterStr, ebene + 1);
            } else {
                // sentence ok: say it
                svcLogger.logDebug('say i: ' + i + ' sentences[i]:' + sentences[i]);
                me._speakText(sentences[i] + splitter);
            }
        }
    };

    // init all
    me._init();

    return me;
};