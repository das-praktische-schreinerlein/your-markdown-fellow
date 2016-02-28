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
 * base module of an app (with service-configuration...)
 * 
 * @param {JsHelferlein.AppBaseConfig} config          optional configuration (default JsHelferlein.AppBaseConfig)
 * @constructor
 */
JsHelferlein.AppBase = function (config) {
    'use strict';

    // create my own instance
    var me = {};

    /**
     * initialize the app 
     */
    me._init = function () {
        // check Config
        me.config = me.checkConfig(config, JsHelferlein.AppBaseConfig());

        me._configureDefaultServices();
        me._configureDefaultDetectors();
    };

    // vars
    me.serviceConfigs = [];
    me.services = [];
    me.detectors = [];
    me.props = [];
    me.config = {};

    /**
     * configure service
	 * @param {string} serviceName         name of the service
	 * @param {function} constrCallBack    constructor of the service
     */
    me.configureService = function (serviceName, constrCallBack) {
        console.log('configureService: set new serviceconfig:' + serviceName);
        // delete all instances
        if (me.services[serviceName]) {
            console.log('configureService: delete instance for serviceconfig:' + serviceName);
            me.services[serviceName] = null;
            me.services.splice(me.services.indexOf(serviceName), 1);
        }
        if (me.services.hasOwnProperty(serviceName)) {
            console.log('configureService: delete instance for serviceconfig:' + serviceName);
            me.services.splice(me.services.indexOf(serviceName), 1);
        }

        // define service as property
        console.log('configureService:' + serviceName);
        Object.defineProperty(me, serviceName, {
            get: function () {
                return me.getService(serviceName);
            },
            enumerable: true,
            configurable: true,
            true: false
        });

        me.serviceConfigs[serviceName] = constrCallBack;
    };

    /**
     * get configured service-constructor
	 * @param {string} serviceName         name of the service
	 * @return {function}                  constrCallBack of the service
     */
    me.getServiceConfig = function (serviceName) {
        return me.serviceConfigs[serviceName];
    };

    /**
     * set service
	 * @param {string} serviceName                          name of the service
	 * @param {JsHelferlein.ServiceBase} serviceInstance    instance of the service
     */
    me.setService = function (serviceName, serviceInstance) {
        me.services[serviceName] = serviceInstance;
    };

    /**
     * get service
	 * @param {string} serviceName           name of the service
	 * @return {JsHelferlein.ServiceBase}    instance of the service
     */
    me.getService = function (serviceName) {
        if (!me.services[serviceName]) {
            console.log('create new instance of:' + serviceName);
            if (me.serviceConfigs.hasOwnProperty(serviceName)) {
                var constr = me.getServiceConfig(serviceName);
                var service;
                if (typeof constr === 'function') {
                    service = constr(me);
                } else {
                    service = constr;
                }
                me.setService(serviceName, service);
            }
        }
        return me.services[serviceName];
    };

    /**
     * set service
	 * @param {string} serviceName                          name of the service
	 * @param {JsHelferlein.ServiceBase} serviceInstance    instance of the service
     */
    me.set = function (serviceName, serviceInstance) {
        me.setService(serviceName, serviceInstance);
    };

    /**
     * get service
	 * @param {string} serviceName        name of the service
	 * @return {JsHelferlein.ServiceBase} instance of the service
     */
    me.get = function (serviceName) {
        return me.getService(serviceName);
    };


    /**
     * set detector
	 * @param {string} detectorName                           name of the detector
	 * @param {JsHelferlein.DetectorBase} detectorInstance    instance of the detector
     */
    me.setDetector = function (detectorName, detectorInstance) {
        me.detectors[detectorName] = detectorInstance;
    };

    /**
     * get detector
	 * @param {string} detectorName          name of the detector
	 * @return {JsHelferlein.DetectorBase}   instance of the detector
     */
    me.getDetector = function (detectorName) {
        return me.detectors[detectorName];
    };


    /**
     * set property
	 * @param {string} propName      name of the property
	 * @param {Object} value         value of the property
     */
    me.setProp = function (propName, value) {
        me.props[propName] = value;
    };

    /**
     * read property
	 * @param {string} propName      name of the property
	 * @return {Object}              value of the property
     */
    me.getProp = function (propName) {
        return me.props[propName];
    };

    /**
     * check and merge config with defaultConfig
     * 
	 * @param {JsHelferlein.ConfigBase} config         optional configuration
	 * @param {JsHelferlein.ConfigBase} defaultConfig  default configuration
	 * @return {JsHelferlein.ConfigBase}               merged configuration
     */
    me.checkConfig = function (config, defaultConfig) {
        if (!config) {
            console.log('no config: use default:', defaultConfig);
            return defaultConfig;
        }
        console.log('config set use:', config);
        for (var propName in defaultConfig) {
            if (!defaultConfig.hasOwnProperty(propName)) {
                continue;
            }
            if (!config.hasOwnProperty(propName)) {
                console.log('option not set: use default: ' + propName, defaultConfig[propName]);
                config[propName] = defaultConfig[propName];
            }
        }

        return config;
    };


    /**
     * publish detector-css-styles for all configured detectors to DOM
     */
    me.publishDetectorStyles = function () {
        var styles = '';
        console.log('detectrors', me.detectors);
        for (var detectorName in me.detectors) {
            if (!me.detectors.hasOwnProperty(detectorName)) {
                continue;
            }
            console.log('detectror' + detectorName);
            styles += me.getDetector(detectorName).generateStyles();
        }
        me.DOMHelper.insertStyleBeforeScript(styles);
        me.DOMHelper.appendStyleAtEnd(styles);
        if (me.Logger && me.Logger.isDebug) {
            me.Logger.logDebug('JsHelferlein.AppBase.publishDetectorStyles ' + styles);
        }
    };

    /**
     * configure the services of the app 
     */
    me._configureDefaultServices = function () {
        me.configureService('jQuery', function () {
            return $;
        });
        me.configureService('$', function () {
            return $;
        });

        // configure instances
        me.configureService('JsHelferlein.Logger', function () {
            return JsHelferlein.Logger(me);
        });
        me.configureService('JsHelferlein.DOMHelper', function () {
            return JsHelferlein.DOMHelper(me);
        });
        me.configureService('JsHelferlein.DataUtils', function () {
            return JsHelferlein.DataUtils(me);
        });
        me.configureService('JsHelferlein.FileUtils', function () {
            return JsHelferlein.FileUtils(me);
        });
        me.configureService('JsHelferlein.UIDialogs', function () {
            return JsHelferlein.UIDialogs(me);
        });
        me.configureService('JsHelferlein.UIToggler', function () {
            return JsHelferlein.UIToggler(me);
        });
        me.configureService('JsHelferlein.SpeechServiceHelper', function () {
            return JsHelferlein.SpeechServiceHelper(me);
        });
        me.configureService('JsHelferlein.SpeechSynthController', function () {
            return JsHelferlein.SpeechSynthController(me);
        });
        me.configureService('JsHelferlein.SpeechRecognitionController', function () {
            return JsHelferlein.SpeechRecognitionController(me);
        });
        me.configureService('JsHelferlein.DiagramWidgets', function () {
            return JsHelferlein.DiagramWidgets(me);
        });
        me.configureService('JsHelferlein.ChecklistParser', function () {
            return JsHelferlein.ChecklistParser(me);
        });
        me.configureService('JsHelferlein.MermaidParser', function () {
            return JsHelferlein.MermaidParser(me);
        });
        me.configureService('JsHelferlein.MindmapParser', function () {
            return JsHelferlein.MindmapParser(me);
        });
        me.configureService('JsHelferlein.PlantumlParser', function () {
            return JsHelferlein.PlantumlParser(me);
        });
        me.configureService('JsHelferlein.ImageSlimboxParser', function () {
            return JsHelferlein.ImageSlimboxParser(me);
        });
        me.configureService('JsHelferlein.SyntaxHighlighterParser', function () {
            return JsHelferlein.SyntaxHighlighterParser(me);
        });
        me.configureService('JsHelferlein.MarkdownRenderer', function () {
            return JsHelferlein.MarkdownRenderer(me);
        });
        me.configureService('JsHelferlein.Renderer', function () {
            return JsHelferlein.Renderer(me);
        });

        // configure aliases
        me.configureService('Logger', function () {
            return me.get('JsHelferlein.Logger');
        });
        me.configureService('DOMHelper', function () {
            return me.get('JsHelferlein.DOMHelper');
        });
        me.configureService('UIDialogs', function () {
            return me.get('JsHelferlein.UIDialogs');
        });
        me.configureService('UIToggler', function () {
            return me.get('JsHelferlein.UIToggler');
        });
        me.configureService('DataUtils', function () {
            return me.get('JsHelferlein.DataUtils');
        });
        me.configureService('FileUtils', function () {
            return me.get('JsHelferlein.FileUtils');
        });
        me.configureService('SpeechServiceHelper', function () {
            return me.get('JsHelferlein.SpeechServiceHelper');
        });
        me.configureService('SpeechSynthController', function () {
            return me.get('JsHelferlein.SpeechSynthController');
        });
        me.configureService('SpeechRecognitionController', function () {
            return me.get('JsHelferlein.SpeechRecognitionController');
        });
        me.configureService('DiagramWidgets', function () {
            return me.get('JsHelferlein.DiagramWidgets');
        });
        me.configureService('ChecklistParser', function () {
            return me.get('JsHelferlein.ChecklistParser');
        });
        me.configureService('MermaidParser', function () {
            return me.get('JsHelferlein.MermaidParser');
        });
        me.configureService('MindmapParser', function () {
            return me.get('JsHelferlein.MindmapParser');
        });
        me.configureService('PlantumlParser', function () {
            return me.get('JsHelferlein.PlantumlParser');
        });
        me.configureService('ImageSlimboxParser', function () {
            return me.get('JsHelferlein.ImageSlimboxParser');
        });
        me.configureService('SyntaxHighlighterParser', function () {
            return me.get('JsHelferlein.SyntaxHighlighterParser');
        });
        me.configureService('MarkdownRenderer', function () {
            return me.get('JsHelferlein.MarkdownRenderer');
        });
        me.configureService('Renderer', function () {
            return me.get('JsHelferlein.Renderer');
        });
    };

    /**
     * configure the detectors of the app 
     */
    me._configureDefaultDetectors = function () {
        me.setDetector('JavascriptDetector', JsHelferlein.JavascriptDetector(me));
        me.setDetector('SpeechSynthDetector', JsHelferlein.SpeechSynthDetector(me));
        me.setDetector('SpeechRecognitionDetector', JsHelferlein.SpeechRecognitionDetector(me));
    };

    // init all
    me._init();

    return me;
};
